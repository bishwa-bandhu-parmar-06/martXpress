import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard, ShoppingBag } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../Features/auth/AuthSlice";

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

  
  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate("/");
  };

  // Dynamic Dashboard Path based on Redux Role
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
    // Only show My Orders for regular users
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
      
      {/* 1. Conditional Trigger: Link if logged out, Button if logged in */}
      {!isAuthenticated ? (
        <Link
          to="/users/auth"
          className="group flex items-center gap-1 cursor-pointer p-1 rounded-full transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <User size={20} />
          </div>
          <span className="text-sm font-bold ml-1 dark:text-gray-200 hidden sm:block">
            Login
          </span>
        </Link>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-1 cursor-pointer p-1 rounded-full transition-all duration-300 border-none bg-transparent outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <span className="font-bold text-base uppercase">{displayChar}</span>
          </div>
        </button>
      )}

      {/* 2. Dropdown Menu */}
      {isAuthenticated && isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl py-2 z-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 mb-2">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-primary/10 text-primary mb-1 inline-block">
              {user?.role}
            </span>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate">
              {user?.name || "Name Not Provided"}
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
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors"
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
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer transition-colors"
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
