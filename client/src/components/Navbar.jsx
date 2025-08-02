import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import SliderMenu from "./SliderMenu";
import Search from "./Search";
import { ImExit } from "react-icons/im";
import { PiUserSwitchBold } from "react-icons/pi";
import { IoStorefrontSharp } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import PageScrolling from "./PageScrolling";
import ThemeToggleBtn from "./Button/ThemeToggleBtn";
import CartButton from "./Button/CartButton";
import { useSelector } from "react-redux";

// importing logo
import logo from "/logo.png";
import UsersDetailHover from "./UsersDetailHover";

const Navbar = () => {
  const [IsUsersHover, setIsUsersHover] = useState(false);
  

  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-16 sm:h-20 flex items-center justify-between bg-white/5 backdrop-blur-sm px-4 sm:px-6 md:px-8 lg:px-20 border-b border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to={"/"}>
            <img
              src={logo}
              alt="logo"
              className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Search Component (hidden on small screens) */}
        <div className="hidden md:flex flex-1 mx-4 lg:mx-8 max-w-2xl">
          <Search />
        </div>

        {/* Navigation section */}
        <div className="flex items-center gap-3 sm:gap-4  text-lg font-medium text-[#0050A0] ">
          <ThemeToggleBtn />
          <CartButton />

          {/* Regular navigation items (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {!isLoggedIn && (
              <>
                <Link
                  to={"/auth"}
                  title="Users"
                  className="flex items-center gap-1 hover:text-[#F37324] transition-colors"
                >
                  <ImExit className="text-xl" />
                  <span className="hidden lg:inline text-sm xl:text-base">
                    Signin/Signup
                  </span>
                </Link>
                <Link
                  to={"/seller-auth"}
                  title="Seller"
                  className="flex items-center gap-1 hover:text-[#F37324]  transition-colors"
                >
                  <IoStorefrontSharp className="text-xl" />
                  <span className="hidden lg:inline text-sm xl:text-base">
                    Become a Seller
                  </span>
                </Link>
              </>
            )}

            {isLoggedIn && role === "seller" && (
              <Link
                to={"/seller/profile"}
                title="Seller Profile"
                className="flex items-center gap-1 hover:text-[#F37324] transition-colors"
              >
                <PiUserSwitchBold className="text-2xl" />
              </Link>
            )}

            {isLoggedIn && (role === "admin" || role === "users") && (
              <div
                onMouseEnter={() => setIsUsersHover(true)}
                onMouseLeave={() => setIsUsersHover(false)}
                className="relative inline-block"
              >
                <Link
                  to={role === "users" ? "/users/profile" : "/admin/profile"}
                  title="User Profile"
                  className="flex items-center gap-1 hover:text-[#F37324]  transition-colors"
                >
                <PiUserSwitchBold className="text-2xl" />
                </Link>
                {IsUsersHover && (
                  <div
                    className="absolute top-full left-0 right-4"
                  >
                    <UsersDetailHover />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger menu - shows on all screens but styled differently */}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            className="p-1 text-2xl md:text-xl hover:text-[#F37324]  transition-colors focus:outline-none"
          >
            <CgMenuGridR />
          </button>
        </div>
      </div>

      <PageScrolling />

      {/* Side bar menu */}
      <SliderMenu isOpen={isOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;
