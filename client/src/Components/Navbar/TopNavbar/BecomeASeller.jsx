import React from "react";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BecomeASeller = ({ isSidebar, onClick }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated && user?.role === "seller") return null;

  return (
    <Link
      to="/sellers/auth"
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl dark:hover:bg-gray-800 hover:bg-gray-100 transition-all duration-300 group cursor-pointer ${isSidebar ? "w-full" : ""}`}
    >
      <Store size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors shrink-0" />
      <span className={`font-medium text-gray-700 dark:text-gray-200 ${isSidebar ? "block" : "hidden md:block"}`}>
        Become a Seller
      </span>
    </Link>
  );
};

export default BecomeASeller;