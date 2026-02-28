import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Trash2,
  ShoppingBag,
  Ghost,
  Loader2,
  Zap,
  Eye,
  X as CloseIcon,
  ChevronRight,
} from "lucide-react";

import {
  getAllWishlistProducts,
  removeASingleWishlistProduct,
  removeAllWishlistProducts,
} from "../API/Cart/wishListApi";
import { addProductToCart } from "../API/Cart/getAllCartProductApi";

import {
  setWishlist,
  removeFromWishlistRedux,
} from "../Features/Cart/WishlistSlice";
import { setCartQuantity } from "../Features/Cart/CartSlice.js";

const WishlistPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated  = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to view your wishlist");
      navigate("/users/auth");
      return;
    }
    window.scrollTo(0, 0);
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getAllWishlistProducts();
      if (res?.success) {
        setItems(res.items || []);
        dispatch(setWishlist(res.items));
      }
    } catch (err) {
      toast.error("Failed to load wishlist products");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, productId) => {
    // Stop the click from navigating to product details page
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      setActionLoading(productId);
      const res = await removeASingleWishlistProduct(productId);
      if (res?.success) {
        // Update local state immediately for snappy UI
        setItems((prev) =>
          prev.filter((item) => item.productId?._id !== productId),
        );
        // Update Redux state
        dispatch(removeFromWishlistRedux(productId));
        toast.info("Removed from wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation(); // Stop navigation
    if (product.stock <= 0) {
      toast.error("Product is currently out of stock");
      return;
    }

    try {
      setActionLoading(product._id);
      const res = await addProductToCart({
        productId: product._id,
        quantity: 1,
      });
      if (res?.success) {
        dispatch(setCartQuantity(res.cart.totalQuantity));
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }

    // Redirect to checkout with product data in location state
    navigate("/checkout", {
      state: {
        buyNowProduct: [
          {
            product: product,
            quantity: 1,
            color: product.colors?.[0] || null,
            size: product.sizes?.[0] || null,
          },
        ],
      },
    });
  };

  const handleClearAll = async () => {
    try {
      setLoading(true);
      const res = await removeAllWishlistProducts();
      if (res?.success) {
        setItems([]);
        dispatch(setWishlist([]));
        toast.success("Wishlist cleared successfully");
      }
    } catch (err) {
      toast.error("Failed to clear wishlist");
    } finally {
      setLoading(false);
    }
  };

  // Loading State UI
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">
          Fetching your favorites...
        </p>
      </div>
    );
  }

  // Empty Wishlist UI
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Ghost size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">
          Looks like you haven't saved anything yet. Explore our products and
          tap the heart icon to save items here!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              My Wishlist{" "}
              <span className="text-gray-400 text-lg font-normal">
                ({items.length} items)
              </span>
            </h1>
            <nav className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight size={14} />
              <span className="text-primary font-semibold">Wishlist</span>
            </nav>
          </div>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors cursor-pointer p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.productId;
            if (!product) return null; // Guard clause for deleted products

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 cursor-pointer flex flex-col relative h-full"
              >
                {/* Image Section */}
                <div className="relative h-60 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center p-6 shrink-0">
                  <img
                    src={product.images?.[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Close/Remove Button */}
                  <button
                    onClick={(e) => handleRemove(e, product._id)}
                    disabled={actionLoading === product._id}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-700/90 rounded-full text-gray-500 hover:text-red-500 shadow-md border border-gray-100 dark:border-gray-600 transition-all z-30 cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading === product._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CloseIcon size={16} />
                    )}
                  </button>

                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10">
                    <span className="bg-white/95 dark:bg-gray-800 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <Eye size={16} className="text-primary" />
                      View Details
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-5 flex flex-col grow">
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {product.brand || "martXpress"}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 mt-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{product.finalPrice?.toLocaleString()}
                    </span>
                    {product.price > product.finalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock Indicator */}
                  <div className="mb-6">
                    {product.stock > 0 ? (
                      <span className="text-[10px] text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        In Stock
                      </span>
                    ) : (
                      <span className="text-[10px] text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={
                        product.stock <= 0 || actionLoading === product._id
                      }
                      className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer text-sm"
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(e, product)}
                      disabled={product.stock <= 0}
                      className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95 cursor-pointer text-sm"
                    >
                      <Zap size={18} fill="currentColor" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
