import React from "react";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeProductsList = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-12">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl 
                shadow-lg hover:shadow-2xl transition-all duration-300 
                overflow-hidden cursor-pointer transform hover:-translate-y-1
                border border-gray-100 dark:border-gray-700"
            >
              {/* Product Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-50 dark:bg-gray-900">
                {product.images?.length > 0 ? (
                  <div className="flex h-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 
                        transition-transform duration-500"
                    />
                    {product.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 flex gap-1">
                        {product.images.slice(0, 3).map((_, idx) => (
                          <div
                            key={idx}
                            className="w-2 h-2 rounded-full bg-white/80"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="px-3 py-1 bg-primary text-white text-xs 
                    font-semibold rounded-full shadow"
                  >
                    {product.category}
                  </span>
                </div>

                {/* Quick View Button */}
                <div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300"
                >
                  <button
                    className="p-2 bg-white dark:bg-gray-700 rounded-full 
                    shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Eye
                      size={18}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5">
                {/* Product Name and Rating */}
                <div className="mb-4">
                  <h3
                    className="font-bold text-lg dark:text-white mb-2 
                    line-clamp-2 group-hover:text-primary transition-colors"
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          className={`${
                            star <= Math.floor(product.averageRating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>

                {/* Price and Action Button */}
                <div
                  className="flex items-center justify-between pt-4 border-t 
                  border-gray-100 dark:border-gray-700"
                >
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Price
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{product.price?.toLocaleString() || "0"}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart functionality here
                    }}
                    className="px-4 py-2 bg-linear-to-right from-primary to-secondary 
                      text-black  dark:text-white font-semibold rounded-lg hover:opacity-90 
                      transition-opacity"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Empty State
          <div
            className="col-span-full flex flex-col items-center justify-center 
            py-16 md:py-24"
          >
            <div
              className="w-32 h-32 bg-linear-to-br from-primary/10 to-secondary/10 
              rounded-full flex items-center justify-center mb-6"
            >
              <ShoppingBag className="w-16 h-16 text-primary/50" />
            </div>
            <h3 className="text-2xl font-bold dark:text-white mb-3">
              No Products Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
              We couldn't find any products matching your criteria. Check back
              soon for new arrivals!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg 
                hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProductsList;
