import React from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Cart = ({ isSidebar, onClick }) => {
  const cartQuantity = useSelector((state) => state.cart.cartQuantity);

  return (
    <Link
      to="/cart"
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl dark:hover:bg-gray-800 hover:bg-gray-100 transition-all duration-300 group cursor-pointer ${isSidebar ? "w-full" : ""}`}
    >
      <div className="relative shrink-0">
        <ShoppingBag
          size={20}
          className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors"
        />
        {cartQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-4 h-4 flex items-center justify-center px-1 rounded-full border border-white dark:border-gray-900 shadow-sm animate-in zoom-in duration-300">
            {cartQuantity > 99 ? "99+" : cartQuantity}
          </span>
        )}
      </div>
      <span
        className={`font-medium text-gray-700 dark:text-gray-200 ${isSidebar ? "block" : "hidden md:block"}`}
      >
        Cart
      </span>
    </Link>
  );
};

export default Cart;
