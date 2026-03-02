import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../Features/auth/AuthSlice";
import { clearCartQuantity } from "../../../Features/Cart/CartSlice";
import { setWishlist } from "../../../Features/Cart/WishlistSlice";
import { logoutUser } from "@/API/Common/commonApi";

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      dispatch(clearCartQuantity());
      dispatch(setWishlist([]));
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(logout());
      navigate("/");
    }
  };

  const getDashboardPath = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "seller") return "/sellers/dashboard";
    return "/users/dashboard";
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      path: getDashboardPath(),
    },
    ...(user?.role === "user"
      ? [
          {
            label: "My Orders",
            icon: <ShoppingBag size={16} />,
            path: "/users/orders",
          },
        ]
      : []),
  ];

  const displayChar = isAuthenticated
    ? (user?.name?.trim() ? user.name[0] : user?.email?.[0])?.toUpperCase()
    : null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {!isAuthenticated ? (
        // --- LOGGED OUT STATE (LOGIN LINK) ---
        <Link
          to="/users/auth"
          className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 group cursor-pointer"
        >
          <div className="relative">
            <User
              size={20}
              className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors"
            />
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">
            Login
          </span>
        </Link>
      ) : (
        // --- LOGGED IN STATE (AVATAR BUTTON) ---
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 group cursor-pointer border-none bg-transparent outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <span className="font-bold text-sm uppercase">{displayChar}</span>
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">
            Account
          </span>
        </button>
      )}

      {/* Dropdown Menu */}
      {isAuthenticated && isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl py-2 z-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 mb-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary mb-1 inline-block">
              {user?.role}
            </span>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <span className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-50 dark:border-gray-800 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
