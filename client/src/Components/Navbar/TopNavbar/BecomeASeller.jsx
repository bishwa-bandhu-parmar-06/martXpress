import React from "react";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BecomeASeller = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/sellers/auth"); // change route if needed
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-text cursor-pointer transition"
    >
      {/* Seller Icon */}
      <Store size={20} className="text-primary" />

      {/* Text */}
      <span className="font-medium dark:text-white">Become a Seller</span>
    </div>
  );
};

export default BecomeASeller;
