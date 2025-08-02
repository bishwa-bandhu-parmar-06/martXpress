import React from "react";
import { MdDarkMode } from "react-icons/md";

const ThemeToggleBtn = () => {
  return (
    <>
      <div className="flex justify-around items-center gap-1 cursor-pointer font-extrabold text-3xl hover:text-[#F37324]">
        <MdDarkMode />
      </div>
    </>
  );
};

export default ThemeToggleBtn;
