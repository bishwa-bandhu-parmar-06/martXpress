import React from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Cart = () => {
  const cartQuantity = useSelector((state) => state.cart.cartQuantity);

  return (
    <Link
      to="/cart"
      // Standardized container: Matches Wishlist and Users exactly
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 group cursor-pointer relative"
    >
      <div className="relative">
        <ShoppingBag
          size={20}
          // Changed to match the gray-to-color transition of the other icons
          className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors"
        />

        {/* Dynamic Badge - Standardized size and font */}
        {cartQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 flex items-center justify-center px-1 rounded-full border border-white dark:border-gray-900 shadow-sm animate-in zoom-in duration-300">
            {cartQuantity > 99 ? "99+" : cartQuantity}
          </span>
        )}
      </div>

      {/* Standardized Text: Matches Wishlist and Users */}
      <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">
        Cart
      </span>
    </Link>
  );
};

export default Cart;
