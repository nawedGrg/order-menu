import { useRestaurant } from "@/context/RestaurantContext";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList } from "lucide-react";
import { Order } from "@/data/menuData";

const statusColors: Record<Order["status"], string> = {
  pending: "bg-warning/20 text-warning",
  preparing: "bg-primary/20 text-primary",
  completed: "bg-success/20 text-success",
};

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useRestaurant();

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ClipboardList className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground font-body">No orders yet. Orders from customers will appear here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Orders ({orders.length})</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-body font-semibold">
                  #{order.id.slice(-4)} — {order.customerName}
                </h3>
                <p className="text-sm text-muted-foreground font-body">
                  Table {order.tableNumber} · {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                </p>
                {order.notes && <p className="text-sm text-muted-foreground font-body italic mt-1">"{order.notes}"</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-body px-2 py-1 rounded-full font-semibold ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <Select value={order.status} onValueChange={(v) => updateOrderStatus(order.id, v as Order["status"])}>
                  <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between text-sm font-body">
                    <span>{item.quantity}× {item.menuItem.name}</span>
                    <span className="text-muted-foreground">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t border-border font-body font-bold">
                <span>Total</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
