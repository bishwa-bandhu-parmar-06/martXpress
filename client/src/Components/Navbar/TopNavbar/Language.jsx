import React, { useState } from "react";
import { Globe, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
];

const Language = () => {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [open, setOpen] = useState(false);

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang.code);
    setOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Selected Language + Globe Icon */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-text cursor-pointer transition"
      >
        <Globe size={20} className="text-primary" />
        <span className="text-text dark:text-white font-medium">
          {selectedLang.label}
        </span>
      </button>

      {/* Full-screen Language Overlay */}
      {open && (
        <div
          /* 👇 1. Add onClick here to close modal */
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm"
        >
          <div
            /* 👇 2. Stop propagation here to prevent closing when clicking inside */
            onClick={(e) => e.stopPropagation()}
            className="w-80 max-w-xs rounded-xl p-6 relative
             bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-1 cursor-pointer rounded-full dark:hover:bg-gray-800 hover:bg-gray-200 transition"
            >
              <X
                size={20}
                className="text-secondary dark:text-primary dark:hover:text-white"
              />
            </button>

            <h2 className="text-xl dark:text-white font-bold mb-4 text-center">
              Select Language
            </h2>

            <ul>
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  className={`px-4 py-3 dark:text-white rounded-lg cursor-pointer mb-2 text-center transition
                    ${
                      selectedLang.code === lang.code
                        ? "bg-primary dark:text-white text-white font-semibold"
                        : "hover:bg-primary dark:hover:bg-gray-800 dark:text-white hover:text-white"
                    }`}
                  onClick={() => handleSelect(lang)}
                >
                  {lang.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Language;
