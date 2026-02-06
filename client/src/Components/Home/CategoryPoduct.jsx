import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toCategorySlug } from "../../utils/categorySlug";
// Bhai humne mapping rakhi hai icons/colors ke liye taaki design wahi rahe
const CATEGORY_STYLE_MAP = {
  Fashion: {
    icon: "👗",
    color: "from-pink-500 to-rose-500",
    bgColor:
      "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
  },
  Electronics: {
    icon: "💻",
    color: "from-blue-500 to-indigo-500",
    bgColor:
      "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
  },
  "TV & Appliances": {
    icon: "📺",
    color: "from-purple-500 to-violet-500",
    bgColor:
      "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
  },
  "Mobiles & Tablets": {
    icon: "📱",
    color: "from-cyan-500 to-blue-500",
    bgColor:
      "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
  },
  "Home & Furniture": {
    icon: "🏠",
    color: "from-emerald-500 to-teal-500",
    bgColor:
      "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
  },
  "Beauty & Personal Care": {
    icon: "💄",
    color: "from-rose-500 to-pink-500",
    bgColor:
      "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
  },
  Grocery: {
    icon: "🛒",
    color: "from-green-500 to-emerald-500",
    bgColor:
      "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
  },
};

// Ab hum props se data le rahe hain: dbProducts aur totalCount
const CategoryProducts = ({
  categoryName,
  dbProducts = [],
  totalCount = 0,
}) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Theme logic (Same as before)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  }, []);

  // Use provided categoryName
  const safeCategoryName = categoryName || "Fashion";

  // Get style from our map based on name from DB
  const style = CATEGORY_STYLE_MAP[safeCategoryName] || {
    icon: "📦",
    color: "from-gray-500 to-slate-500",
    bgColor: "bg-gray-100",
  };

  // REAL DATA: dbProducts backend se aa raha hai
  const products = dbProducts;

  const visibleCount = 6;
  const totalSlides =
    products.length > visibleCount ? products.length - visibleCount + 2 : 1;
  const canSlide = products.length > visibleCount;
  const isAtLastSlide = currentIndex === totalSlides - 1;

  const colorClass = style.color.replace("linear", "gradient");

  const scrollLeft = () => {
    if (currentIndex > 0 && !isTransitioning && canSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const scrollRight = () => {
    if (currentIndex < totalSlides - 1 && !isTransitioning && canSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToSlide = (index) => {
    if (
      canSlide &&
      index !== currentIndex &&
      !isTransitioning &&
      index >= 0 &&
      index < totalSlides
    ) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleProductClick = (product) => {
    // ID key change: p.id to p._id for DB
    navigate(`/product/${product._id}`, {
      state: { productData: product },
    });
  };

  const handleViewAll = () => {
    const categorySlug = toCategorySlug(safeCategoryName);

    // Navigate to category page with data in state
    navigate(`/category/${categorySlug}`, {
      state: {
        categoryName: safeCategoryName,
      },
    });
  };

  const productWidth = `${100 / visibleCount}%`;

  return (
    <div
      className={`px-6 md:px-20 p-6 bg-linear-to-r ${style.bgColor} dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6 rounded-2xl transition-colors duration-300`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-linear-to-r ${colorClass} text-white shadow-lg transition-transform duration-300 hover:scale-105`}
          >
            {style.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {safeCategoryName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Total {totalCount} products available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {canSlide && totalSlides > 1 && (
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-primary dark:bg-orange-400 scale-125" : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"}`}
                />
              ))}
            </div>
          )}
          <button
            onClick={handleViewAll}
            className="px-6 py-3 cursor-pointer bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 border border-gray-300 dark:border-gray-700"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative">
        {canSlide && currentIndex > 0 && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 cursor-pointer top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center transition-all z-20 border border-gray-200"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: canSlide
                ? `translateX(-${currentIndex * (100 / visibleCount)}%)`
                : "translateX(0)",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => handleProductClick(product)}
                className="shrink-0 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group hover:-translate-y-1"
                style={{
                  width: `calc(${productWidth} - 8px)`,
                  margin: "0 4px",
                }}
              >
                <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {/* Image key updated to product.images[0] */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{product.finalPrice.toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${i < (Math.floor(product.averageRating) || 4) ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.totalRatings || 0})
                      </span>
                    </div>
                    <button className="cursor-pointer w-full py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary dark:hover:bg-orange-600 hover:text-white text-sm font-medium transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {canSlide && (
              <div
                className="shrink-0 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col items-center justify-center group border-2 border-blue-200"
                style={{
                  width: `calc(${productWidth} - 8px)`,
                  margin: "0 4px",
                }}
                onClick={handleViewAll}
              >
                <div className="h-40 w-full flex items-center justify-center bg-transparent p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <ArrowRight
                        size={32}
                        className="text-primary group-hover:text-white"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      View All
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Explore all {totalCount}+ products
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {canSlide && currentIndex < totalSlides - 1 && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 cursor-pointer bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center z-20 border border-gray-200"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {canSlide
            ? isAtLastSlide
              ? `View all ${totalCount} products`
              : `Showing products from ${safeCategoryName}`
            : `Showing all products`}
        </span>
      </div>
    </div>
  );
};

export default CategoryProducts;
