import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Category-specific data
const CATEGORY_DATA = {
  Fashion: {
    icon: "👗",
    color: "from-pink-500 to-rose-500",
    bgColor:
      "bg-linear-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    products: [
      {
        id: 1,
        name: "Men's Casual Shirt",
        price: 799,
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      },
      {
        id: 2,
        name: "Women's Summer Dress",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400",
      },
      {
        id: 3,
        name: "Sports Shoes",
        price: 1899,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      },
      {
        id: 4,
        name: "Designer Handbag",
        price: 2599,
        image:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
      },
      {
        id: 5,
        name: "Winter Jacket",
        price: 3499,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      },
      {
        id: 6,
        name: "Formal Suit",
        price: 4599,
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400",
      },
      {
        id: 7,
        name: "Leather Jacket",
        price: 5999,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
      },
      {
        id: 8,
        name: "Running Shoes",
        price: 2899,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      },
      {
        id: 9,
        name: "Casual T-Shirts",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
      },
      {
        id: 10,
        name: "Denim Jeans",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      },
    ],
  },
  Electronics: {
    icon: "💻",
    color: "from-blue-500 to-indigo-500",
    bgColor:
      "bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    products: [
      {
        id: 11,
        name: "Wireless Earbuds",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
      {
        id: 12,
        name: "Smart Watch",
        price: 3999,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      },
      {
        id: 13,
        name: "Laptop",
        price: 45999,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      },
      {
        id: 14,
        name: "Gaming Console",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
      },
      {
        id: 15,
        name: "4K TV",
        price: 28999,
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      },
      {
        id: 16,
        name: "Drone Camera",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
      },
      {
        id: 17,
        name: "Bluetooth Speaker",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      },
      {
        id: 18,
        name: "Tablet",
        price: 25999,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      },
      {
        id: 19,
        name: "Camera",
        price: 35999,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
      },
      {
        id: 20,
        name: "Headphones",
        price: 2999,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
    ],
  },
  "TV & Appliances": {
    icon: "📺",
    color: "from-purple-500 to-violet-500",
    bgColor:
      "bg-linear-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
    products: [
      {
        id: 21,
        name: 'Smart TV 55"',
        price: 45999,
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      },
      {
        id: 22,
        name: "Refrigerator",
        price: 28999,
        image:
          "https://images.unsplash.com/photo-1584568694244-e2e9d4b6e7c5?w=400",
      },
      {
        id: 23,
        name: "Washing Machine",
        price: 21999,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
      {
        id: 24,
        name: "Air Conditioner",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
      {
        id: 25,
        name: "Microwave Oven",
        price: 8999,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
      {
        id: 26,
        name: "Home Theater",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
      },
      {
        id: 27,
        name: "Air Purifier",
        price: 8999,
        image:
          "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400",
      },
      {
        id: 28,
        name: "Water Purifier",
        price: 12999,
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
      {
        id: 29,
        name: "Electric Kettle",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
      {
        id: 30,
        name: "Induction Cooktop",
        price: 3999,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
    ],
  },
  "Mobiles & Tablets": {
    icon: "📱",
    color: "from-cyan-500 to-blue-500",
    bgColor:
      "bg-linear-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
    products: [
      {
        id: 61,
        name: "Smartphone 128GB",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      },
      {
        id: 62,
        name: 'Tablet 10" Display',
        price: 25999,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      },
      {
        id: 63,
        name: "Wireless Earphones",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
      {
        id: 64,
        name: "Power Bank 20000mAh",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400",
      },
      {
        id: 65,
        name: "Phone Case & Protector",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=400",
      },
      {
        id: 66,
        name: "Fast Charger 65W",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=400",
      },
      {
        id: 67,
        name: "Smartphone 256GB",
        price: 28999,
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      },
      {
        id: 68,
        name: "Gaming Phone",
        price: 35999,
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      },
      {
        id: 69,
        name: "Tablet with Pen",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      },
      {
        id: 70,
        name: "Bluetooth Headset",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      },
    ],
  },
  "Home & Furniture": {
    icon: "🏠",
    color: "from-emerald-500 to-teal-500",
    bgColor:
      "bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    products: [
      {
        id: 31,
        name: "Sofa Set",
        price: 25999,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      },
      {
        id: 32,
        name: "Dining Table",
        price: 18999,
        image:
          "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400",
      },
      {
        id: 33,
        name: "Bed King Size",
        price: 32999,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
      },
      {
        id: 34,
        name: "Wardrobe",
        price: 21999,
        image:
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400",
      },
      {
        id: 35,
        name: "Study Table",
        price: 8999,
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      },
      {
        id: 36,
        name: "Bookshelf",
        price: 6999,
        image:
          "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=400",
      },
      {
        id: 37,
        name: "Coffee Table",
        price: 5999,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      },
      {
        id: 38,
        name: "Office Chair",
        price: 7999,
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      },
      {
        id: 39,
        name: "Dressing Table",
        price: 11999,
        image:
          "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400",
      },
      {
        id: 40,
        name: "TV Unit",
        price: 14999,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
      },
    ],
  },
  "Beauty & Personal Care": {
    icon: "💄",
    color: "from-rose-500 to-pink-500",
    bgColor:
      "bg-linear-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
    products: [
      {
        id: 41,
        name: "Skincare Set",
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400",
      },
      {
        id: 42,
        name: "Hair Dryer",
        price: 1999,
        image:
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
      },
      {
        id: 43,
        name: "Perfume",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
      },
      {
        id: 44,
        name: "Makeup Kit",
        price: 1599,
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      },
      {
        id: 45,
        name: "Electric Shaver",
        price: 1799,
        image:
          "https://images.unsplash.com/photo-1523413363575-60c89e5d7172?w=400",
      },
      {
        id: 46,
        name: "Face Cream",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
      },
      {
        id: 47,
        name: "Body Lotion",
        price: 699,
        image:
          "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400",
      },
      {
        id: 48,
        name: "Hair Straightener",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
      },
      {
        id: 49,
        name: "Lipstick Set",
        price: 1199,
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      },
      {
        id: 50,
        name: "Face Wash",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
      },
    ],
  },
  Grocery: {
    icon: "🛒",
    color: "from-green-500 to-emerald-500",
    bgColor:
      "bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    products: [
      {
        id: 51,
        name: "Organic Rice 5kg",
        price: 399,
        image:
          "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
      },
      {
        id: 52,
        name: "Extra Virgin Olive Oil",
        price: 599,
        image:
          "https://images.unsplash.com/photo-1533050487297-09b450131914?w=400",
      },
      {
        id: 53,
        name: "Assorted Dry Fruits",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400",
      },
      {
        id: 54,
        name: "Organic Honey 1kg",
        price: 349,
        image:
          "https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=400",
      },
      {
        id: 55,
        name: "Spices Combo Pack",
        price: 299,
        image:
          "https://images.unsplash.com/photo-1596040033221-a1f4f8a6d123?w=400",
      },
      {
        id: 56,
        name: "Premium Tea Leaves",
        price: 249,
        image:
          "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",
      },
      {
        id: 57,
        name: "Coffee Beans 500g",
        price: 499,
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
      },
      {
        id: 58,
        name: "Pasta & Noodles Pack",
        price: 199,
        image:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400",
      },
      {
        id: 59,
        name: "Cereal Breakfast Pack",
        price: 349,
        image:
          "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400",
      },
      {
        id: 60,
        name: "Cooking Oil 5L",
        price: 699,
        image:
          "https://images.unsplash.com/photo-1533050487297-09b450131914?w=400",
      },
    ],
  },
};

const CategoryProducts = ({ categoryName = "Fashion" }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("theme");
      setDarkMode(savedTheme === "dark");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  // Use provided categoryName or default to "Fashion"
  const safeCategoryName = categoryName || "Fashion";

  // Get category data or default to Fashion if category doesn't exist
  const categoryData =
    CATEGORY_DATA[safeCategoryName] || CATEGORY_DATA["Fashion"];
  const products = categoryData.products;

  // Show 6 products at a time
  const visibleCount = 6;
  // Calculate total slides including a "View All" slide at the end
  const totalSlides =
    products.length > visibleCount ? products.length - visibleCount + 2 : 1;
  const canSlide = products.length > visibleCount;
  const isAtLastSlide = currentIndex === totalSlides - 1;

  // Fix: Changed bg-linear-to-r to bg-linear-to-r
  const colorClass = categoryData.color.replace("linear", "gradient");

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

  const handleProductClick = (productId) => {
    // Find the product in the current category
    const product = products.find((p) => p.id === productId);

    if (product) {
      navigate(`/product/${productId}`, {
        state: {
          productData: {
            ...product,
            category: safeCategoryName,
            categoryIcon: categoryData.icon,
            categoryColor: categoryData.color,
            categoryBgColor: categoryData.bgColor,
          },
        },
      });
    }
  };

  const handleViewAll = () => {
    const categorySlug = safeCategoryName
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/ /g, "-");

    // Pass category data via state
    navigate(`/category/${categorySlug}`, {
      state: {
        categoryName: safeCategoryName,
        categoryData: categoryData,
      },
    });
  };

  // Calculate product width percentage (100% / visibleCount)
  const productWidth = `${100 / visibleCount}%`;

  return (
    <div
      className={`px-6 md:px-20 p-6 ${categoryData.bgColor} dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-6 rounded-2xl transition-colors duration-300`}
    >
      {/* Category Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl 
            bg-linear-to-r ${colorClass} text-white shadow-lg transition-transform duration-300 hover:scale-105`}
          >
            {categoryData.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {safeCategoryName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Best deals on {safeCategoryName.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation Dots - Only show if we can slide */}
          {canSlide && totalSlides > 1 && (
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary dark:bg-orange-400 scale-125"
                      : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          <button
            onClick={handleViewAll}
            className="px-6 py-3 cursor-pointer bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
              font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
              transition-all duration-300 flex items-center gap-2 border border-gray-300 dark:border-gray-700
              hover:scale-105 active:scale-95"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Products Container with Navigation */}
      <div className="relative">
        {/* Left Navigation Button - Show if not at first slide */}
        {canSlide && currentIndex > 0 && (
          <button
            onClick={scrollLeft}
            disabled={isTransitioning}
            className={`absolute left-0 cursor-pointer top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 
              w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl 
              flex items-center justify-center transition-all duration-300 z-20 
              border border-gray-200 dark:border-gray-700 hover:scale-110 active:scale-95
              hover:shadow-2xl dark:hover:shadow-gray-900/50
              ${
                isTransitioning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            aria-label="Scroll left"
          >
            <ChevronLeft
              className="text-gray-700 dark:text-gray-300"
              size={24}
            />
          </button>
        )}

        {/* Products Container */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: canSlide
                ? `translateX(-${currentIndex * (100 / visibleCount)}%)`
                : "translateX(0)",
            }}
          >
            {/* Display actual products */}
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="shrink-0 bg-white dark:bg-gray-800 rounded-xl 
                  overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 
                  cursor-pointer border border-gray-100 dark:border-gray-700 group
                  hover:border-primary/20 dark:hover:border-orange-400/20 hover:-translate-y-1"
                style={{
                  width: `calc(${productWidth} - 8px)`,
                  margin: "0 4px",
                }}
              >
                {/* Product Image */}
                <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through transition-colors duration-300">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < (product.rating || 4)
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({product.reviews || 24})
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality here
                      }}
                      className="w-full py-2.5 cursor-pointer bg-gray-100 dark:bg-gray-700 
                        text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary dark:hover:bg-orange-600 
                        hover:text-white text-sm font-medium transition-all duration-200
                        hover:scale-[1.02] active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* View All Slide - Only shows when there are more than visibleCount products */}
            {canSlide && (
              <div
                className="shrink-0 bg-linear-to-br from-blue-50 to-indigo-50 
                  dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-xl 
                  overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 
                  cursor-pointer border-2 border-blue-200 dark:border-gray-700 
                  flex flex-col items-center justify-center group hover:border-primary dark:hover:border-orange-400
                  hover:-translate-y-1"
                style={{
                  width: `calc(${productWidth} - 8px)`,
                  margin: "0 4px",
                }}
                onClick={handleViewAll}
              >
                <div className="h-40 w-full flex items-center justify-center bg-transparent p-6">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-gray-700 
                      flex items-center justify-center group-hover:bg-primary dark:group-hover:bg-orange-400
                      transition-colors duration-300"
                    >
                      <ArrowRight
                        size={32}
                        className="text-primary dark:text-blue-400 group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                    <h3 className="text-xl cursor-pointer font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                      View All Products
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                      Explore all {products.length}+{" "}
                      {safeCategoryName.toLowerCase()} products
                    </p>
                  </div>
                </div>

                <div className="p-4 w-full">
                  <button
                    className="w-full cursor-pointer py-3 bg-primary hover:bg-secondary
                      dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-lg 
                      font-medium transition-all duration-200 flex items-center justify-center gap-2
                      hover:scale-[1.02] active:scale-95"
                  >
                    <span>Browse All</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Navigation Button - Show if not at last slide */}
        {canSlide && currentIndex < totalSlides - 1 && (
          <button
            onClick={scrollRight}
            disabled={isTransitioning}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 
              w-10 h-10 cursor-pointer md:w-12 md:h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl 
              flex items-center justify-center transition-all duration-300 z-20 
              border border-gray-200 dark:border-gray-700 hover:scale-110 active:scale-95
              hover:shadow-2xl dark:hover:shadow-gray-900/50
              ${
                isTransitioning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            aria-label="Scroll right"
          >
            <ChevronRight
              className="text-gray-700 dark:text-gray-300"
              size={24}
            />
          </button>
        )}
      </div>

      {/* Page Indicator */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
          {canSlide ? (
            <>
              {isAtLastSlide ? (
                <>View all {products.length} products</>
              ) : (
                <>
                  Showing{" "}
                  {Math.min(currentIndex * visibleCount + 1, products.length)}-
                  {Math.min((currentIndex + 1) * visibleCount, products.length)}{" "}
                  of {products.length} products
                </>
              )}
            </>
          ) : (
            <>Showing all {products.length} products</>
          )}
        </span>
      </div>

      {/* Quick Links */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm 
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700
          hover:scale-105 active:scale-95"
        >
          Best Sellers
        </button>
        <button
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm 
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700
          hover:scale-105 active:scale-95"
        >
          New Arrivals
        </button>
        <button
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm 
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700
          hover:scale-105 active:scale-95"
        >
          Under ₹999
        </button>
        <button
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm 
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700
          hover:scale-105 active:scale-95"
        >
          Discounts
        </button>
        <button
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm 
          hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700
          hover:scale-105 active:scale-95"
        >
          Top Rated
        </button>
      </div>
    </div>
  );
};

// Add default props for safety
CategoryProducts.defaultProps = {
  categoryName: "Fashion",
};

export default CategoryProducts;
