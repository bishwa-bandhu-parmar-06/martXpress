import React, { useState, useEffect } from "react";
import SearchBox from "./SearchBox";
import logo from "/MartXpresslogo-removebg-preview.png";
import Location from "./Location";
import Language from "./Language";
import Users from "./Users";
import Cart from "./Cart";
import BecomeASeller from "./BecomeASeller";
import WishlistIcon from "./WishlistIcon";
import Theme from "../Theme";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="max-w-360 mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* LEFT: Logo & Mobile Menu */}
        <div className="flex items-center gap-2 shrink-0 h-full">
          {/* Mobile Hamburger - Slightly padded for better touch target */}
          <button
            className="lg:hidden p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} /> {/* Increased icon size to 28 */}
          </button>

          <Link to="/" className="flex items-center h-full py-1">
            <img
              src={logo}
              alt="Logo"
              /* Mobile: h-12 (was 10)
         Desktop: lg:h-20 (was 12) - This will fill the 80px (h-20) navbar nicely
      */
              className="h-12 lg:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* CENTER: Search & Location (Desktop Only) */}
        <div className="hidden lg:flex items-center flex-1 max-w-2xl gap-4">
          <Location />
          <div className="flex-1">
            <SearchBox />
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Icon (Triggers a search overlay or scrolls to search) */}
          <button className="lg:hidden p-2 text-gray-600 dark:text-gray-300">
            <Search size={22} />
          </button>

          <div className="hidden xl:block">
            <BecomeASeller />
          </div>

          <div className="hidden md:block">
            <Language />
          </div>

          <div className="flex items-center gap-1">
            <WishlistIcon />
            <Cart />
            <Users />
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-60 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-70 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-5 border-b flex justify-between items-center dark:border-gray-800">
            <img src={logo} alt="Logo" className="h-8" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 space-y-6">
            <div className="lg:hidden">
              <SearchBox />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                Account
              </p>
              <Users />
              <BecomeASeller />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                Settings
              </p>
              <div className="px-2">
                <Language />
              </div>
              <div className="px-2">
                <Theme />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
