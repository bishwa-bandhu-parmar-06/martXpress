import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // <-- Ensure useSelector is imported
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  Image as ImageIcon,
  Truck,
  RotateCcw,
  ShieldCheck,
  Loader2,
} from "lucide-react";

// API Imports
import { getSingleProductDetails } from "@/API/ProductsApi/productsAPI";
import { addProductToCart, getCart } from "../API/Cart/getAllCartProductApi.js";
import {
  addProductToWishList,
  removeASingleWishlistProduct,
} from "../API/Cart/wishListApi.js";

// Redux Actions
import { setCartQuantity } from "../Features/Cart/CartSlice.js";
import {
  addToWishlistRedux,
  removeFromWishlistRedux,
} from "../Features/Cart/WishlistSlice";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // --- REDUX STATE ---
  const wishlistedIds = useSelector((state) => state.wishlist.wishlistItems);
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Pull auth state

  // --- LOCAL STATE ---
  const [isInCart, setIsInCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Derive wishlist status from global Redux state
  const isCurrentlyWishlisted = wishlistedIds.includes(productId);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, cartRes] = await Promise.all([
          getSingleProductDetails(productId),
          // Only attempt to fetch cart if they are logged in as a user
          isAuthenticated && user?.role === "user"
            ? getCart()
            : Promise.resolve(null),
        ]);

        if (prodRes && prodRes.status === 200 && prodRes.product) {
          const productData = prodRes.product;
          setProduct(productData);
          setSelectedColor(productData.colors?.[0] || "#000000");
          setSelectedSize(productData.sizes?.[0] || "Standard");

          // Check if item is already in cart
          if (cartRes?.success) {
            const itemExists = cartRes.cart.items.some(
              (item) => item.productId === productId,
            );
            setIsInCart(itemExists);
          }
        } else {
          setError("Product not found");
        }
      } catch (error) {
        setError(error.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId, isAuthenticated, user]);

  // --- INTERCEPTOR LOGIC ---
  const checkAuthAndRole = () => {
    if (!isAuthenticated) {
      toast.error("Please login to perform this action.");
      // Pass the current location so they can redirect back here after login
      navigate("/users/auth", { state: { from: location.pathname } });
      return false;
    }

    if (user?.role !== "user") {
      toast.error(
        `As a ${user.role}, you cannot purchase items. Please use a buyer account.`,
      );
      return false;
    }

    return true; // Passed all checks!
  };

  // --- HANDLERS ---
  const handleAddToCart = async () => {
    if (!checkAuthAndRole()) return; // INTERCEPTED
    if (!product || product.stock <= 0) return;

    if (isInCart) {
      return toast.info("Item is already in your cart!");
    }

    try {
      setAddingToCart(true);
      const response = await addProductToCart({
        productId: product._id,
        quantity,
        color: selectedColor,
        size: selectedSize,
      });

      if (response?.success) {
        toast.success(`${product.name} added to cart!`);
        dispatch(setCartQuantity(response.cart.totalQuantity));
        setIsInCart(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!checkAuthAndRole()) return; // INTERCEPTED

    try {
      if (isCurrentlyWishlisted) {
        const res = await removeASingleWishlistProduct(productId);
        if (res?.success) {
          dispatch(removeFromWishlistRedux(productId));
          toast.info("Removed from wishlist");
        }
      } else {
        const res = await addProductToWishList(productId);
        if (res?.success || res?.message === "Added to wishlist") {
          dispatch(addToWishlistRedux(productId));
          toast.success("Added to wishlist ❤️");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleBuyNow = () => {
    if (!checkAuthAndRole()) return; // INTERCEPTED

    if (!product || product.stock <= 0) {
      toast.error("Product is currently out of stock");
      return;
    }
    navigate("/checkout", {
      state: {
        buyNowProduct: [
          { product, quantity, color: selectedColor, size: selectedSize },
        ],
      },
    });
  };

  // Helper functions (Safe data handling)
  const getSafeImages = () =>
    product?.images?.length > 0
      ? product.images
      : [
          product?.image ||
            "https://placehold.co/800x800?text=No+Image+Available",
        ];
  const images = getSafeImages();

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-xl font-bold dark:text-white">
          {error || "Product not found"}
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Images */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="aspect-square relative group flex items-center justify-center p-4">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImage(
                          (prev) => (prev - 1 + images.length) % images.length,
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft size={20} className="text-gray-800" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={20} className="text-gray-800" />
                    </button>
                  </>
                )}

                {/* WISHLIST HEART BUTTON */}
                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm hover:bg-gray-50 transition-colors z-10"
                >
                  <Heart
                    size={22}
                    fill={isCurrentlyWishlisted ? "#ef4444" : "none"}
                    className={
                      isCurrentlyWishlisted
                        ? "text-red-500"
                        : "text-gray-600 dark:text-gray-300"
                    }
                  />
                </button>

                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-md shadow-sm">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl border-2 transition-all shrink-0 bg-white dark:bg-gray-800 overflow-hidden ${selectedImage === i ? "border-primary" : "border-gray-200 dark:border-gray-700"}`}
                >
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-contain p-1 mix-blend-multiply dark:mix-blend-normal"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="flex flex-col">
            {/* Title & Brand */}
            <span className="text-sm font-bold text-primary tracking-widest uppercase mb-1">
              {product.brand || "Generic"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-full">
                <Star size={16} fill="currentColor" />
                <span className="ml-1.5 text-yellow-700 dark:text-yellow-500 font-bold text-sm">
                  {(product.averageRating || 0).toFixed(1)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-500 underline cursor-pointer hover:text-primary transition-colors">
                {product.totalRatings || 0} Reviews
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-3 mb-8 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm w-fit">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ₹{(product.finalPrice || product.price).toLocaleString("en-IN")}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg font-semibold text-gray-400 line-through mb-1">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400 mb-1.5 ml-1">
                    Inclusive of all taxes
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            <div className="space-y-6 mb-8">
              {product.colors?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        title={c}
                        className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor === c ? "border-primary ring-4 ring-primary/20" : "border-gray-200 dark:border-gray-600 hover:scale-110"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                  Quantity
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-xl transition-colors dark:text-white"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-bold text-lg dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-xl transition-colors dark:text-white"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span
                    className={`text-sm font-bold px-3 py-1.5 rounded-lg ${product.stock > 0 ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"}`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock} units left)`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                  isInCart
                    ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                    : "bg-white dark:bg-gray-800 border-primary text-primary hover:bg-primary/5"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addingToCart ? (
                  <Loader2 className="animate-spin" />
                ) : isInCart ? (
                  <Check size={20} />
                ) : (
                  <ShoppingBag size={20} />
                )}
                {isInCart ? "Added to Cart" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Buy Now <ChevronRight size={20} />
              </button>
            </div>

            {/* Product Description & Details */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Product Details
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {product.description ||
                  "No description provided for this product."}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                      Fast Delivery
                    </p>
                    <p className="text-xs text-gray-500">
                      Free shipping over ₹500
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                      Secure Payment
                    </p>
                    <p className="text-xs text-gray-500">
                      100% encrypted checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 p-4 flex gap-3 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-safe">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || addingToCart}
          className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 border-2 ${
            isInCart
              ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
              : "bg-white dark:bg-gray-800 border-primary text-primary"
          } disabled:opacity-50`}
        >
          {addingToCart ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isInCart ? (
            <Check size={18} />
          ) : (
            <ShoppingBag size={18} />
          )}
          {isInCart ? "In Cart" : "Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold shadow-md active:scale-95 disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
