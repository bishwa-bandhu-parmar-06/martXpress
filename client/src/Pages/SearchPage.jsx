import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, SearchX, Star } from "lucide-react";
import api from "../API/axiosInstance"; // Adjust path if needed

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Calls your backend search endpoint
        const res = await api.get(
          `/search?keyword=${encodeURIComponent(keyword)}`,
        );
        if (res.data.status === 200) {
          setProducts(res.data.products || []);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo(0, 0);
  }, [keyword]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b dark:border-gray-800 pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Search Results for <span className="text-primary">"{keyword}"</span>
          </h1>
          <p className="text-gray-500 mt-2">
            {!loading && `${products.length} products found`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary w-12 h-12" />
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700">
            <SearchX className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-xl font-bold dark:text-white mb-2">
              No matches found
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find anything matching "{keyword}". Try adjusting your
              search term or checking for typos.
            </p>
          </div>
        ) : (
          /* Results Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:border-primary/50 group flex flex-col"
              >
                {/* Image */}
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl mb-4 overflow-hidden relative">
                  <img
                    src={product.images?.[0] || "https://placehold.co/300x300"}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
                  />
                  {/* Rating Badge */}
                  {product.averageRating > 0 && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Star
                        size={12}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      {product.averageRating.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 line-clamp-1">
                    {product.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 text-sm sm:text-base group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="mt-auto">
                    <span className="text-lg font-black text-gray-900 dark:text-white">
                      ₹{product.finalPrice?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
