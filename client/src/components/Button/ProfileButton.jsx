import React from "react";
import { PiUserSwitchBold } from "react-icons/pi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileButton = () => {
  const usersData = useSelector((state) => state.auth.usersData);
  //   console.log("From Profile : ", usersData)

  return (
    <div>
      <Link to={`/${usersData?.role}/profile`}>
        <button className="flex items-center cursor-pointer gap-2 bg-[#F37324] hover:bg-[#0050A0] text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-300">
          <PiUserSwitchBold />
          Profile
        </button>
      </Link>
    </div>
  );
};

export default ProfileButton;
