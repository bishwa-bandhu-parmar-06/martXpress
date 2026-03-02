import React from "react";
import { Badge } from "../../Components/ui/badge";
import { Button } from "../../Components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  Users as UsersIcon,
  BarChart3,
  Settings,
  User,
  MapPin, 
} from "lucide-react";

export const AdminSidebar = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  pendingSellersCount,
}) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "sellers",
      label: "Sellers",
      icon: <Users size={20} />,
      badge: pendingSellersCount,
    },
    { id: "products", label: "Products", icon: <Package size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
    { id: "customers", label: "Customers", icon: <UsersIcon size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { id: "profile", label: "My Profile", icon: <User size={20} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div
      className={`shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 overflow-y-auto min-h-[calc(100vh-80px)] ${
        sidebarCollapsed
          ? "w-0 md:w-20 opacity-0 md:opacity-100"
          : "w-64 opacity-100"
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="hidden md:flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="cursor-pointer"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary dark:bg-primary/20 font-bold"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
              }`}
              title={sidebarCollapsed ? item.label : ""}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${activeTab === item.id ? "text-primary" : "text-gray-500"}`}
                >
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </div>
              {!sidebarCollapsed && item.badge > 0 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
