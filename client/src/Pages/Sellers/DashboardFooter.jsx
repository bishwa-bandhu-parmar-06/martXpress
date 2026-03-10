/**
 * DashboardFooter.jsx — Status bar at the bottom
 */
import React from "react";
import { Settings, LogOut, Wifi, Clock } from "lucide-react";

const DashboardFooter = ({ seller, onNavigate, onLogout }) => {
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <footer className="shrink-0 h-10 bg-white dark:bg-[#131520] border-t border-gray-200 dark:border-white/5 px-6 flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Store Online
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          Last sync: {now}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate("settings")}
          className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
        >
          <Settings className="h-3 w-3" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut className="h-3 w-3" />
          Logout
        </button>
      </div>
    </footer>
  );
};

export default DashboardFooter;
