import React from "react";
import SearchBox from "./SearchBox";
import logo from "/MartXpresslogo-removebg-preview.png";
import Location from "./Location";
import Language from "./Language";
import Users from "./Users";

import { Link } from "react-router-dom";
import Cart from "./Cart";
import BecomeASeller from "./BecomeASeller";

const TopNavbar = () => {
  return (
    <>
      <div className="flex justify-around items-center h-20 w-full shadow-md px-20 dark:bg-gray-900 dark:text-text-color">
        <div className="flex justify-around items-center w-[60%] h-20 ">
          <div id="logo">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-35 cursor-pointer" />
            </Link>
          </div>

          <div id="location">
            <Location />
          </div>
          <div id="searchbox" className="w-[60%]">
            <SearchBox />
          </div>
        </div>
        <div className="flex justify-around items-center w-[40%]  h-20">
          <div id="language">
            <Language />
          </div>
          <div id="users">
            <Users />
          </div>
          <div id="sellers">
            <BecomeASeller />
          </div>
          <div id="cart">
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
