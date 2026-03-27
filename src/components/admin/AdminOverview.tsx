import { useRestaurant } from "@/context/RestaurantContext";
import { Card } from "@/components/ui/card";
import { UtensilsCrossed, ClipboardList, DollarSign, TrendingUp } from "lucide-react";

const AdminOverview = () => {
  const { menuItems, orders } = useRestaurant();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const stats = [
    { label: "Menu Items", value: menuItems.length, icon: UtensilsCrossed, color: "text-primary" },
    { label: "Total Orders", value: orders.length, icon: ClipboardList, color: "text-accent-foreground" },
    { label: "Pending", value: pendingOrders, icon: TrendingUp, color: "text-warning" },
    { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-muted ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-body">{s.label}</p>
              <p className="text-2xl font-display font-bold">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardList className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-body">No orders yet. Orders will appear here once customers start ordering.</p>
        </Card>
      ) : (
        <Card className="p-5">
          <h3 className="font-display text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-body font-semibold text-sm">{order.customerName} — Table {order.tableNumber}</p>
                  <p className="text-muted-foreground text-xs font-body">{order.items.length} item(s) · {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-body font-bold text-primary">${order.total.toFixed(2)}</p>
                  <span className={`text-xs font-body px-2 py-0.5 rounded-full ${
                    order.status === "pending" ? "bg-warning/20 text-warning" :
                    order.status === "preparing" ? "bg-primary/20 text-primary" :
                    "bg-success/20 text-success"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminOverview;
