import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/data/menuData";
import { useRestaurant } from "@/context/RestaurantContext";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

const MenuCard = ({ item, index }: MenuCardProps) => {
  const { addToCart } = useRestaurant();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="text-primary-foreground font-body font-semibold text-sm bg-destructive px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-lg text-card-foreground leading-tight">
            {item.name}
          </h3>
          <span className="text-primary font-body font-bold text-lg whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm font-body line-clamp-2">{item.description}</p>
        <Button
          onClick={() => addToCart(item)}
          disabled={!item.available}
          size="sm"
          className="w-full mt-2 gap-2"
        >
          <Plus className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default MenuCard;
