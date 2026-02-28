// import React, { useState } from "react";
// import { Globe, X } from "lucide-react";
// import { useTranslation } from "react-i18next";

// const languages = [
//   { code: "en", label: "English" },
//   { code: "hi", label: "Hindi" },
//   { code: "es", label: "Spanish" },
//   { code: "fr", label: "French" },
// ];

// const Language = () => {
//   const { i18n } = useTranslation();
//   const [selectedLang, setSelectedLang] = useState(languages[0]);
//   const [open, setOpen] = useState(false);

//   const handleSelect = (lang) => {
//     setSelectedLang(lang);
//     i18n.changeLanguage(lang.code);
//     setOpen(false);
//   };

//   return (
//     <div className="relative flex items-center">
//       {/* TRIGGER BUTTON: Standardized to match Cart/Wishlist/Users */}
//       <button
//         onClick={() => setOpen(true)}
//         className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 group cursor-pointer border-none bg-transparent outline-none"
//       >
//         <div className="relative">
//           <Globe 
//             size={20} 
//             className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" 
//           />
//         </div>
        
//         {/* Responsive Text: Matches other navbar labels */}
//         <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">
//           {selectedLang.label}
//         </span>
//       </button>

//       {/* FULL-SCREEN OVERLAY MODAL */}
//       {open && (
//         <div
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100] backdrop-blur-sm animate-in fade-in duration-300"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="w-80 max-w-xs rounded-2xl p-6 relative
//              bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl scale-in-center"
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setOpen(false)}
//               className="absolute top-4 right-4 p-1.5 cursor-pointer rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-all"
//             >
//               <X size={18} />
//             </button>

//             <h2 className="text-xl dark:text-white font-bold mb-6 text-center">
//               Select Language
//             </h2>

//             <ul className="space-y-2">
//               {languages.map((lang) => (
//                 <li
//                   key={lang.code}
//                   className={`px-4 py-3 rounded-xl cursor-pointer text-center transition-all duration-200 font-medium
//                     ${
//                       selectedLang.code === lang.code
//                         ? "bg-primary text-white shadow-lg shadow-primary/20"
//                         : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//                     }`}
//                   onClick={() => handleSelect(lang)}
//                 >
//                   {lang.label}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Language;


import React, { useState } from "react";
import { Globe, X } from "lucide-react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
];

const Language = () => {
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [open, setOpen] = useState(false);

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    setOpen(false);

    // --- GOOGLE TRANSLATE TRIGGER LOGIC ---
    const googleCombo = document.querySelector(".goog-te-combo");
    if (googleCombo) {
      googleCombo.value = lang.code;
      googleCombo.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className="relative flex items-center">
      {/* TRIGGER BUTTON (Standardized design) */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg dark:hover:bg-gray-800 hover:bg-gray-200 transition-all duration-300 group cursor-pointer"
      >
        <Globe size={20} className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
        <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">
          {selectedLang.label}
        </span>
      </button>

      {/* CUSTOM OVERLAY (Now looks like the rest of your app) */}
      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm flex justify-center items-center">
          <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-900 w-80 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white">Language</h2>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"><X size={20}/></button>
            </div>
            <ul className="space-y-2">
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  className={`px-4 py-3 rounded-xl cursor-pointer transition-all ${
                    selectedLang.code === lang.code 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
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