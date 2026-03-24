import React, { createContext, useContext, useState, useCallback } from "react";
import { MenuItem, CartItem, Order, initialMenuItems } from "@/data/menuData";
import { useToast } from "@/hooks/use-toast";

interface RestaurantContextType {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

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
    (customerName: string, tableNumber: string, notes: string) => {
      const order: Order = {
        id: Date.now().toString(),
        customerName,
        tableNumber,
        notes,
        items: [...cart],
        total: cartTotal,
        status: "pending",
        createdAt: new Date(),
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      toast({ title: "Order placed! 🎉", description: `Order #${order.id.slice(-4)} confirmed` });
    },
    [cart, cartTotal, toast]
  );

  const addMenuItem = useCallback(
    (item: Omit<MenuItem, "id">) => {
      const newItem: MenuItem = { ...item, id: Date.now().toString() };
      setMenuItems((prev) => [...prev, newItem]);
      toast({ title: "Menu item added", description: item.name });
    },
    [toast]
  );

  const updateMenuItem = useCallback(
    (id: string, updates: Partial<MenuItem>) => {
      setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
      toast({ title: "Menu item updated" });
    },
    [toast]
  );

  const deleteMenuItem = useCallback(
    (id: string) => {
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Menu item deleted", variant: "destructive" });
    },
    [toast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: Order["status"]) => {
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
        menuItems, cart, orders,
        addToCart, removeFromCart, updateCartQuantity, clearCart,
        cartTotal, cartCount, placeOrder,
        addMenuItem, updateMenuItem, deleteMenuItem, updateOrderStatus,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};
