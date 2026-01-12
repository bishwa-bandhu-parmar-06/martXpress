import React from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom"; // for navigation

const Users = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/users/auth");
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-text cursor-pointer transition"
    >
      {/* User Icon */}
      <User size={20} className="text-primary font-bold" />

      {/* Text */}
      <span className="font-medium dark:text-white">Login</span>
    </div>
  );
};

export default Users;
