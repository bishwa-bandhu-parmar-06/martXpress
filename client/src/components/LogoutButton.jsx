import React from "react";
import { ImExit } from "react-icons/im";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";
import { logoutSuccess } from "../Redux/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.success) {
        dispatch(logoutSuccess());
        toast.success(res.message);
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout Error: ", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      title="Logout"
      className="flex items-center gap-2 bg-[#F37324] hover:bg-[#0050A0] text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-300"
    >
      <ImExit size={18} />
      Logout
    </button>
  );
};

export default LogoutButton;
