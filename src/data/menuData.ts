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

export const initialMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Classic Smash Burger",
    price: 14.99,
    category: "Food",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    description: "Double patty with cheddar, pickles, and secret sauce",
    available: true,
  },
  {
    id: "2",
    name: "Margherita Pizza",
    price: 16.99,
    category: "Food",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop",
    description: "Fresh mozzarella, basil, and San Marzano tomatoes",
    available: true,
  },
  {
    id: "3",
    name: "Grilled Salmon",
    price: 22.99,
    category: "Food",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    description: "Atlantic salmon with lemon butter and asparagus",
    available: true,
  },
  {
    id: "4",
    name: "Caesar Salad",
    price: 11.99,
    category: "Food",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    description: "Romaine lettuce, parmesan, croutons, and caesar dressing",
    available: true,
  },
  {
    id: "5",
    name: "Iced Matcha Latte",
    price: 5.99,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop",
    description: "Ceremonial grade matcha with oat milk",
    available: true,
  },
  {
    id: "6",
    name: "Fresh Orange Juice",
    price: 4.99,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    description: "Freshly squeezed Valencia oranges",
    available: true,
  },
  {
    id: "7",
    name: "Craft Lemonade",
    price: 4.49,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=400&h=300&fit=crop",
    description: "House-made with lavender and honey",
    available: false,
  },
  {
    id: "8",
    name: "Tiramisu",
    price: 8.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    description: "Classic Italian dessert with mascarpone and espresso",
    available: true,
  },
  {
    id: "9",
    name: "Chocolate Lava Cake",
    price: 9.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop",
    description: "Warm chocolate cake with molten center",
    available: true,
  },
  {
    id: "10",
    name: "Crème Brûlée",
    price: 7.99,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop",
    description: "Vanilla bean custard with caramelized sugar",
    available: true,
  },
];
