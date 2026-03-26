import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, ArrowLeft, Menu as MenuIcon, X, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AdminMenuManagement from "@/components/admin/AdminMenuManagement";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminOverview from "@/components/admin/AdminOverview";

type AdminTab = "dashboard" | "menu" | "orders";

const navItems: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "orders", label: "Orders", icon: ClipboardList },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50 transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
          <span className="font-display font-bold text-lg text-sidebar-foreground">Tastebud Admin</span>
          <Button variant="ghost" size="icon" className="md:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-colors ${
                activeTab === item.key
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Menu
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border h-14 flex items-center px-4 gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-lg font-semibold capitalize">{activeTab}</h1>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === "dashboard" && <AdminOverview />}
            {activeTab === "menu" && <AdminMenuManagement />}
            {activeTab === "orders" && <AdminOrders />}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
