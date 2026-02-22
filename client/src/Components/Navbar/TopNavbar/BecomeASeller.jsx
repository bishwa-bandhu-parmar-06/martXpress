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
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-text cursor-pointer transition"
    >
      <Store size={20} className="text-primary" />
      <span className="font-medium dark:text-white">Become a Seller</span>
    </Link>
  );
};

export default BecomeASeller;
