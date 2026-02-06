import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCategories } from "../../../API/Common/categoryApi";
import DropdownPortal from "../../DropdownPortal";
import { useNavigate } from "react-router-dom";
import { toCategorySlug } from "../../../utils/categorySlug";
const BottomNavbar = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdown, setDropdown] = useState(null);

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

  const handleMouseEnter = (e, category) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdown({
      category,
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  const handleMouseLeave = () => setDropdown(null);

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
    <>
      <div className="w-full bg-white dark:bg-gray-900 border-t dark:border-gray-700 relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-105"
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
                onMouseEnter={(e) => handleMouseEnter(e, cat)}
                onMouseLeave={handleMouseLeave}
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
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white dark:bg-gray-800 shadow hover:scale-105"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/*Dropdown (future-ready) */}
      {dropdown && (
        <DropdownPortal>
          <div
            style={{
              position: "absolute",
              top: dropdown.top,
              left: dropdown.left,
            }}
            onMouseEnter={() => setDropdown(dropdown)}
            onMouseLeave={handleMouseLeave}
            className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl min-w-55 z-9999"
          >
            <div className="px-4 py-3 text-sm font-semibold border-b dark:border-gray-700">
              {dropdown.category}
            </div>

            <div className="px-4 py-6 text-xs text-gray-500">
              Sub-categories coming soon
            </div>
          </div>
        </DropdownPortal>
      )}
    </>
  );
};

export default BottomNavbar;
