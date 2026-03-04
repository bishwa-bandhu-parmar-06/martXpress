import React, { useState } from "react";
import { Globe, X } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
];

const Language = ({ isSidebar, onClick }) => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [open, setOpen] = useState(false);

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    setOpen(false);
    if (onClick) onClick(); // Closes the sidebar if in mobile mode

    const googleCombo = document.querySelector(".goog-te-combo");
    if (googleCombo) {
      googleCombo.value = lang.code;
      googleCombo.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className={`relative flex items-center ${isSidebar ? "w-full" : ""}`}>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl dark:hover:bg-gray-800 hover:bg-gray-100 transition-all duration-300 group cursor-pointer ${isSidebar ? "w-full" : ""}`}
      >
        <Globe
          size={20}
          className="text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors shrink-0"
        />
        <span
          className={`font-medium text-gray-700 dark:text-gray-200 ${isSidebar ? "block" : "hidden md:block"}`}
        >
          {selectedLang.label}
        </span>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-200 backdrop-blur-sm flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 w-[90%] max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Language</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="space-y-2">
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  className={`px-4 py-3 rounded-xl cursor-pointer transition-all font-medium ${
                    selectedLang.code === lang.code
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
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
