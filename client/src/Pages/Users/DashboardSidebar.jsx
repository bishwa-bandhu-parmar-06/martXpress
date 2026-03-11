import React from "react";
import { User, MapPin, Package, Settings, LogOut, Star } from "lucide-react";

export const DashboardSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "ratings", label: "My Reviews", icon: Star },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-24">
        <nav className="flex flex-row md:flex-col p-2 gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={activeTab === tab.id ? "text-primary" : ""}
                />
                {tab.label}
              </button>
            );
          })}
          <hr className="my-2 border-gray-100 dark:border-gray-800 hidden md:block" />
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full text-left"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </nav>
      </div>
    </aside>
  );
};
