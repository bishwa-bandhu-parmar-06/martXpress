import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCategories } from "../../../API/Common/categoryApi";
import { useNavigate } from "react-router-dom";
import { toCategorySlug } from "../../../utils/categorySlug";

const BottomNavbar = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderRef = useRef(null);

  // fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.success) {
          setCategories(res.data);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // slider controls
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const amount = direction === "left" ? -200 : 200;
    sliderRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="h-12 flex items-center justify-center text-sm text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-12 flex items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700 relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-105 cursor-pointer"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Slider */}
      <div ref={sliderRef} className="overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-10 h-12 flex items-center gap-14 whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                navigate(`/category/${toCategorySlug(cat)}`, {
                  state: { categoryName: cat },
                })
              }
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary transition cursor-pointer"
            >
              {cat}
              <ChevronDown size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-105 cursor-pointer"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default BottomNavbar;
