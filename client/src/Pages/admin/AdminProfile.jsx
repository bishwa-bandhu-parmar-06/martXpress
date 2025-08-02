import React from "react";
import LogoutButton from "../../components/Button/LogoutButton";
import { useSelector } from "react-redux";

const AdminProfile = () => {
  const usersData = useSelector((state) => state.auth.usersData);

  return (
    <div>
      <h1>Name : {usersData?.name}</h1>
      <p>Email : {usersData?.email}</p>
      <LogoutButton />
    </div>
  );
};

export default AdminProfile;
