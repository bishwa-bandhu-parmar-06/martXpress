import React, { useEffect, useRef } from "react";
import { FaEdit, FaList } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { GiCrossMark } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import { ImExit } from "react-icons/im";
import { IoHome, IoStorefrontSharp } from "react-icons/io5";
import { MdAdd, MdOutlineMiscellaneousServices } from "react-icons/md";
import { PiUserSwitchBold } from "react-icons/pi";
import { RiContactsFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const SliderMenu = ({ isOpen, toggleSidebar }) => {
  const menuRef = useRef(null);
  const location = useLocation();
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
    <>
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-screen w-80 bg-white/5 backdrop-blur-sm  z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end fixed top-5 right-5">
          <GiCrossMark
            onClick={toggleSidebar}
            className="text-[#F37324] text-2xl cursor-pointer hover:scale-125 transition-transform duration-300"
          />
        </div>
        <ul
          onClick={toggleSidebar}
          className="p-6 text-[#0050A0] cursor-pointer"
        >
          <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
            <Link
              className={`flex items-center gap-3 hover:text-[#F37324] ${
                isActive("/") ? "text-[#F37324]" : "text-[#0050A0]"
              }`}
              to={"/"}
            >
              <IoHome /> Home
            </Link>
          </li>
          {!isLoggedIn && (
            <>
              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/contact") ? "text-[#F37324]" : "text-[#0050A0]"
                  }`}
                  to={"/contact"}
                >
                  <RiContactsFill /> Contact Us
                </Link>
              </li>
              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/about") ? "text-[#F37324]" : "text-[#0050A0]"
                  }`}
                  to={"/about"}
                >
                  <HiUserGroup /> About Us
                </Link>
              </li>
              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/services") ? "text-[#F37324]" : "text-[#0050A0]"
                  }`}
                  to={"/services"}
                >
                  <MdOutlineMiscellaneousServices className="text-xl" />{" "}
                  Services
                </Link>
              </li>

              <li className="w-fit p-2 font-semibold text-md hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/seller-auth")
                      ? "text-[#F37324]"
                      : "text-[#0050A0]"
                  }`}
                  to={"/seller-auth"}
                >
                  <IoStorefrontSharp className="text-xl" /> Become a Seller
                </Link>
              </li>
              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/auth") ? "text-[#F37324]" : "text-[#0050A0]"
                  }`}
                  to={"/auth"}
                >
                  <ImExit className="text-xl" /> Signin/Signup
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && role === "seller" && (
            <>
              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/seller/profile")
                      ? "text-[#F37324]"
                      : "text-[#0050A0]"
                  }`}
                  to={"/seller/profile"}
                >
                  <PiUserSwitchBold className="text-xl" /> Profile
                </Link>
              </li>

              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/sellers/add-product")
                      ? "text-[#F37324]"
                      : "text-[#0050A0]"
                  }`}
                  to={"/sellers/add-product"}
                >
                  <MdAdd className="text-2xl" /> Add Product
                </Link>
              </li>

              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/sellers/product-page")
                      ? "text-[#F37324]"
                      : "text-[#0050A0]"
                  }`}
                  to={"/sellers/product-page"}
                >
                  <FaList className="text-md" /> All Products
                </Link>
              </li>

              <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
                <Link
                  className={`flex items-center gap-3 hover:text-[#F37324] ${
                    isActive("/sellers/update-product")
                      ? "text-[#F37324]"
                      : "text-[#0050A0]"
                  }`}
                  to={"/sellers/update-product"}
                >
                  <FaEdit className="text-xl" /> Update Products
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && (role === "admin" || role === "users") && (
            <li className="w-fit p-2 font-semibold text-md hover:text-[#F37324] hover:scale-110 transition-transform duration-300">
              <Link
                className={`flex items-center gap-3 hover:text-[#F37324] ${
                  isActive(
                    role === "users" ? "/users/profile" : "/admin/profile"
                  )
                    ? "text-[#F37324]"
                    : "text-[#0050A0]"
                }`}
                to={role === "users" ? "/users/profile" : "/admin/profile"}
              >
                <PiUserSwitchBold className="text-xl" /> Profile
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default SliderMenu;
