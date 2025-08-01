import React from "react";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  return (
    <>
      <div className="border-2 border-[#0050A0] rounded-xl pr-2 focus-within:border-[#F37324] transition-colors duration-300">
        <input
          type="text"
          placeholder="Search for Products, Brands and More"
          className="h-10 w-96 p-1.5 border-none outline-none"
        />

        <button type="submit" className="text-[#0050A0] cursor-pointer hover:text-[#F37324]">
          <FaSearch />
        </button>
      </div>
    </>
  );
};

export default Search;
