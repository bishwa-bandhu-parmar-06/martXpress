import React from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <Link
      to="/cart"
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-text cursor-pointer transition"
    >
      <ShoppingBag size={20} className="text-primary" />
      <span className="font-medium dark:text-white">Cart</span>
    </Link>
  );
};

export default Cart;
