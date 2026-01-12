import React, { useState, useEffect } from "react";
import { Sun, Moon, HelpCircle, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Theme = () => {
  const navigate = useNavigate();

  // 1. Initialize state by checking LocalStorage or System Preference
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 2. Update the DOM and LocalStorage whenever 'dark' changes
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
      className="h-9 w-full px-6 flex items-center justify-between
      bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm transition-colors duration-300"
    >
      {/* Left side – Get Help */}
      <div
        onClick={() => navigate("/help")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <HelpCircle size={16} />
        <span className="font-semibold hover:underline">Get Help</span>
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Phone size={14} />
          +91 9142364660
        </span>
      </div>
      {/* Right side – Theme Toggle */}
      <div
        onClick={() => setDark(!dark)}
        className="flex items-center gap-3 cursor-pointer select-none"
      >
        {/* Icon animation */}
        <div className="relative w-5 h-5">
          <Sun
            size={16}
            className={`absolute transition-all duration-300
              ${
                dark
                  ? "opacity-0 rotate-90 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              }`}
          />
          <Moon
            size={16}
            className={`absolute transition-all duration-300
              ${
                dark
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-0"
              }`}
          />
        </div>

        <span className="font-semibold">{dark ? "Dark" : "Light"}</span>

        {/* Toggle Switch */}
        <div
          className={`w-10 h-5 rounded-full relative transition-colors duration-300
            ${dark ? "bg-primary" : "bg-gray-400"}`}
        >
          <div
            className={`h-4 w-4 rounded-full bg-white absolute top-0.5
              transition-all duration-300 ease-in-out
              ${dark ? "translate-x-5 shadow-lg" : "translate-x-0 shadow-md"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Theme;
