export type Category = "Drinks" | "Food" | "Desserts";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description: string;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  notes: string;
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "completed";
  createdAt: Date;
}

export const categories: Category[] = ["Food", "Drinks", "Desserts"];
