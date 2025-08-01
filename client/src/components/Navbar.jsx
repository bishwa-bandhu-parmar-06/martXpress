import React, { useState } from "react";
import { Link } from "react-router-dom";
import SliderMenu from "./SliderMenu";
import Search from "./Search";
import { ImExit } from "react-icons/im";
import { IoStorefrontSharp } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import PageScrolling from "./PageScrolling";
import ThemeToggleBtn from "./ThemeToggleBtn";

// importing logo
import logo from "/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const role = localStorage.getItem("role");
  console.log("Role : ", role)
  const token = localStorage.getItem("token");
console.log("Token : ", token)
  return (
    <>
      <div className="sticky top-0 z-50 m-auto mt-3.5 h-20 flex items-center justify-between bg-white/5 backdrop-blur-sm px-4 md:px-20">
        {/* Logo */}
        <div className="">
          <Link to={"/"}>
            <img src={logo} alt="logo" className="h-20 sm:h-24 md:h-32" />
          </Link>
        </div>

        {/* Search Component (hidden on small screens) */}
        <div className="hidden md:block">
          <Search />
        </div>

        {/* Navigation section or navigation item */}
        <div className="flex items-center gap-4 text-lg font-normal text-[#0050A0]">
          <ThemeToggleBtn />

          {/* Regular navigation items (hidden on small screens) */}
          <div className="hidden gap-7 md:flex">
            <Link
              to={"/auth"}
              title="Users"
              className="flex items-center gap-1 hover:text-[#F37324]"
            >
              <ImExit />
              <span className="hidden lg:block">Signin/Signup</span>
            </Link>
            <Link
              to={"/seller-auth"}
              title="Seller"
              className="flex items-center gap-1 hover:text-[#F37324]"
            >
              <IoStorefrontSharp />
              <span className="hidden lg:block">Become a Seller</span>
            </Link>
            
            <div className="flex items-center gap-4 cursor-pointer text-2xl font-extrabold hover:text-[#F37324]">
              <FaShoppingCart />
            </div>
          </div>

          {/* Hamburger menu for small screens */}
          <div
            onClick={toggleSidebar}
            className="flex cursor-pointer items-center gap-1 text-2xl font-extrabold hover:text-[#F37324] md:hidden"
          >
            <CgMenuGridR />
          </div>

          {/* Hamburger menu for medium and large screens */}
          <div
            onClick={toggleSidebar}
            className="hidden cursor-pointer items-center gap-1 text-2xl font-extrabold hover:text-[#F37324] md:flex"
          >
            <CgMenuGridR />
          </div>
        </div>
      </div>

      <PageScrolling />

      {/* Side bar menu */}
      <SliderMenu isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;
