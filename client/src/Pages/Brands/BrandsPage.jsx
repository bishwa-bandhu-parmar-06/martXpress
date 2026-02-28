import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBrands } from "@/API/Common/brandsApi";
import { toBrandSlug } from "@/utils/brandSlug";
import { Search, Award, Sparkles, Frown } from "lucide-react";

const BrandsPage = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const fetchBrands = async () => {
      try {
        const res = await getAllBrands();
        if (res?.status === 200) {
          setBrands(res.brands || []);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brand) => {
    const slug = toBrandSlug(brand);
    navigate(`/brand/${slug}`, {
      state: { brand },
    });
  };

  // Filter brands based on search input
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
      {/* 🌟 Premium Hero Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
              <Sparkles size={16} />
              <span>Premium Partners</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
              Explore{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-500">
                Top Brands
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
              Discover quality products from your favorite global and local
              brands, all in one place.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-auto min-w-75">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* ⏳ Skeleton Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm animate-pulse flex flex-col items-center justify-center h-32"
              >
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-3"></div>
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ✨ Brands Grid */}
            {filteredBrands.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {filteredBrands.map((brand, index) => (
                  <div
                    key={index}
                    onClick={() => handleBrandClick(brand)}
                    className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/50"
                  >
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Brand Icon Placeholder (Optional: If you have brand logos, map them here) */}
                    <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/10 transition-transform duration-300 shadow-sm border border-gray-100 dark:border-gray-600">
                      <Award
                        size={24}
                        className="text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors"
                      />
                    </div>

                    {/* Brand Name */}
                    <span className="relative text-sm md:text-base font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors duration-300 z-10 line-clamp-2">
                      {brand}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              /* 📭 Empty / No Results State */
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm mt-8">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                  <Frown
                    size={40}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {searchQuery ? "No brands found" : "No brands available"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchQuery
                    ? `We couldn't find any brand matching "${searchQuery}". Try checking for typos or clear your search.`
                    : "We are currently updating our brand list. Please check back later!"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-6 px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-md"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;
