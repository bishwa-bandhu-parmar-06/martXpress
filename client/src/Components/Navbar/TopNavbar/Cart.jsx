import React from "react";
import { ShoppingBag  } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/cart");
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-text cursor-pointer transition"
    >
      {/* Cart Icon */}
      <ShoppingBag  size={20} className="text-primary"/>

      {/* Text */}
      <span className="font-medium dark:text-white">Cart</span>
    </div>
  );
};

export default Cart;
