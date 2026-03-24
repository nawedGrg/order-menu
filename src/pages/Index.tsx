import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, UtensilsCrossed, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero3D from "@/components/Hero3D";
import MenuCard from "@/components/MenuCard";
import CartSidebar from "@/components/CartSidebar";
import { useRestaurant } from "@/context/RestaurantContext";
import { categories, Category } from "@/data/menuData";

const Index = () => {
  const { menuItems, cartCount } = useRestaurant();
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filtered = activeCategory === "All"
    ? menuItems
    : menuItems.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl">Tastebud</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="relative gap-2"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-body font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* 3D Hero */}
        <Hero3D />

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(cat as Category | "All")}
              className="font-body"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground font-body text-lg">No items in this category yet.</p>
              </div>
            ) : (
              filtered.map((item, i) => <MenuCard key={item.id} item={item} index={i} />)
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile sticky cart */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 md:hidden"
        >
          <Button size="lg" onClick={() => setCartOpen(true)} className="rounded-full shadow-lg gap-2 px-6">
            <ShoppingBag className="w-5 h-5" />
            View Cart ({cartCount})
          </Button>
        </motion.div>
      )}

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;
