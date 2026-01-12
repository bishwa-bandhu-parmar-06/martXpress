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

const BottomNavbar = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-12">
        {categories.map((cat) => (
          <div key={cat.name} className="relative group">
            {/* Category Button */}
            <button
              className="flex items-center gap-1 text-sm font-medium
              text-gray-700 dark:text-gray-200
              hover:text-primary transition"
            >
              {cat.name}
              <ChevronDown size={14} />
            </button>

            {/* Dropdown */}
            <div
              className="absolute left-0 top-full mt-2
              invisible opacity-0 group-hover:visible group-hover:opacity-100
              transition-all duration-200
              bg-white dark:bg-gray-800 shadow-xl rounded-lg
              min-w-[180px] z-50"
            >
              <ul className="py-2">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="px-4 py-2 text-sm
                      text-gray-700 dark:text-gray-200
                      hover:bg-gray-100 dark:hover:bg-gray-700
                      cursor-pointer transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
