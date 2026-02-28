import React, { useState, useEffect } from "react";
import { Sun, Moon, HelpCircle, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Theme = () => {
  const navigate = useNavigate();

  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div
      className="h-9 w-full px-4 sm:px-10 flex items-center justify-between
      bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs sm:text-sm transition-colors duration-300 border-b dark:border-gray-800"
    >
      {/* Left side – Support */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => navigate("/help")}
          className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
        >
          <HelpCircle size={15} />
          <span className="font-semibold hidden xs:block">Help</span>
        </div>

        <a
          href="tel:+919142364660"
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <Phone size={13} />
          <span className="font-medium hidden sm:block">+91 9142364660</span>
        </a>
      </div>

      {/* Right side – Theme Toggle */}
      <div
        onClick={() => setDark(!dark)}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group"
      >
        <div className="relative w-4 h-4">
          <Sun
            size={16}
            className={`absolute transition-all duration-500
              ${dark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
          />
          <Moon
            size={16}
            className={`absolute transition-all duration-500
              ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
          />
        </div>

        <span className="font-semibold hidden xs:block">
          {dark ? "Dark" : "Light"}
        </span>

        {/* Simplified Toggle Switch for Mobile */}
        <div
          className={`w-8 h-4 sm:w-10 sm:h-5 rounded-full relative transition-colors duration-300
            ${dark ? "bg-primary" : "bg-gray-400"}`}
        >
          <div
            className={`h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-white absolute top-0.5
              transition-all duration-300 ease-in-out
              ${dark ? "translate-x-4 sm:translate-x-5" : "translate-x-0.5"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Theme;
