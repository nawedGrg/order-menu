import { useState } from "react";
import { useRestaurant } from "@/context/RestaurantContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, UtensilsCrossed } from "lucide-react";
import { MenuItem, Category, categories } from "@/data/menuData";
import { motion, AnimatePresence } from "framer-motion";

const emptyForm = { name: "", price: "", category: "Food" as Category, image: "", description: "", available: true };

const AdminMenuManagement = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useRestaurant();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditingItem(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({ name: item.name, price: item.price.toString(), category: item.category, image: item.image, description: item.description, available: item.available });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, price: parseFloat(form.price), category: form.category, image: form.image, description: form.description, available: form.available };
    if (editingItem) {
      updateMenuItem(editingItem.id, data);
    } else {
      addMenuItem(data);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Menu Items</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label className="font-body text-sm">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div><Label className="font-body text-sm">Price</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
              <div>
                <Label className="font-body text-sm">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="font-body text-sm">Image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
              <div><Label className="font-body text-sm">Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} />
                <Label className="font-body text-sm">Available</Label>
              </div>
              <Button type="submit" className="w-full">{editingItem ? "Save Changes" : "Add Item"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {menuItems.length === 0 ? (
        <Card className="p-12 text-center">
          <UtensilsCrossed className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-body">No menu items yet. Add your first item!</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {menuItems.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="p-4 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-body font-semibold truncate">{item.name}</h4>
                      {!item.available && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full font-body">Out of stock</span>}
                    </div>
                    <p className="text-sm text-muted-foreground font-body">{item.category} · ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch checked={item.available} onCheckedChange={(v) => updateMenuItem(item.id, { available: v })} />
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {item.name}?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMenuItem(item.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AdminMenuManagement;
