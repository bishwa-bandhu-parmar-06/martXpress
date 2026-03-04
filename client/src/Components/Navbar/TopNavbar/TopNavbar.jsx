import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // <-- Added Framer Motion
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  HelpCircle,
  Phone,
  Sun,
  Moon,
} from "lucide-react";
import SearchBox from "./SearchBox";
import logo from "/MartXpresslogo-removebg-preview.png";
import Location from "./Location";
import Language from "./Language";
import Users from "./Users";
import Cart from "./Cart";
import BecomeASeller from "./BecomeASeller";
import WishlistIcon from "./WishlistIcon";

// Actions for logout
import { logout } from "../../../Features/auth/AuthSlice";
import { clearCartQuantity } from "../../../Features/Cart/CartSlice";
import { setWishlist } from "../../../Features/Cart/WishlistSlice";
import { logoutUser } from "@/API/Common/commonApi";

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isBuyer = isAuthenticated && user?.role === "user";

  const [dark, setDark] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const closeSidebar = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(clearCartQuantity());
      dispatch(setWishlist([]));
      closeSidebar();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(logout());
      closeSidebar();
      navigate("/");
    }
  };

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "seller") return "/sellers/dashboard";
    return "/users/dashboard";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      
      {/* ================= DESKTOP NAVBAR (lg and up) ================= */}
      {/* FIX: Removed fixed h-20, added py-2. Reduced gaps from gap-8 to gap-4 to prevent cutoff */}
      <div className="hidden lg:flex w-full max-w-400 mx-auto px-4 lg:px-6 py-2 items-center justify-between gap-4 xl:gap-8">
        
        {/* LOGO: Scaled up beautifully */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="martXpress Logo"
              className="h-24 xl:h-28 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* SEARCH & LOCATION */}
        <div className="flex items-center flex-1 max-w-3xl gap-4">
          <div className="shrink-0">
            <Location />
          </div>
          <div className="flex-1 w-full">
            <SearchBox />
          </div>
        </div>

        {/* RIGHT SIDE ACTIONS: Reduced gaps to save space */}
        <div className="flex items-center justify-end gap-2 xl:gap-4 shrink-0">
          <BecomeASeller />
          <Language />
          
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          
          <div className="flex items-center gap-2 xl:gap-4">
            {isBuyer && (
              <>
                <WishlistIcon />
                <Cart />
              </>
            )}
            <div className="pl-1">
              <Users />
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE NAVBAR (lg down) ================= */}
      {/* FIX: Perfectly aligned flex container for mobile */}
      <div className="flex lg:hidden items-center justify-between px-3 py-2 gap-2">
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="martXpress Logo"
            className="h-12 sm:h-14 object-contain"
          />
        </Link>

        {/* Center Search takes remaining space */}
        <div className="flex-1 w-full max-w-[55%]">
          <SearchBox isMobile={true} />
        </div>

        <button
          className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors shrink-0"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* ================= RIGHT SIDEBAR WITH FRAMER MOTION ================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={closeSidebar}
            />

            {/* Sidebar Panel sliding from the RIGHT */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-[320px] z-101 bg-white dark:bg-gray-900 shadow-2xl flex flex-col lg:hidden"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <button
                  onClick={closeSidebar}
                  className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:text-primary transition-colors border border-gray-200 dark:border-gray-600"
                >
                  <X size={20} />
                </button>
                <img src={logo} alt="Logo" className="h-14 object-contain" />
              </div>

              {/* Sidebar Main Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
                <div className="pb-2 border-b border-gray-100 dark:border-gray-800">
                  <Location isSidebar={true} />
                </div>

                <Language isSidebar={true} onClick={closeSidebar} />
                <BecomeASeller isSidebar={true} onClick={closeSidebar} />

                {isBuyer && (
                  <>
                    <Cart isSidebar={true} onClick={closeSidebar} />
                    <WishlistIcon isSidebar={true} onClick={closeSidebar} />
                  </>
                )}

                {/* Account Logic inside Sidebar */}
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-3">
                        My Account
                      </p>

                      <Link to={getDashboardPath()} onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200">
                        <LayoutDashboard size={20} className="text-gray-500" />
                        <span className="font-medium">Dashboard</span>
                      </Link>

                      {user?.role === "user" && (
                        <Link to="/users/dashboard?tab=orders" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200">
                          <ShoppingBag size={20} className="text-gray-500" />
                          <span className="font-medium">My Orders</span>
                        </Link>
                      )}

                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-500">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <Link to="/users/auth" onClick={closeSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors text-primary">
                      <User size={20} />
                      <span className="font-bold">Login / Register</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Sidebar Footer (Theme, Help, Contact) */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 space-y-1">
                <button onClick={() => setDark(!dark)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                  {dark ? <Sun size={20} className="text-gray-500" /> : <Moon size={20} className="text-gray-500" />}
                  <span className="font-medium">{dark ? "Light Mode" : "Dark Mode"}</span>
                </button>

                <Link to="/help" onClick={closeSidebar} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                  <HelpCircle size={20} className="text-gray-500" />
                  <span className="font-medium">Help Center</span>
                </Link>

                <a href="tel:+919142364660" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                  <Phone size={20} className="text-gray-500" />
                  <span className="font-medium">+91 9142364660</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default TopNavbar;