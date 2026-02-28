import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CategorySlider from "./CategorySlider";
import {
  Grid,
  List,
  ChevronLeft,
  Star,
  ChevronRight,
  Loader,
  Zap,
  ShoppingBag,
  Heart, // Added Heart
} from "lucide-react";
import { toast } from "sonner";
import { productService } from "@/API/ProductsApi/productsAPI";
import { addProductToCart } from "../../API/Cart/getAllCartProductApi.js";
import { setCartQuantity } from "../../Features/Cart/CartSlice.js";
// API and Redux actions for Wishlist
import {
  addProductToWishList,
  removeASingleWishlistProduct,
} from "../../API/Cart/wishListApi.js";
import {
  addToWishlistRedux,
  removeFromWishlistRedux,
} from "../../Features/Cart/WishlistSlice.js";

const CategoryPage = () => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get wishlist state for global heart sync
  const wishlistedIds = useSelector((state) => state.wishlist.wishlistItems);

  const [categoryName, setCategoryName] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [actionLoading, setActionLoading] = useState(null); // Track wishlist/cart actions

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);

  const productsPerPage = 10;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const slug = params.categorySlug;
    setError(null);
    let categoryKey = "";

    if (slug) {
      categoryKey = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      // Handle special naming cases
      if (slug.includes("tv-appliances")) categoryKey = "TV & Appliances";
      if (slug.includes("mobiles-tablets")) categoryKey = "Mobiles & Tablets";
    }

    if (location.state?.categoryName) categoryKey = location.state.categoryName;

    setCategoryName(categoryKey);
    setCurrentPage(1);
    setAllProducts([]);
    setLoading(true);

    if (categoryKey) fetchAllCategoryProducts(categoryKey);
    else setLoading(false);
  }, [params.categorySlug, location.state]);

  const fetchAllCategoryProducts = useCallback(async (category) => {
    try {
      setLoading(true);
      const res = await productService.getProductsByCategory(
        category,
        1,
        productsPerPage,
      );
      if (res.success) {
        setTotalProducts(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setAllProducts(res.data || []);

        const featured = (res.data || [])
          .filter((p) => p.featured || (p.averageRating || 0) >= 4)
          .slice(0, 4);
        setFeaturedProducts(featured);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- WISHLIST TOGGLE ---
  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();
    const isCurrentlyWishlisted = wishlistedIds.includes(productId);

    try {
      setActionLoading(productId);
      if (isCurrentlyWishlisted) {
        const response = await removeASingleWishlistProduct(productId);
        if (response?.success) {
          dispatch(removeFromWishlistRedux(productId));
          toast.info("Removed from wishlist");
        }
      } else {
        const response = await addProductToWishList(productId);
        if (response?.success || response?.message === "Added to wishlist") {
          dispatch(addToWishlistRedux(productId));
          toast.success("Added to wishlist ❤️");
        }
      }
    } catch (error) {
      toast.error("Action failed. Please login.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToCart = async (productId, e) => {
    e.stopPropagation();
    const product = allProducts.find((p) => p._id === productId);
    if (!product || product.stock <= 0) return toast.error("Out of stock");

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      const response = await addProductToCart({ productId, quantity: 1 });
      if (response?.success) {
        dispatch(setCartQuantity(response.cart.totalQuantity));
        toast.success(`${product.name} added to cart!`);
      }
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleBuyNow = (productId, e) => {
    e.stopPropagation();
    const product = allProducts.find((p) => p._id === productId);
    if (!product || product.stock <= 0) return toast.error("Out of stock");
    navigate("/checkout", {
      state: { buyNowProduct: [{ product, quantity: 1 }] },
    });
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = allProducts.filter(
      (p) => (p.finalPrice || p.price) <= priceRange[1],
    );
    if (sortBy === "price-low")
      filtered.sort(
        (a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price),
      );
    if (sortBy === "price-high")
      filtered.sort(
        (a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price),
      );
    return filtered;
  };

  const currentPageProducts = getFilteredAndSortedProducts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Category Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                {categoryName}
              </h1>
              <p className="text-sm text-gray-500">
                {totalProducts} products available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin h-12 w-12 text-primary" />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    Price: ₹{priceRange[1].toLocaleString()}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-32 cursor-pointer"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow-sm" : ""}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {currentPageProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isWishlisted={wishlistedIds.includes(product._id)}
                  onWishlist={(e) => handleWishlistToggle(e, product._id)}
                  onClick={() => navigate(`/product/${product._id}`)}
                  onAddToCart={(e) => handleAddToCart(product._id, e)}
                  onBuyNow={(e) => handleBuyNow(product._id, e)}
                  viewMode={viewMode}
                  isAdding={addingToCart[product._id]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  isWishlisted,
  onWishlist,
  onClick,
  onAddToCart,
  onBuyNow,
  viewMode,
  isAdding,
}) => {
  const price = product.finalPrice || product.price;

  if (viewMode === "grid") {
    return (
      <div
        onClick={onClick}
        className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer relative flex flex-col h-full"
      >
        <div className="relative h-60 bg-gray-50 dark:bg-gray-900/50 p-4">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
          />

          <button
            onClick={onWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-700/90 rounded-full shadow-sm z-10 transition-all hover:scale-110"
          >
            <Heart
              size={18}
              fill={isWishlisted ? "#ef4444" : "none"}
              className={isWishlisted ? "text-red-500" : "text-gray-400"}
            />
          </button>

          {product.discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg">
              -{product.discount}%
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col grow">
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 h-12">
            {product.name}
          </h3>
          <div className="mt-auto">
            <div className="text-xl font-bold mb-4">
              ₹{price.toLocaleString()}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onAddToCart}
                disabled={isAdding || product.stock <= 0}
                className="flex items-center justify-center gap-1 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-xs font-bold disabled:opacity-50"
              >
                <ShoppingBag size={14} /> {isAdding ? "..." : "Cart"}
              </button>
              <button
                onClick={onBuyNow}
                disabled={product.stock <= 0}
                className="flex items-center justify-center gap-1 py-2.5 bg-primary text-white rounded-xl text-xs font-bold"
              >
                <Zap size={14} /> Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View remains similar but styled for full width
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-4 flex gap-6 cursor-pointer hover:shadow-lg transition-all relative"
    >
      <div className="w-48 h-48 bg-gray-50 dark:bg-gray-900/50 rounded-xl overflow-hidden shrink-0">
        <img
          src={product.images?.[0] || "/placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
      </div>
      <div className="flex flex-col justify-between grow">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold dark:text-white mb-2">
              {product.name}
            </h3>
            <button
              onClick={onWishlist}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Heart
                size={20}
                fill={isCurrentlyWishlisted ? "#ef4444" : "none"}
                className={
                  isCurrentlyWishlisted ? "text-red-500" : "text-gray-400"
                }
              />
            </button>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-2xl font-bold dark:text-white">
            ₹{price.toLocaleString()}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onAddToCart}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl font-bold text-sm"
            >
              Add to Cart
            </button>
            <button
              onClick={onBuyNow}
              className="px-6 py-2 bg-primary text-white rounded-xl font-bold text-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
