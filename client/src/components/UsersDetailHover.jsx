import React from "react";
import { useSelector } from "react-redux";
import LogoutButton from "./Button/LogoutButton";
import ProfileButton from "./Button/ProfileButton";

const UsersDetailHover = () => {
  const usersData = useSelector((state) => state.auth.usersData);

  return (
    <div className="absolute top-14 right-4 z-50 w-64 bg-white shadow-lg rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col items-start space-y-3">
        <h1 className="text-lg font-semibold text-gray-800">
          Hello, <span className="text-[#0050A0]">{usersData?.name}</span>
        </h1>
        <ProfileButton />
        <LogoutButton />
      </div>
    </div>
  );
};

export default UsersDetailHover;
