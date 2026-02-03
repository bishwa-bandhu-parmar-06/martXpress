import {
  getAllProductsOfLoggedInSeller,
  deleteProductsForLoggedInSeller,
} from "../../../API/ProductsApi/productsAPI.js";
import React, { useEffect, useState, useMemo } from "react";
import {
  Package,
  Edit,
  Trash2,
  Eye,
  Star,
  Search,
  Grid,
  List,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  DollarSign,
  Hash,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AddProduct from "./AddProduct.jsx";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Add these new states for server-side pagination
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  // Fetch products with pagination
  const getAllProducts = async (page = currentPage, limit = itemsPerPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllProductsOfLoggedInSeller(page, limit);
      const productsData = Array.isArray(response.products)
        ? response.products
        : [];
      setProducts(productsData);
      
      // Set server-side pagination data
      if (response.pagination) {
        setTotalProducts(response.pagination.totalProducts);
        setTotalPages(response.pagination.totalPages);
        setHasNextPage(response.pagination.hasNextPage);
        setHasPrevPage(response.pagination.hasPrevPage);
        setCurrentPage(response.pagination.page);
      }

      // Calculate stats from the fetched products
      calculateStats(productsData);
    } catch (error) {
      console.error("Error While Getting Products:", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Update API call when page or itemsPerPage changes
  useEffect(() => {
    getAllProducts(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Client-side filtering and sorting (only for the current page)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      result = result.filter((product) => product.status === selectedStatus);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.finalPrice || 0) - (a.finalPrice || 0));
        break;
      case "price-low":
        result.sort((a, b) => (a.finalPrice || 0) - (b.finalPrice || 0));
        break;
      case "stock-high":
        result.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      case "stock-low":
        result.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        break;
      case "name-asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name-desc":
        result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  // When filters change, we need to fetch from server with new filters
  // For now, we'll do client-side filtering on the current page
  // For production, you might want to modify your API to accept filters
  
  // Calculate statistics
  const calculateStats = (productsData) => {
    const totalProducts = productsData.length;
    const activeProducts = productsData.filter(
      (p) => p.status === "active",
    ).length;
    const outOfStock = productsData.filter(
      (p) => p.status === "out of stock",
    ).length;
    const totalValue = productsData.reduce(
      (sum, p) => sum + (p.finalPrice || 0) * (p.stock || 0),
      0,
    );

    setStats({
      totalProducts,
      activeProducts,
      outOfStock,
      totalValue,
    });
  };

  // Get all unique categories from products (for dropdown)
  const categories = useMemo(() => {
    const cats = ["all"];
    products.forEach((p) => {
      if (p.category && !cats.includes(p.category)) {
        cats.push(p.category);
      }
    });
    return cats;
  }, [products]);

  const statusOptions = ["all", "active", "inactive", "out of stock"];

  // Handle product delete
  const handleDeleteProduct = async (productId) => {
    setDeleteLoading(true);
    try {
      console.log("Product Id : ", productId);
      await deleteProductsForLoggedInSeller(productId);
      await getAllProducts(currentPage, itemsPerPage); // Refresh the list with current page
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle bulk selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProducts.length} product(s)?`)) return;
    
    setDeleteLoading(true);
    try {
      await Promise.all(
        selectedProducts.map((id) => deleteProductsForLoggedInSeller(id))
      );
      await getAllProducts(currentPage, itemsPerPage);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
      setError("Failed to delete selected products.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calculate pagination display info
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalProducts);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        text: "Active",
        bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: CheckCircle,
      },
      inactive: {
        text: "Inactive",
        bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: XCircle,
      },
      "out of stock": {
        text: "Out of Stock",
        bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status] || {
      text: status,
      bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: AlertCircle,
    };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg}`}
      >
        <Icon className="h-3 w-3" />
        {config.text}
      </span>
    );
  };

  // Featured badge
  const FeaturedBadge = ({ featured }) => {
    if (!featured) return null;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs font-medium">
        <Star className="h-3 w-3 fill-current" />
        Featured
      </span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              My Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 md:mt-2 text-sm md:text-base">
              Manage all your products in one place. Total {totalProducts}{" "}
              products listed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => getAllProducts(currentPage, itemsPerPage)}
              className="px-3 py-2 cursor-pointer bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2.5 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
          {[
            {
              label: "Total Products",
              value: totalProducts,
              icon: Package,
              color: "indigo",
            },
            {
              label: "Active Products",
              value: stats.activeProducts,
              icon: CheckCircle,
              color: "green",
            },
            {
              label: "Out of Stock",
              value: stats.outOfStock,
              icon: AlertCircle,
              color: "red",
            },
            {
              label: "Inventory Value",
              value: `₹${stats.totalValue.toLocaleString()}`,
              icon: DollarSign,
              color: "purple",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 md:p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p
                    className={`text-xl md:text-2xl font-bold mt-1 ${
                      stat.color === "green"
                        ? "text-green-600 dark:text-green-400"
                        : stat.color === "red"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="all">All Categories</option>
              {categories
                .filter((cat) => cat !== "all")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="cursor-pointer flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${viewMode === "grid" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 ${viewMode === "list" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Items per page and Sort By */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                const newLimit = Number(e.target.value);
                setItemsPerPage(newLimit);
                setCurrentPage(1); // Reset to first page when changing limit
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="stock-high">Stock: High to Low</option>
            <option value="stock-low">Stock: Low to High</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* Selected products actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === filteredProducts.length}
                  onChange={selectAllProducts}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  {selectedProducts.length} product(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Bulk edit feature coming soon!")}
                  className="px-3 py-1.5 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50"
                >
                  Bulk Edit
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={deleteLoading}
                  className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 flex items-center gap-1"
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700"></div>
                      Deleting...
                    </>
                  ) : (
                    "Bulk Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Products Grid/List View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200 group"
            >
              {/* Image Section */}
              <div className="relative h-40 sm:h-48 bg-gray-100 dark:bg-gray-700">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                    className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                  />
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <FeaturedBadge featured={product.featured} />
                  <StatusBadge status={product.status} />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 md:p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate flex-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 min-h-[2.5rem]">
                  {product.description || "No description"}
                </p>

                <div className="flex items-center gap-1 mb-3 flex-wrap">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded mb-1">
                    {product.category || "Uncategorized"}
                  </span>
                  {product.brand && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded mb-1">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-baseline gap-1 md:gap-2">
                      <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                        ₹{product.finalPrice?.toLocaleString() || "0"}
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-xs line-through text-gray-500 dark:text-gray-400">
                            ₹{product.price?.toLocaleString()}
                          </span>
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                            {product.discount}% off
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Stock: <span className="font-medium">{product.stock || 0}</span> units
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer flex-1 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1 text-xs">
                    <Eye className="h-3 w-3" />
                    View
                  </button>
                  <button className="cursor-pointer flex-1 px-2 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex items-center justify-center gap-1 text-xs">
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setProductToDelete(product);
                      setShowDeleteModal(true);
                    }}
                    className="cursor-pointer flex-1 px-2 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-1 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={selectAllProducts}
                      className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleProductSelection(product._id)}
                        className="h-4 w-4 text-indigo-600 rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {product.name}
                            </p>
                            {product.featured && (
                              <Star className="h-3 w-3 text-yellow-400 fill-current flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {product.brand || "No brand"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{product.finalPrice?.toLocaleString() || "0"}
                        </p>
                        {product.discount > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            ₹{product.price?.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${(product.stock || 0) < 10 ? "text-yellow-600 dark:text-yellow-400" : "text-gray-900 dark:text-white"}`}>
                          {product.stock || 0}
                        </span>
                        {(product.stock || 0) < 10 && (
                          <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="cursor-pointer p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="cursor-pointer p-1.5 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                          className="cursor-pointer p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination - Now using server-side pagination */}
      {totalProducts > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{startIndex}</span> to{" "}
            <span className="font-medium">{endIndex}</span>{" "}
            of <span className="font-medium">{totalProducts}</span>{" "}
            products
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!hasPrevPage}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 border rounded-lg text-sm ${
                    currentPage === pageNum
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-500 dark:text-gray-400">
                  ...
                </span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={!hasNextPage}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* No Products Message */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm ||
            selectedCategory !== "all" ||
            selectedStatus !== "all"
              ? "Try adjusting your filters or search terms"
              : "You haven't added any products yet"}
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            Add Your First Product
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Product
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  "{productToDelete.name}"
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="cursor-pointer px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex-1"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(productToDelete._id)}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 flex-1"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddProduct isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AllProducts;