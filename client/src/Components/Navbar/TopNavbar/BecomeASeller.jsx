import React from "react";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const BecomeASeller = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Don't show the "Become a Seller" button if they are already a seller
  if (isAuthenticated && user?.role === "seller") return null;

  return (
    <Link
      to="/sellers/auth"
      // Standardized container: Matches Cart, Wishlist, and Users exactly
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative">
        <Store 
          size={20} 
          // Changed to match the gray-to-color transition of other icons
          className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" 
        />
      </div>

      {/* Standardized Text: Matches the weight and color of other labels */}
      <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">
        Become a Seller
      </span>
    </Link>
  );
};

export default BecomeASeller;