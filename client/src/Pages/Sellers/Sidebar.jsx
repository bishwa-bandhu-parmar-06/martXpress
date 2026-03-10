import React from "react";
import { useSelector } from "react-redux"; // <-- Imported Redux hook
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onLogout,
  onAddProduct,
}) => {
  // 1. Fetch user directly from Redux for instant updates
  const { user } = useSelector((state) => state.auth);

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "MX";

  return (
    <>
      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar Panel ──────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:relative z-50 flex flex-col h-full
          bg-white dark:bg-[#131520] border-r border-gray-200 dark:border-white/5
          transition-all duration-300 ease-in-out shadow-xl lg:shadow-none
          ${collapsed ? "w-18" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ── Logo ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-white/5">
          <div className="shrink-0 h-9 w-9 rounded-xl bg-linear-to-br from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="font-black text-gray-900 dark:text-white tracking-tight leading-none">
                MartXpress
              </p>
              <p className="text-[10px] text-violet-500 font-semibold uppercase tracking-widest">
                Seller Hub
              </p>
            </div>
          )}

          {/* Mobile close */}
          <button
            className="ml-auto p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Quick Add Button ─────────────────────────────────────── */}
        <div className="px-3 py-3">
          <button
            onClick={onAddProduct}
            title="Add Product"
            className={`
              flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5
              bg-linear-to-r from-violet-600 to-indigo-500 text-white
              font-semibold text-sm shadow-lg shadow-violet-500/25
              hover:shadow-violet-500/40 hover:scale-[1.02]
              transition-all duration-200 cursor-pointer
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Add Product</span>}
          </button>
        </div>

        {/* ── Navigation ───────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setMobileOpen(false); // Close mobile menu on click
                }}
                title={collapsed ? label : ""}
                className={`
                  flex items-center gap-3 w-full rounded-xl px-3 py-2.5
                  text-sm font-medium transition-all duration-200 cursor-pointer
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-violet-600 dark:text-violet-400" : ""}`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── Seller Profile at bottom ──────────────────────────────── */}
        <div className="border-t border-gray-100 dark:border-white/5 p-3">
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-xl ${!collapsed ? "hover:bg-gray-50 dark:hover:bg-white/5" : "justify-center"} transition-colors`}
          >
            <div className="shrink-0 h-8 w-8 rounded-full bg-linear-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name ?? "Loading..."}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.shopName ?? ""}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Logout"
            className={`
              flex items-center gap-3 w-full mt-1 px-3 py-2.5 rounded-xl
              text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10
              transition-colors cursor-pointer
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* ── Collapse Toggle (desktop only) ────────────────────────── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 rounded-full bg-white dark:bg-[#1E2030] border border-gray-200 dark:border-white/10 items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white shadow-md transition-colors cursor-pointer z-10"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
