import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const CartButton = () => {
  return (
    <div className="flex items-center cursor-pointer text-2xl font-extrabold hover:text-[#F37324]">
      <FaShoppingCart />
    </div>
  );
};

export default CartButton;
