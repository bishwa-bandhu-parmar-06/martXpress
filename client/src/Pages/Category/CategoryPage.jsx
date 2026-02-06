import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CategorySlider from "./CategorySlider";
import {
  Filter,
  Grid,
  List,
  ChevronLeft,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Loader,
  X,
} from "lucide-react";
import { productService } from "@/API/ProductsApi/productsAPI";

const CategoryPage = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Store ALL fetched products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedFilters, setSelectedFilters] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);

  const productsPerPage = 10;

  // Scroll to top when component mounts or page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Initialize category from URL or state
  useEffect(() => {
    const slug = params.categorySlug;
    setCategorySlug(slug);
    setError(null);

    let categoryKey = "";

    // Convert slug back to category name
    if (slug) {
      categoryKey = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Handle special cases
      if (slug.includes("tv-appliances") || slug.includes("tv-&-appliances")) {
        categoryKey = "TV & Appliances";
      }
      if (
        slug.includes("mobiles-tablets") ||
        slug.includes("mobiles-&-tablets")
      ) {
        categoryKey = "Mobiles & Tablets";
      }
      if (
        slug.includes("beauty-personal-care") ||
        slug.includes("beauty-&-personal-care")
      ) {
        categoryKey = "Beauty & Personal Care";
      }
      if (
        slug.includes("home-furniture") ||
        slug.includes("home-&-furniture")
      ) {
        categoryKey = "Home & Furniture";
      }
    }

    // Check if we have state from navigation
    if (location.state?.categoryName) {
      categoryKey = location.state.categoryName;
    }

    setCategoryName(categoryKey);

    // Reset states
    setCurrentPage(1);
    setAllProducts([]);
    setFeaturedProducts([]);
    setLoading(true);

    // Fetch products if we have category name
    if (categoryKey) {
      fetchAllCategoryProducts(categoryKey);
    } else {
      setLoading(false);
    }
  }, [params.categorySlug, location.state]);

  // Fetch ALL products for the category (not just one page)
  const fetchAllCategoryProducts = useCallback(async (category) => {
    try {
      setLoading(true);
      setError(null);

      // console.log(`Fetching ALL products for category: ${category}`);

      // First, get the total count
      const firstPageResponse = await productService.getProductsByCategory(
        category,
        1,
        productsPerPage,
      );

      if (firstPageResponse.success) {
        const total = firstPageResponse.total || 0;
        const totalPages = firstPageResponse.totalPages || 1;
        
        setTotalProducts(total);
        setTotalPages(totalPages);

        // If there are multiple pages, fetch them all
        if (totalPages > 1) {
          const allPromises = [];
          
          // Start from page 1 (we already have it)
          allPromises.push(Promise.resolve(firstPageResponse));
          
          // Fetch remaining pages
          for (let page = 2; page <= totalPages; page++) {
            allPromises.push(
              productService.getProductsByCategory(
                category,
                page,
                productsPerPage,
              )
            );
          }

          const allResponses = await Promise.all(allPromises);
          const allProducts = allResponses.flatMap(response => response.data || []);
          
          setAllProducts(allProducts);
          
          // Extract featured products
          const featured = allProducts
            .filter(
              (product) =>
                product.images &&
                product.images.length > 0 &&
                (product.featured || (product.averageRating || 0) >= 4)
            )
            .sort((a, b) => {
              if (a.featured !== b.featured) {
                return b.featured ? 1 : -1;
              }
              const ratingDiff =
                (b.averageRating || 0) - (a.averageRating || 0);
              if (ratingDiff !== 0) return ratingDiff;
              return (b.discount || 0) - (a.discount || 0);
            })
            .slice(0, 4);

          setFeaturedProducts(featured);
        } else {
          // Only one page
          setAllProducts(firstPageResponse.data || []);
          
          // Extract featured products
          const featured = (firstPageResponse.data || [])
            .filter(
              (product) =>
                product.images &&
                product.images.length > 0 &&
                (product.featured || (product.averageRating || 0) >= 4)
            )
            .sort((a, b) => {
              if (a.featured !== b.featured) {
                return b.featured ? 1 : -1;
              }
              const ratingDiff =
                (b.averageRating || 0) - (a.averageRating || 0);
              if (ratingDiff !== 0) return ratingDiff;
              return (b.discount || 0) - (a.discount || 0);
            })
            .slice(0, 4);

          setFeaturedProducts(featured);
        }
      } else {
        setError(firstPageResponse.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load products. Please try again.",
      );
    } finally {
      setLoading(false);
      setLoadingPage(false);
    }
  }, [productsPerPage]);

  // Filter and sort ALL products
  const getFilteredAndSortedProducts = useCallback(() => {
    let filtered = [...allProducts];

    // Price filter
    filtered = filtered.filter((product) => {
      const price = product.finalPrice || product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (selectedFilters.minRating) {
      filtered = filtered.filter(
        (product) => (product.averageRating || 0) >= selectedFilters.minRating,
      );
    }

    // Discount filter
    if (selectedFilters.minDiscount) {
      filtered = filtered.filter(
        (product) => (product.discount || 0) >= selectedFilters.minDiscount,
      );
    }

    // In stock filter
    if (selectedFilters.inStockOnly) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    // Sort the filtered results
    switch (sortBy) {
      case "price-low":
        return filtered.sort(
          (a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price),
        );
      case "price-high":
        return filtered.sort(
          (a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price),
        );
      case "rating":
        return filtered.sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0),
        );
      case "newest":
        return filtered.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
      case "discount":
        return filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default: // featured
        return filtered.sort(
          (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
        );
    }
  }, [allProducts, priceRange, selectedFilters, sortBy]);

  // Get products for current page
  const getCurrentPageProducts = () => {
    const filteredProducts = getFilteredAndSortedProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Calculate filtered total and pages
  const getFilteredPaginationInfo = () => {
    const filteredProducts = getFilteredAndSortedProducts();
    const filteredTotal = filteredProducts.length;
    const filteredTotalPages = Math.ceil(filteredTotal / productsPerPage);
    
    return {
      filteredTotal,
      filteredTotalPages,
      showingProducts: filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      ).length
    };
  };

  const { filteredTotal, filteredTotalPages, showingProducts } = getFilteredPaginationInfo();
  const currentPageProducts = getCurrentPageProducts();

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (
      pageNumber !== currentPage &&
      pageNumber >= 1 &&
      pageNumber <= filteredTotalPages
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const handleProductClick = (productId) => {
    const product = allProducts.find((p) => p._id === productId);

    if (product) {
      navigate(`/product/${productId}`, {
        state: {
          productData: {
            ...product,
            category: categoryName,
          },
        },
      });
    }
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation();
    console.log("Added to cart:", productId);
    // Add your cart logic here
  };

  const handleQuickView = (productId, e) => {
    e.stopPropagation();
    console.log("Quick view:", productId);
    // Add quick view logic here
  };

  // Category style mapping
  const CATEGORY_STYLE_MAP = {
    Fashion: {
      color: "from-pink-500 to-rose-500",
      bgColor:
        "bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    },
    Electronics: {
      color: "from-blue-500 to-indigo-500",
      bgColor:
        "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    },
    "TV & Appliances": {
      color: "from-purple-500 to-violet-500",
      bgColor:
        "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
    },
    "Mobiles & Tablets": {
      color: "from-cyan-500 to-blue-500",
      bgColor:
        "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
    },
    "Home & Furniture": {
      color: "from-emerald-500 to-teal-500",
      bgColor:
        "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    },
    "Beauty & Personal Care": {
      color: "from-rose-500 to-pink-500",
      bgColor:
        "bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
    },
    Grocery: {
      color: "from-green-500 to-emerald-500",
      bgColor:
        "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    },
  };

  const style = CATEGORY_STYLE_MAP[categoryName] || {
    color: "from-primary to-primary/80",
    bgColor:
      "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 100000]);
    setSelectedFilters({});
    setSortBy("featured");
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  // Add a filter
  const addFilter = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when new filter is applied
  };

  // Remove a filter
  const removeFilter = (key) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1); // Reset to first page when filter is removed
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setPriceRange([priceRange[0], value]);
    setCurrentPage(1); // Reset to first page when price range changes
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (!price) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("₹", "₹");
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(filteredTotalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 rounded-lg ${
            1 === currentPage
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(
          <span key="ellipsis1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg ${
            i === currentPage
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < filteredTotalPages) {
      if (endPage < filteredTotalPages - 1) {
        buttons.push(
          <span key="ellipsis2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      
      buttons.push(
        <button
          key={filteredTotalPages}
          onClick={() => handlePageChange(filteredTotalPages)}
          className={`px-3 py-1 rounded-lg ${
            filteredTotalPages === currentPage
              ? "bg-primary text-white"
              : "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {filteredTotalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Header */}
      <div
        className={`sticky top-0 z-40 ${style.bgColor} border-b border-gray-200 dark:border-gray-800`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {categoryName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {loading
                    ? "Loading..."
                    : `${totalProducts} products available`}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Truck size={16} />
                <span>Free Delivery</span>
                <Shield size={16} className="ml-4" />
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Slider (only show if we have featured products) */}
      {!loading && featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CategorySlider
            categoryData={{ products: featuredProducts }}
            categoryName={categoryName}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Error Loading Products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300"
            >
              Go to Homepage
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin h-12 w-12 text-primary" />
          </div>
        ) : (
          <>
            {/* Active Filters Display */}
            {Object.keys(selectedFilters).length > 0 && (
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active Filters:
                  </span>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.minRating && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                      Rating: {selectedFilters.minRating}★ & above
                      <button
                        onClick={() => removeFilter("minRating")}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedFilters.minDiscount && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                      Discount: {selectedFilters.minDiscount}% & above
                      <button
                        onClick={() => removeFilter("minDiscount")}
                        className="ml-1 hover:text-green-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedFilters.inStockOnly && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-full text-sm">
                      In Stock Only
                      <button
                        onClick={() => removeFilter("inStockOnly")}
                        className="ml-1 hover:text-emerald-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Filters and Sort Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Price Range:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(parseInt(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[120px]">
                    ₹0 - ₹{priceRange[1].toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Min Rating:
                  </span>
                  <select
                    value={selectedFilters.minRating || ""}
                    onChange={(e) =>
                      addFilter(
                        "minRating",
                        e.target.value ? parseInt(e.target.value) : null,
                      )
                    }
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                  >
                    <option value="">Any</option>
                    <option value="4">4★ & above</option>
                    <option value="3">3★ & above</option>
                    <option value="2">2★ & above</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.inStockOnly || false}
                      onChange={(e) =>
                        addFilter("inStockOnly", e.target.checked)
                      }
                      className="rounded"
                    />
                    In Stock Only
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="discount">Best Discount</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    title="Grid View"
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list"
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    title="List View"
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Count and Page Info */}
            {currentPageProducts.length > 0 && (
              <div className="mb-6 text-gray-600 dark:text-gray-400">
                <div>
                  Showing {showingProducts} of {filteredTotal} products
                  {filteredTotal !== totalProducts && (
                    <span className="ml-1 text-sm">
                      (filtered from {totalProducts} total)
                    </span>
                  )}
                </div>
                <div className="text-sm mt-1">
                  Page {currentPage} of {filteredTotalPages}
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            {currentPageProducts.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentPageProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onClick={() => handleProductClick(product._id)}
                        onAddToCart={(e) => handleAddToCart(product._id, e)}
                        onQuickView={(e) => handleQuickView(product._id, e)}
                        viewMode="grid"
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentPageProducts.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onClick={() => handleProductClick(product._id)}
                        onAddToCart={(e) => handleAddToCart(product._id, e)}
                        onQuickView={(e) => handleQuickView(product._id, e)}
                        viewMode="list"
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                {filteredTotalPages > 1 && (
                  <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {filteredTotalPages} • {filteredTotal} filtered products
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {renderPaginationButtons()}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === filteredTotalPages}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Showing {productsPerPage} products per page
                    </div>
                  </div>
                )}
              </>
            ) : (
              !loading && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {Object.keys(selectedFilters).length > 0 ||
                    priceRange[1] < 100000
                      ? "Try adjusting your filters"
                      : "No products available in this category"}
                  </p>
                  <div className="flex justify-center gap-4">
                    {(Object.keys(selectedFilters).length > 0 ||
                      priceRange[1] < 100000) && (
                      <button
                        onClick={resetFilters}
                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-300"
                      >
                        Clear Filters
                      </button>
                    )}
                    <button
                      onClick={() => navigate("/")}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300"
                    >
                      Browse Categories
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Product Card Component (keep the same as before)
const ProductCard = ({
  product,
  onClick,
  onAddToCart,
  onQuickView,
  viewMode,
  formatPrice,
}) => {
  const productPrice = product.finalPrice || product.price || 0;
  const originalPrice = product.discount > 0 ? product.price : null;

  if (viewMode === "grid") {
    return (
      <div
        onClick={onClick}
        className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 h-full flex flex-col"
      >
        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
          />
          <button
            onClick={onQuickView}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          >
            <RefreshCw size={18} />
          </button>
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full z-10">
              -{product.discount}%
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
          {product.featured && (
            <span className="absolute bottom-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
              Featured
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-2">
            {product.brand && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {product.brand}
              </span>
            )}
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(product.averageRating || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({product.totalRatings || 0})
            </span>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(productPrice)}
                </span>
                {originalPrice && (
                  <span className="text-gray-500 dark:text-gray-400 line-through ml-2 text-sm">
                    {formatPrice(originalPrice)}
                  </span>
                )}
              </div>
              {product.discount > 0 && (
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <button
              onClick={onAddToCart}
              disabled={product.stock <= 0}
              className=" cursor-pointer w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 relative">
          <div className="h-48 md:h-full overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img
              src={product.images?.[0] || "/placeholder.jpg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = "/placeholder.jpg";
              }}
            />
          </div>
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.featured && (
            <span className="absolute bottom-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
              Featured
            </span>
          )}
        </div>

        <div className="md:w-3/4 p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between h-full">
            <div className="flex-1">
              <div className="mb-2">
                {product.brand && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {product.brand}
                  </span>
                )}
                <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                  {product.name}
                </h3>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < Math.floor(product.averageRating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({product.totalRatings || 0} reviews)
                </span>
                <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                  Stock: {product.stock || 0}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {product.description ||
                  "High-quality product with premium features."}
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

            <div className="mt-4 md:mt-0 md:ml-6 text-right flex flex-col justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(productPrice)}
                </div>
                {originalPrice && (
                  <div className="text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(originalPrice)}
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                    Save {product.discount}%
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={onAddToCart}
                  disabled={product.stock <= 0}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={onQuickView}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-300"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;