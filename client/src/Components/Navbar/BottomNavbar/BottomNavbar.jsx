import React from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    name: "Electronics",
    items: ["Laptops", "Cameras", "Headphones", "Speakers"],
  },
  {
    name: "TV & Appliances",
    items: ["Television", "Washing Machine", "Refrigerator", "AC"],
  },
  {
    name: "Mobiles & Tablets",
    items: ["Smartphones", "Tablets", "Accessories"],
  },

  {
    name: "Fashion",
    items: ["Men", "Women", "Kids", "Footwear"],
  },
  {
    name: "Beauty & Personal Care",
    items: ["Skincare", "Haircare", "Makeup", "Fragrances"],
  },
  {
    name: "Home & Furniture",
    items: ["Sofa", "Bed", "Dining", "Decor"],
  },
  {
    name: "Grocery",
    items: ["Fruits", "Vegetables", "Snacks", "Beverages"],
  },
];

import { useState } from "react";
import DropdownPortal from "../../DropdownPortal";

const BottomNavbar = () => {
  const [dropdown, setDropdown] = useState(null);

  const handleMouseEnter = (e, items) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdown({
      items,
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  const handleMouseLeave = () => {
    setDropdown(null);
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-20 whitespace-nowrap">
            {categories.map((cat, index) => (
              <button
                key={index}
                onMouseEnter={(e) => handleMouseEnter(e, cat.items)}
                onMouseLeave={handleMouseLeave}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary"
              >
                {cat.name}
                <ChevronDown size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 REAL DROPDOWN (OUTSIDE NAVBAR) */}
      {dropdown && (
        <DropdownPortal>
          <div
            style={{
              position: "absolute",
              top: dropdown.top,
              left: dropdown.left,
            }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-lg min-w-[220px] z-[9999]"
            onMouseEnter={() => setDropdown(dropdown)}
            onMouseLeave={handleMouseLeave}
          >
            <ul className="py-2">
              {dropdown.items.map((item) => (
                <li
                  key={item}
                  className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </DropdownPortal>
      )}
    </>
  );
};

export default BottomNavbar;
