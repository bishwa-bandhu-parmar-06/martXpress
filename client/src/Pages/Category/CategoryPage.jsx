import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CategorySlider from "./CategorySlider.jsx"; // Import the slider

import {
  Filter,
  Grid,
  List,
  ChevronLeft,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";

// Import your CATEGORY_DATA or use the same structure
import CATEGORY_DATA from "../../CategoriesData/categories.js"; // Assuming you move CATEGORY_DATA to a separate file

const CategoryPage = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedFilters, setSelectedFilters] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.categorySlug]);

  // Extract category from URL params or location state
  useEffect(() => {
    const categorySlug = params.categorySlug;
    let categoryKey = "";

    // Convert slug back to category name
    if (categorySlug) {
      categoryKey = categorySlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Handle special cases like "tv-appliances" to "TV & Appliances"
      if (categorySlug.includes("tv")) {
        categoryKey = "TV & Appliances";
      }
    }

    // Check if we have state from navigation
    if (location.state?.categoryName) {
      categoryKey = location.state.categoryName;
      setCategoryData(location.state.categoryData);
    }

    // If not in state, get from CATEGORY_DATA
    if (!categoryData && categoryKey && CATEGORY_DATA[categoryKey]) {
      setCategoryData(CATEGORY_DATA[categoryKey]);
    }

    setCategoryName(categoryKey || "Category");

    // Set products
    if (categoryData?.products) {
      setProducts(categoryData.products);
    }
  }, [params.categorySlug, location.state, categoryData]);

  // Sort products based on selected option
  const sortProducts = (productsArray) => {
    const sorted = [...productsArray];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "popular":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "newest":
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  };

  // Filter products based on selected filters
  const filterProducts = (productsArray) => {
    let filtered = [...productsArray];

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Add more filters as needed
    if (selectedFilters.rating) {
      filtered = filtered.filter(
        (product) => product.rating >= selectedFilters.rating
      );
    }

    return filtered;
  };

  const sortedAndFilteredProducts = sortProducts(filterProducts(products));

  const handleProductClick = (productId) => {
  const product = products.find(p => p.id === productId);
  
  if (product) {
    navigate(`/product/${productId}`, {
      state: {
        productData: {
          ...product,
          category: categoryName,
        }
      }
    });
  }
};

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    // Add to cart logic
    console.log("Added to cart:", productId);
  };

  const handleQuickView = (productId, e) => {
    e.stopPropagation();
    // Quick view logic
    console.log("Quick view:", productId);
  };

  const colorClass =
    categoryData?.color?.replace("linear", "gradient") ||
    "from-primary to-primary/80";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Slider */}
      {categoryData && (
        <div className="mb-12">
          <CategorySlider
            categoryData={categoryData}
            categoryName={categoryName}
          />
        </div>
      )}
      {/* Category Header */}

      <div
        className={`sticky top-0 z-10 bg-linear-to-r ${colorClass} text-white`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold">{categoryName}</h1>
                <p className="text-white/80 mt-1">
                  {sortedAndFilteredProducts.length} products available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <Truck size={16} />
                <span>Free Delivery</span>
                <Shield size={16} className="ml-4" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Filter size={16} />
              <span>Filters</span>
            </button>

            {/* Price Range Filter */}
            <div className="hidden md:block">
              <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                Price: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], parseInt(e.target.value)])
                }
                className="w-32"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedAndFilteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => handleQuickView(product.id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <RefreshCw size={18} />
                  </button>
                  {product.discount && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= (product.rating || 4)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({product.reviews || 24})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-500 dark:text-gray-400 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product.id, e)}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Free Delivery</span>
                    <span>In Stock</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {sortedAndFilteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                <div className="flex">
                  <div className="w-1/3 md:w-1/4 relative">
                    <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  <div className="w-2/3 md:w-3/4 p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`${
                                star <= (product.rating || 4)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            ({product.reviews || 24} reviews)
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {product.description ||
                            "High-quality product with premium features and excellent durability."}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Truck size={14} /> Free Delivery
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield size={14} /> 1 Year Warranty
                          </span>
                          <span>7 Days Return</span>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:ml-6 text-right">
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <div className="text-gray-500 dark:text-gray-400 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleAddToCart(product.id, e)}
                          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300 w-full md:w-auto"
                        >
                          Add to Cart
                        </button>

                        <button
                          onClick={(e) => handleQuickView(product.id, e)}
                          className="mt-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-300 w-full md:w-auto"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Products Found */}
        {sortedAndFilteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or browse other categories
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300"
            >
              Browse Categories
            </button>
          </div>
        )}

        {/* Pagination (optional) */}
        {sortedAndFilteredProducts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                Previous
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 rounded-lg ${
                    page === 1
                      ? "bg-primary text-white"
                      : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
