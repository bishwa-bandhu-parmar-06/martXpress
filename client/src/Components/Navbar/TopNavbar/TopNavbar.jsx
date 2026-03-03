import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check if the current viewer is a regular buyer
  const isBuyer = isAuthenticated && user?.role === "user";

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      {/* Changed max-w to span beautifully on ultra-wide monitors while keeping padding */}
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        {/* LEFT: Logo & Mobile Menu */}
        <div className="flex items-center gap-3 shrink-0 h-full">
          <button
            className="lg:hidden p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={26} />
          </button>

          <Link to="/" className="flex items-center h-full py-2">
            <img
              src={logo}
              alt="martXpress Logo"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* CENTER: Search & Location (Desktop Only) */}
        <div className="hidden lg:flex items-center flex-1 max-w-3xl gap-6">
          <div className="shrink-0">
            <Location />
          </div>
          <div className="flex-1 w-full">
            <SearchBox />
          </div>
        </div>

        {/* RIGHT: Actions */}
        {/* Using justify-end and larger gaps for breathing room */}
        <div className="flex items-center justify-end gap-3 sm:gap-5 lg:gap-6 shrink-0">
          {/* Mobile Search Icon */}
          <button className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Search size={22} />
          </button>

          {/* Settings Group */}
          <div className="hidden xl:flex items-center gap-6">
            <BecomeASeller />
            <Language />
          </div>

          {/* Desktop Divider (Visually separates settings from account actions) */}
          <div className="hidden xl:block h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {/* Account Group */}
          <div className="flex items-center gap-4 sm:gap-6">
            {isBuyer && (
              <>
                <div className="hover:text-primary transition-colors">
                  <WishlistIcon />
                </div>
                <div className="hover:text-primary transition-colors">
                  <Cart />
                </div>
              </>
            )}
            <div className="pl-1">
              <Users />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-60 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <img src={logo} alt="Logo" className="h-8 object-contain" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:text-primary transition-colors border border-gray-200 dark:border-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-5 overflow-y-auto space-y-8 flex-1">
            <div className="lg:hidden">
              <SearchBox />
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">
                Account
              </p>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                <Users />
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <BecomeASeller />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2">
                Settings
              </p>
              <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <Language />
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
