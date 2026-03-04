import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../../API/axiosInstance";

const SearchBox = ({ isMobile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/search/suggestions?q=${query}`);
        if (res.data.success) {
          setSuggestions(res.data.suggestions);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?keyword=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <div ref={wrapperRef} className="w-full relative z-50">
      <form
        onSubmit={handleSearchSubmit}
        className={`flex items-stretch ${
          isMobile ? "h-10.5" : "h-12"
        } border-2 border-primary rounded-xl overflow-hidden bg-white dark:bg-gray-800 focus-within:ring-4 focus-within:ring-primary/20 transition-all shadow-sm`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder={t("search")}
          className={`flex-1 h-full bg-transparent placeholder:text-gray-400 focus:outline-none text-gray-900 dark:text-white ${
            isMobile ? "px-4 text-sm" : "px-5 text-base"
          }`}
          autoComplete="off"
        />

        {/* FIX: Flex items-center to keep the icon perfectly centered within the fully stretched button */}
        <button
          type="submit"
          className={`flex items-center justify-center text-white bg-primary hover:bg-primary/90 cursor-pointer transition-colors ${
            isMobile ? "px-4" : "px-6"
          }`}
        >
          {isLoading ? (
            <Loader2 size={isMobile ? 18 : 20} className="animate-spin" />
          ) : (
            <Search size={isMobile ? 18 : 22} strokeWidth={2.5} />
          )}
        </button>
      </form>

      {/* DROPDOWN REMAINS UNCHANGED */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {suggestions.length === 0 && !isLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No products found for "{query}"
            </div>
          ) : (
            <ul className="max-h-100 overflow-y-auto custom-scrollbar">
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <TrendingUp size={14} /> Suggestions
              </div>

              {suggestions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSuggestionClick(item.id)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                >
                  <div className="w-10 h-10 rounded-md bg-gray-100 dark:bg-gray-900 shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={item.images?.[0] || "https://placehold.co/100x100"}
                      alt={item.name}
                      className="w-full h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.category}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-primary shrink-0">
                    ₹{item.finalPrice?.toLocaleString("en-IN")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;