import React from "react";
import LogoutButton from "../../components/Button/LogoutButton";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const sellersProfile = () => {
  const navigate = useNavigate();
  const usersData = useSelector((state) => state.auth.usersData);

  return (
    <div>
      <h1>Name : {usersData?.name}</h1>
      <p>Email : {usersData?.email}</p>
      <p>Role : {usersData?.role}</p>
      <LogoutButton />
      <button onClick={() => navigate("/sellers/product-page")}>
        Your Products
      </button>
    </div>
  );
};

export default sellersProfile;
