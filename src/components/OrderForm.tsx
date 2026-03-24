import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRestaurant } from "@/context/RestaurantContext";

interface OrderFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const OrderForm = ({ onCancel, onSuccess }: OrderFormProps) => {
  const { placeOrder } = useRestaurant();
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !table.trim()) return;
    placeOrder(name.trim(), table.trim(), notes.trim());
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="name" className="text-sm font-body">Your Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
      </div>
      <div>
        <Label htmlFor="table" className="text-sm font-body">Table Number</Label>
        <Input id="table" value={table} onChange={(e) => setTable(e.target.value)} placeholder="e.g. 5" required />
      </div>
      <div>
        <Label htmlFor="notes" className="text-sm font-body">Notes (optional)</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any allergies or preferences?" rows={2} />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" className="flex-1">Place Order</Button>
      </div>
    </form>
  );
};

export default OrderForm;
