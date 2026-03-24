import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { MenuItem, CartItem, Order, Category } from "@/data/menuData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RestaurantContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  placeOrder: (customerName: string, tableNumber: string, notes: string) => void;
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const useRestaurant = () => {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error("useRestaurant must be used within RestaurantProvider");
  return ctx;
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching menu:", error);
      } else {
        setMenuItems(
          (data || []).map((row: any) => ({
            id: row.id,
            name: row.name,
            price: Number(row.price),
            category: row.category as Category,
            image: row.image,
            description: row.description,
            available: row.available,
          }))
        );
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        return;
      }
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("*");
      if (itemsError) {
        console.error("Error fetching order items:", itemsError);
        return;
      }

      const mapped: Order[] = (ordersData || []).map((o: any) => {
        const oItems = (itemsData || [])
          .filter((i: any) => i.order_id === o.id)
          .map((i: any) => ({
            menuItem: {
              id: i.menu_item_id,
              name: i.menu_item_name,
              price: Number(i.menu_item_price),
              category: "Food" as Category,
              image: "",
              description: "",
              available: true,
            },
            quantity: i.quantity,
          }));
        return {
          id: o.id,
          customerName: o.customer_name,
          tableNumber: o.table_number,
          notes: o.notes,
          items: oItems,
          total: Number(o.total),
          status: o.status as Order["status"],
          createdAt: new Date(o.created_at),
        };
      });
      setOrders(mapped);
    };
    fetchOrders();

    // Realtime subscription for orders
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    toast({ title: "Added to cart", description: `${item.name} added` });
  }, [toast]);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  }, []);

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === itemId ? { ...c, quantity } : c))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const placeOrder = useCallback(
    async (customerName: string, tableNumber: string, notes: string) => {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({ customer_name: customerName, table_number: tableNumber, notes, total: cartTotal, status: "pending" })
        .select()
        .single();

      if (orderError || !orderData) {
        toast({ title: "Error placing order", variant: "destructive" });
        return;
      }

      const orderItems = cart.map((c) => ({
        order_id: orderData.id,
        menu_item_id: c.menuItem.id,
        menu_item_name: c.menuItem.name,
        menu_item_price: c.menuItem.price,
        quantity: c.quantity,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) {
        console.error("Error inserting order items:", itemsError);
      }

      setCart([]);
      toast({ title: "Order placed! 🎉", description: `Order confirmed` });
    },
    [cart, cartTotal, toast]
  );

  const addMenuItem = useCallback(
    async (item: Omit<MenuItem, "id">) => {
      const { data, error } = await supabase
        .from("menu_items")
        .insert({ name: item.name, price: item.price, category: item.category, image: item.image, description: item.description, available: item.available })
        .select()
        .single();

      if (error) {
        toast({ title: "Error adding item", variant: "destructive" });
        return;
      }
      setMenuItems((prev) => [...prev, { ...item, id: data.id }]);
      toast({ title: "Menu item added", description: item.name });
    },
    [toast]
  );

  const updateMenuItem = useCallback(
    async (id: string, updates: Partial<MenuItem>) => {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.available !== undefined) dbUpdates.available = updates.available;

      const { error } = await supabase.from("menu_items").update(dbUpdates).eq("id", id);
      if (error) {
        toast({ title: "Error updating item", variant: "destructive" });
        return;
      }
      setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
      toast({ title: "Menu item updated" });
    },
    [toast]
  );

  const deleteMenuItem = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) {
        toast({ title: "Error deleting item", variant: "destructive" });
        return;
      }
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Menu item deleted", variant: "destructive" });
    },
    [toast]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: Order["status"]) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) {
        toast({ title: "Error updating status", variant: "destructive" });
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast({ title: `Order status: ${status}` });
    },
    [toast]
  );

  return (
    <RestaurantContext.Provider
      value={{
        menuItems, cart, orders, loading,
        addToCart, removeFromCart, updateCartQuantity, clearCart,
        cartTotal, cartCount, placeOrder,
        addMenuItem, updateMenuItem, deleteMenuItem, updateOrderStatus,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
