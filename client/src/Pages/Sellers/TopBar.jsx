import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Menu,
  Sun,
  Moon,
  Bell,
  Search,
  Plus,
  ShoppingBag,
  Package,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Loader2,
  TrendingUp,
} from "lucide-react";

import { logoutUser } from "@/API/Common/commonApi";
import { logout } from "@/Features/auth/AuthSlice";
import { clearCartQuantity } from "@/Features/Cart/CartSlice";
import { setWishlist } from "@/Features/Cart/WishlistSlice";
import api from "@/API/axiosInstance"; // Ensure this path matches your project structure

const PAGE_TITLES = {
  overview: { title: "Dashboard Overview", sub: "Your store at a glance" },
  products: { title: "Product Management", sub: "Manage your inventory" },
  orders: { title: "Order Management", sub: "Track and fulfil orders" },
  analytics: { title: "Analytics", sub: "Deep-dive into your data" },
  settings: { title: "Store Settings", sub: "Manage your profile & docs" },
};

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    icon: ShoppingBag,
    color: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
    title: "New order received",
    desc: "Order #ORD-9042 · ₹1,499",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: Package,
    color: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
    title: "Low stock alert",
    desc: "Smart Watch S5 — 8 units left",
    time: "1 hr ago",
    unread: true,
  },
];

const TopBar = ({
  activeTab,
  sellerLoading,
  darkMode,
  setDarkMode,
  onMobileMenuToggle,
  onAddProduct,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const [notifOpen, setNotifOpen] = useState(false);

  // --- Search State ---
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchWrapperRef = useRef(null);

  const { title, sub } = PAGE_TITLES[activeTab] ?? PAGE_TITLES.overview;
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "MX";

  // --- Search Logic ---
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSearchDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearchLoading(true);
      try {
        const res = await api.get(`/search/suggestions?q=${query}`);
        if (res.data.success) {
          setSuggestions(res.data.suggestions);
          setShowSearchDropdown(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSearchDropdown(false);
      navigate(`/search?keyword=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowSearchDropdown(false);
    setQuery("");
    navigate(`/product/${productId}`); // Opens the product in live view
  };

  // --- Logout Logic ---
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(clearCartQuantity());
      dispatch(setWishlist([]));
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(logout());
      toast.error("An error occurred during logout");
      navigate("/");
    }
  };

  return (
    <header className="shrink-0 h-18 bg-white dark:bg-[#131520] border-b border-gray-200 dark:border-white/5 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* LEFT: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 w-1/4 min-w-max">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex flex-col">
          <h1 className="text-[17px] font-bold text-gray-900 dark:text-white leading-tight">
            {title}
          </h1>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">
            {sub}
          </p>
        </div>
      </div>

      {/* CENTER: Search Bar (Matches Image Perfectly) */}
      <div
        ref={searchWrapperRef}
        className="flex-1 max-w-xl relative hidden sm:block z-50"
      >
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full"
        >
          <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSearchDropdown(true);
            }}
            placeholder="Search products, orders..."
            className="w-full h-10 pl-10 pr-10 bg-gray-50 dark:bg-[#1E2030] border border-gray-200 dark:border-white/5 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
            autoComplete="off"
          />
          {isSearchLoading && (
            <Loader2 className="absolute right-3.5 h-4 w-4 animate-spin text-gray-400" />
          )}
        </form>

        {/* Search Suggestions Dropdown */}
        {showSearchDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A1D2E] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {suggestions.length === 0 && !isSearchLoading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No products found for "{query}"
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto custom-scrollbar">
                <div className="px-4 py-2.5 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <TrendingUp size={14} /> Suggestions
                </div>
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors border-b border-gray-50 dark:border-white/5 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-[#131520] shrink-0 overflow-hidden border border-gray-200 dark:border-white/5">
                      <img
                        src={item.images?.[0] || "https://placehold.co/100x100"}
                        alt={item.name}
                        className="w-full h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-500 capitalize">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-[#8b5cf6] shrink-0">
                      ₹{item.finalPrice?.toLocaleString("en-IN")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Actions & Profile */}
      <div className="flex items-center justify-end gap-3 md:gap-5 w-1/4 min-w-max">
        {/* Add Product CTA (Matches Image: Vibrant Purple) */}
        <button
          onClick={onAddProduct}
          className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>

        {/* Quick Icons */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-2 h-2.5 w-2.5 bg-[#ef4444] rounded-full ring-2 ring-white dark:ring-[#131520]" />
              )}
            </button>
            {/* Notification Dropdown omitted for brevity (same as previous) */}
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-white/10" />

        {/* Avatar & Profile (Matches Image exactly: Avatar Left, Text Right) */}
        <div className="relative group">
          <div className="flex items-center gap-3 cursor-pointer">
            {/* Avatar Circle */}
            <div className="h-9.5 w-9.5 rounded-full bg-linear-to-br from-[#c084fc] to-[#e879f9] flex items-center justify-center shadow-md shrink-0">
              <span className="text-white text-sm font-bold tracking-wide">
                {initials}
              </span>
            </div>

            {/* Name & Store */}
            <div className="hidden lg:flex flex-col items-start justify-center leading-tight">
              <p className="text-[14px] font-bold text-gray-900 dark:text-white">
                {sellerLoading ? "Loading…" : (user?.name ?? "Seller")}
              </p>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                {user?.shopName ?? "Store"}
              </p>
            </div>
          </div>

          {/* Hover Logout Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1D2E] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 lg:hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.shopName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
