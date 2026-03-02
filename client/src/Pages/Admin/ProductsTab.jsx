import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Search,
  Trash2,
  Package,
  Eye,
  Loader2,
  LayoutGrid,
  List,
  Filter,
  X,
  Tag,
  Calendar,
  Store,
} from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Badge } from "../../Components/ui/badge";

export const ProductsTab = ({ products, setProductToDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // State for the View Details Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- INFINITE SCROLL STATE ---
  const [visibleCount, setVisibleCount] = useState(10);
  const itemsPerPage = 10;
  const observer = useRef();

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts = products.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      p.name?.toLowerCase().includes(searchLower) ||
      p.category?.toLowerCase().includes(searchLower) ||
      p.sellerId?.shopName?.toLowerCase().includes(searchLower) ||
      p.sellerId?.email?.toLowerCase().includes(searchLower);

    const matchesCategory =
      categoryFilter === "All" || p.category === categoryFilter;

    const matchesStock =
      stockFilter === "All"
        ? true
        : stockFilter === "In Stock"
          ? p.stock > 0
          : p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [searchTerm, categoryFilter, stockFilter]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const lastProductElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prevCount) => prevCount + itemsPerPage);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore],
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 relative">
      {/* --- TOP CONTROLS SECTION --- */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 shrink-0">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="text-gray-400 ml-3" size={18} />
          <input
            type="text"
            placeholder="Search by name, category, or seller..."
            className="w-full bg-transparent border-none outline-none text-sm p-1.5 text-gray-900 dark:text-white placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <Filter size={16} className="text-gray-500" />
            <select
              className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 outline-none cursor-pointer w-28 sm:w-auto"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white dark:bg-gray-900 px-3 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <select
              className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 outline-none cursor-pointer w-24 sm:w-auto"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-gray-100 dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-gray-100 dark:bg-gray-800 text-primary shadow-sm"
                  : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- SCROLLABLE PRODUCTS LIST --- */}
      <div className="flex-1 overflow-y-auto pr-1 pb-4 space-y-3 custom-scrollbar">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 mt-4 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No products found
            </h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-3"
            }
          >
            {displayedProducts.map((product, index) => {
              const isLastElement = index === displayedProducts.length - 1;

              return (
                <div
                  ref={isLastElement ? lastProductElementRef : null}
                  key={product._id}
                  className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 group hover:border-primary/40 hover:shadow-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "flex flex-col p-4 gap-4"
                      : "flex flex-col md:flex-row md:items-center justify-between p-4 gap-4"
                  }`}
                >
                  <div
                    className={`flex ${
                      viewMode === "grid" ? "flex-col" : "flex-row items-center"
                    } gap-4 flex-1`}
                  >
                    {/* Product Image */}
                    <div
                      className={`bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-100 dark:border-gray-700 ${
                        viewMode === "grid" ? "w-full h-44" : "h-16 w-16"
                      }`}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Package size={24} className="text-gray-400" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-bold text-gray-900 dark:text-white ${
                          viewMode === "grid" ? "line-clamp-2" : "truncate"
                        }`}
                      >
                        {product.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-sm font-black text-primary">
                          ₹{product.finalPrice || product.price}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.price}
                          </span>
                        )}
                        <span className="text-gray-300 dark:text-gray-600">
                          •
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          Stock:{" "}
                          <strong
                            className={
                              product.stock > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {product.stock}
                          </strong>
                        </span>
                      </div>

                      {/* Seller Info */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate pr-2">
                          <Store size={12} className="text-gray-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">
                            {product.sellerId?.shopName || "Unknown Seller"}
                          </span>
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase tracking-wider py-0.5 shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-none"
                        >
                          {product.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex items-center gap-2 shrink-0 ${
                      viewMode === "grid"
                        ? "w-full border-t border-gray-100 dark:border-gray-800 pt-4 mt-2"
                        : ""
                    }`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProduct(product)}
                      className={`cursor-pointer shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        viewMode === "grid" ? "flex-1" : ""
                      }`}
                    >
                      <Eye
                        size={16}
                        className={viewMode === "grid" ? "mr-2" : ""}
                      />
                      {viewMode === "grid" && "Details"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setProductToDelete(product._id)}
                      className={`cursor-pointer font-semibold shadow-sm flex items-center gap-1.5 ${
                        viewMode === "grid" ? "flex-1" : ""
                      }`}
                    >
                      <Trash2 size={16} />
                      <span
                        className={
                          viewMode === "list" ? "hidden sm:inline" : ""
                        }
                      >
                        Delete
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}

            {hasMore && (
              <div
                className={`flex justify-center py-6 ${
                  viewMode === "grid" ? "col-span-full" : ""
                }`}
              >
                <Loader2 className="animate-spin text-primary" size={28} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- PRODUCT DETAILS MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                Product Details
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Gallery (Just showing main image for now) */}
                <div className="w-full md:w-1/3 shrink-0">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl aspect-square overflow-hidden flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    {selectedProduct.images &&
                    selectedProduct.images.length > 0 ? (
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={48} className="text-gray-400" />
                    )}
                  </div>
                  {/* Status Badges */}
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Status
                      </span>
                      <Badge
                        className={
                          selectedProduct.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {selectedProduct.status || "Active"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        Stock
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {selectedProduct.stock} units
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Pricing
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-black text-primary">
                          ₹{selectedProduct.finalPrice || selectedProduct.price}
                        </span>
                        {selectedProduct.discount > 0 && (
                          <span className="text-xs text-gray-500 line-through mb-1">
                            ₹{selectedProduct.price}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Category & Brand
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedProduct.category}
                      </p>
                      {selectedProduct.brand && (
                        <p className="text-xs text-gray-500">
                          {selectedProduct.brand}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Store size={16} className="text-gray-400" />
                      <span>
                        Sold by:{" "}
                        <strong className="text-gray-900 dark:text-white">
                          {selectedProduct.sellerId?.shopName || "Unknown"}
                        </strong>{" "}
                        ({selectedProduct.sellerId?.email})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar size={16} className="text-gray-400" />
                      <span>
                        Added on:{" "}
                        <strong className="text-gray-900 dark:text-white">
                          {new Date(
                            selectedProduct.createdAt,
                          ).toLocaleDateString()}
                        </strong>
                      </span>
                    </div>
                    {selectedProduct.tags &&
                      selectedProduct.tags.length > 0 && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 pt-1">
                          <Tag
                            size={16}
                            className="text-gray-400 mt-0.5 shrink-0"
                          />
                          <div className="flex flex-wrap gap-1.5">
                            {selectedProduct.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedProduct(null)}
                className="cursor-pointer font-semibold"
              >
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setSelectedProduct(null);
                  setProductToDelete(selectedProduct._id);
                }}
                className="cursor-pointer font-semibold flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
