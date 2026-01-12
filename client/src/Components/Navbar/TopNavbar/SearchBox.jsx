import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
const SearchBox = () => {
  const { t } = useTranslation();
  return (
    <div className="w-[80%] max-w-xl mx-auto">
      <div className="flex items-center border-2 border-primary rounded-xl overflow-hidden">
        {/* Input */}
        <input
          type="text"
          placeholder={t("search")}
          className="flex-1 px-4 py-2 text-text dark:text-white placeholder:text-text focus:outline-none"
        />

        {/* Button */}
        <button className="text-secondary  dark:text-white px-4 py-2 hover:bg-opacity-90 cursor-pointer transition-colors">
          <Search size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
