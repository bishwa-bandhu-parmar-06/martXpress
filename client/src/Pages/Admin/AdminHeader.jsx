import React from "react";
import { Button } from "../../Components/ui/button";
import { Avatar, AvatarFallback } from "../../Components/ui/avatar";
import {
  Shield,
  RefreshCw,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const AdminHeader = ({
  admin,
  handleLogout,
  fetchAllData,
  sidebarCollapsed,
  setSidebarCollapsed,
  notifications,
}) => {
  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-40">
      {/* --- LEFT SIDE --- */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-2 rounded-lg cursor-pointer text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>

        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Shield className="text-primary" size={20} />
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block tracking-tight">
            Admin Panel
          </h1>
        </div>
      </div>

      {/* --- RIGHT SIDE --- */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchAllData}
          className="hidden md:flex cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium"
        >
          <RefreshCw size={16} className="mr-2" /> Refresh
        </Button>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Bell size={20} />
          {notifications?.filter((n) => !n.read).length > 0 && (
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
          )}
        </Button>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* Admin Profile Info */}
        <div className="hidden md:flex items-center gap-3 pl-1">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
              {admin?.name || "Admin"}
            </p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-primary mt-1">
              {admin?.role || "Administrator"}
            </p>
          </div>
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Logout Button (Styled to match Settings Tab) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="cursor-pointer ml-1 md:ml-2 bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 transition-colors font-semibold rounded-lg"
        >
          <LogOut size={16} className="md:mr-2" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};
