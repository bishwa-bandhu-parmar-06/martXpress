import React from "react";
import { useSelector } from "react-redux";
import LogoutButton from "./Button/LogoutButton";
import ProfileButton from "./Button/ProfileButton";
const UsersDetailHover = () => {
  const usersData = useSelector((state) => state.auth.usersData);
  return (
    <div className="bg-red-500">
      <h1>Name : {usersData?.name}</h1>
      <ProfileButton />
      <LogoutButton />
    </div>
  );
};

export default UsersDetailHover;
