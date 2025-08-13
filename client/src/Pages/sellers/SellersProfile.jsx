import React from "react";
import LogoutButton from "../../components/Button/LogoutButton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const sellersProfile = () => {
  const navigate = useNavigate();
  const usersData = useSelector((state) => state.auth.usersData);

  return (
    <div className="h-min w-[80%] bg-red-500 m-auto p-4">
      <div className="h-72 w-2xs m-auto mt-12  bg-green-600 rounded-full border-5 border-yellow-500">
        <img src="" alt="" />
      </div>
      <h1 className="text-center mt-2.5 text-2xl font-bold">
        {usersData?.name} <span>&</span>
      </h1>
      <div className="flex m-auto">
        <p className="text-center mt-2.5 text-lg">{usersData?.email}</p>
        <p className="text-center mt-2.5 text-md font-bold">
          {usersData?.role}
        </p>
      </div>
      <LogoutButton />
      <button
        className="h-9 rounded-lg w-32 text-white font-semibold bg-[#ff6720]"
        onClick={() => navigate("/sellers/product-page")}
      >
        Your Products
      </button>
    </div>
  );
};

export default sellersProfile;
