import React, { useState, useEffect } from "react";
import SearchBox from "./SearchBox";
import logo from "/MartXpresslogo-removebg-preview.png";
import Location from "./Location";
import Language from "./Language";
import Users from "./Users";
import Cart from "./Cart";
import BecomeASeller from "./BecomeASeller";
import Theme from "../Theme"; // Added Theme import
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* -------------------- MAIN NAVBAR (Desktop & Mobile Header) -------------------- */}
      <div className="relative z-40 flex justify-between lg:justify-around items-center h-20 w-full shadow-md px-4 lg:px-20 bg-white dark:bg-gray-900 dark:text-text-color transition-colors duration-300">
        {/* LOGO (Visible on all screens) */}
        <div id="logo" className="flex-shrink-0">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-12 lg:h-35 cursor-pointer object-contain"
            />
          </Link>
        </div>

        {/* DESKTOP CENTER (Location & Search) - Hidden on mobile */}
        <div className="hidden lg:flex justify-around items-center w-[50%] h-20 gap-4">
          <div id="location">
            <Location />
          </div>
          <div id="searchbox" className="w-[70%]">
            <SearchBox />
          </div>
        </div>

        {/* DESKTOP RIGHT (Lang, Users, Sellers, Cart) - Hidden on mobile */}
        <div className="hidden lg:flex justify-around items-center w-[35%] h-20">
          <Language />
          <Users />
          <BecomeASeller />
          <Cart />
        </div>

        {/* MOBILE MENU BUTTON (Hamburger) - Hidden on desktop */}
        <button
          className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={28} />
        </button>
      </div>

      {/* -------------------- MOBILE SIDEBAR (Glassmorphism & Zoom) -------------------- */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Dark Overlay background */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Sidebar Container (Glass Effect + Zoom Animation) */}
        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm flex flex-col shadow-2xl border-r border-white/20 dark:border-gray-700/30
            bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl 
            transform transition-all duration-500 origin-left
            ${isMobileMenuOpen ? "scale-100 translate-x-0" : "scale-90 -translate-x-full opacity-0"}`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200/50 dark:border-gray-700/50">
            <img src={logo} alt="Logo" className="h-10 object-contain" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-600 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-800/50 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Content (Scrollable) */}
          <div className="flex flex-col gap-6 p-6 overflow-y-auto custom-scrollbar">
            {/* Search Box */}
            <div className="w-full">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                Search
              </p>
              <SearchBox />
            </div>

            {/* Location */}
            <div className="w-full">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                Location
              </p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-2">
                <Location />
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col gap-2 mt-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                Menu
              </p>

              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-2 flex flex-col gap-2">
                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Users />
                </div>

                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <BecomeASeller />
                </div>

                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Cart />
                </div>

                <div className="w-full flex items-center justify-between p-2">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Language
                  </span>
                  <Language />
                </div>
              </div>
            </div>

            {/* Theme & Support Section (Mobile Only) */}
            <div className="mt-4 overflow-hidden rounded-xl bg-white/50 dark:bg-gray-800/50">
              <Theme />
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto p-5 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
              MartXpress © 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
