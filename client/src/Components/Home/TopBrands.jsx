import { getAllBrands } from "@/API/Common/brandsApi";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toBrandSlug } from "../../utils/brandSlug";
const TopBrands = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getAllBrands();
        console.log("Response : ", res);
        if (res.status === 200) {
          setBrands(res.brands);
        }
      } catch (err) {
        console.error("Failed to load brands", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);
// YAHI ADD KARNA THA
  const duplicatedBrands = [...brands, ...brands, ...brands];

  // Function to handle View All button click
  const handleViewAllClick = () => {
    navigate("/brands");
  };

  const handleBrandClick = (brand) => {
    const brandSlug = toBrandSlug(brand);

    navigate(`/brand/${brandSlug}`, {
      state: { brand },
    });
  };

  return (
    <div
      className="p-6 bg-linear-to-br from-gray-50 to-gray-100 
      dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 
      mb-6 overflow-hidden group"
    >
      {/* Header with elegant design */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-2 h-8 bg-linear-to-b from-primary to-primary/70 
              rounded-full shadow-lg shadow-primary/30"
            ></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              TOP BRANDS
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-5">
            Leading names in technology, fashion & lifestyle
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-gray-800/80 
            rounded-full backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              LIVE SCROLLING
            </span>
          </div>
          <button
            onClick={handleViewAllClick}
            className="px-5 py-2.5 cursor-pointer bg-linear-to-r from-primary to-primary/90 
            hover:from-primary/90 hover:to-primary text-white text-sm font-semibold 
            rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 
            shadow-lg hover:shadow-xl shadow-primary/30 hover:shadow-primary/40"
          >
            VIEW ALL
          </button>
        </div>
      </div>

      {/* Brands Marquee Container - Fixed Height */}
      <div className="relative h-30 overflow-hidden">
        {/* Top Row - Moving Right */}
        <div className="absolute top-0 left-0 right-0 h-12.5 overflow-hidden">
          <div className="flex animate-marquee-right whitespace-nowrap py-3">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`top-${brand}-${index}`}
                className="inline-flex items-center mx-6 group/brand"
                onClick={() => handleBrandClick(brand)}
              >
                <span
                  className="text-2xl font-black text-gray-400/40 dark:text-gray-600/40 
                  tracking-wider hover:text-primary dark:hover:text-primary 
                  transition-all duration-500 hover:scale-110
                  cursor-pointer select-none"
                >
                  {brand}
                </span>
                <div
                  className="w-1 h-1 rounded-full bg-primary/30 mx-4 
                  group-hover/brand:bg-primary group-hover/brand:scale-150 
                  transition-all duration-300"
                ></div>
              </div>
            ))}
          </div>

          {/* Animated underline */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r 
            from-transparent via-primary/30 to-transparent animate-pulse"
          ></div>
        </div>

        {/* Middle Separator */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
          <div className="flex items-center justify-center">
            <div
              className="w-full h-px bg-linear-to-r from-transparent via-gray-300/50 
              dark:via-gray-600/50 to-transparent"
            ></div>
            <div
              className="mx-4 w-3 h-3 rotate-45 bg-primary/20 
              dark:bg-primary/30 border border-primary/30 dark:border-primary/40"
            ></div>
            <div
              className="w-full h-px bg-linear-to-r from-transparent via-gray-300/50 
              dark:via-gray-600/50 to-transparent"
            ></div>
          </div>
        </div>

        {/* Bottom Row - Moving Left */}
        <div className="absolute bottom-0 left-0 right-0 h-12.5 overflow-hidden">
          <div className="flex animate-marquee-left whitespace-nowrap py-3">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`bottom-${brand}-${index}`}
                className="inline-flex items-center mx-6 group/brand"
                onClick={() => handleBrandClick(brand)}
              >
                <div
                  className="w-1 h-1 rounded-full bg-secondary/30 mx-4 
                  group-hover/brand:bg-secondary group-hover/brand:scale-150 
                  transition-all duration-300"
                ></div>
                <span
                  className="text-2xl font-black text-gray-400/30 dark:text-gray-700/40 
                  tracking-wider hover:text-secondary dark:hover:text-secondary 
                  transition-all duration-500 hover:scale-110
                  cursor-pointer select-none"
                >
                  {brand}
                </span>
              </div>
            ))}
          </div>

          {/* Animated underline */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r 
            from-transparent via-secondary/30 to-transparent animate-pulse"
          ></div>
        </div>

        {/* Gradient edge fades */}
        <div
          className="absolute top-0 left-0 w-20 h-12.5 bg-linear-to-r 
          from-gray-50 dark:from-gray-900 to-transparent z-10"
        ></div>
        <div
          className="absolute top-0 right-0 w-20 h-12.5 bg-linear-to-l 
          from-gray-50 dark:from-gray-900 to-transparent z-10"
        ></div>
        <div
          className="absolute bottom-0 left-0 w-20 h-12.5 bg-linear-to-r 
          from-gray-50 dark:from-gray-900 to-transparent z-10"
        ></div>
        <div
          className="absolute bottom-0 right-0 w-20 h-12.5 bg-linear-to-l 
          from-gray-50 dark:from-gray-900 to-transparent z-10"
        ></div>

        {/* Center spotlight effect */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-transparent 
          to-gray-100/50 dark:to-gray-900/50 pointer-events-none"
        ></div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 50s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 50s linear infinite;
        }

        /* Pause on container hover */
        .group:hover .animate-marquee-left,
        .group:hover .animate-marquee-right {
          animation-play-state: paused;
        }

        /* Smooth gradient */
        .bg-gradient-radial {
          background-image: radial-gradient(
            circle at center,
            var(--tw-gradient-stops)
          );
        }

        /* Brand hover glow effect */
        .group/brand:hover span {
          text-shadow: 0 0 20px rgba(249, 126, 29, 0.3);
        }
      `}</style>
    </div>
  );
};

export default TopBrands;
