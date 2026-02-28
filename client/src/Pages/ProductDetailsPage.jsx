import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import React, { useState, useEffect } from "react";
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
  const dispatch = useDispatch();

  // Redux State
  const wishlistedIds = useSelector((state) => state.wishlist.wishlistItems);
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
          getCart(),
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
  }, [productId]);

  // --- Handlers ---

  const handleAddToCart = async () => {
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
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
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
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white p-3 rounded"
        >
          Go Home
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Images */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="aspect-square relative group">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
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
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImage((prev) => (prev + 1) % images.length)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* WISHLIST HEART BUTTON */}
                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 shadow-sm hover:bg-gray-50 transition-colors z-10"
                >
                  <Heart
                    size={22}
                    fill={isCurrentlyWishlisted ? "#ef4444" : "none"}
                    className={
                      isCurrentlyWishlisted ? "text-red-500" : "text-gray-600"
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
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl border-2 transition-all bg-white ${selectedImage === i ? "border-primary" : "border-transparent"}`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-primary tracking-widest uppercase">
              {product.brand}
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-yellow-400">
                <Star size={18} fill="currentColor" />{" "}
                <span className="ml-1 text-gray-700 dark:text-gray-300 font-bold">
                  {(product.averageRating || 0).toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({product.totalRatings || 0} reviews)
              </span>
            </div>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-3xl font-bold dark:text-white">
                ₹{(product.finalPrice || product.price).toLocaleString()}
              </span>
              {product.discount > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variants */}
            <div className="space-y-8 mb-10">
              {product.colors?.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold mb-3">Select Color</h3>
                  <div className="flex gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === c ? "border-primary ring-2 ring-primary/20 ring-offset-2" : "border-gray-200"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-bold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-xl bg-white dark:bg-gray-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-10 text-center font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-3"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span
                    className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock} left)`
                      : "Sold Out"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addingToCart}
                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                  isInCart
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-white border-primary text-primary hover:bg-primary/5"
                }`}
              >
                {addingToCart ? (
                  <Loader2 className="animate-spin" />
                ) : isInCart ? (
                  <Check size={20} />
                ) : (
                  <ShoppingBag size={20} />
                )}
                {isInCart ? "In Cart" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg hover:opacity-90 active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4 flex gap-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || addingToCart}
          className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border ${isInCart ? "bg-green-50 text-green-600" : "bg-gray-100"}`}
        >
          {isInCart ? <Check size={18} /> : <ShoppingBag size={18} />}{" "}
          {isInCart ? "In Cart" : "Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="flex-2 bg-primary text-white py-3 rounded-xl font-bold"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
