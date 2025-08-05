import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartButton = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/cart")}
      className="flex items-center cursor-pointer text-2xl font-extrabold hover:text-[#F37324]"
    >
      <FaShoppingCart />
    </div>
  );
};

export default CartButton;
