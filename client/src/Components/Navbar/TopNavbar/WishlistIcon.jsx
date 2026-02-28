import React from "react";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const WishlistIcon = () => {
  const count = useSelector((state) => state.wishlist.wishlistCount);

  return (
    <Link
      to="/wishlist"
      // Matches the exact styling of your Cart and Users components
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative">
        <Heart
          size={20}
          // Added group-hover:text-red-500 to match the "hover:text-text" logic of other icons
          className="text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors"
        />

        {/* Dynamic Badge */}
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 flex items-center justify-center px-1 rounded-full border border-white dark:border-gray-900 shadow-sm animate-in zoom-in duration-300">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>

      {/* Matches the 'Cart' and 'Account' text styling */}
      <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">
        Wishlist
      </span>
    </Link>
  );
};

export default WishlistIcon;