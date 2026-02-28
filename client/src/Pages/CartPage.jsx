import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Image as ImageIcon,
  AlertCircle,
  Zap,
  Heart,
  Loader2,
} from "lucide-react";

import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../API/Cart/getAllCartProductApi.js";
import {
  addProductToWishList,
  removeASingleWishlistProduct,
} from "../API/Cart/wishListApi.js";
import {
  setCartQuantity as setGlobalCartQuantity,
  clearCartQuantity,
} from "../Features/Cart/CartSlice.js";
import {
  addToWishlistRedux,
  removeFromWishlistRedux,
} from "../Features/Cart/WishlistSlice.js";
import { isAuthenticated } from "@/utils/auth.js";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlistedIds = useSelector((state) => state.wishlist.wishlistItems);

  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to use cart functionality");
      navigate("/users/auth");
      return;
    }
    fetchCartData();
  }, [isAuthenticated, navigate]);

  const updateCartState = (cartData) => {
    if (cartData) {
      setCartItems(cartData.items || []);
      setCartTotal(cartData.totalPrice || 0);
      setCartQuantity(cartData.totalQuantity || 0);
      dispatch(setGlobalCartQuantity(cartData.totalQuantity || 0));
    }
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      if (response?.success) {
        updateCartState(response.cart);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        updateCartState({ items: [], totalPrice: 0, totalQuantity: 0 });
      } else {
        toast.error(error.response?.data?.message || "Failed to load cart");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- WISHLIST TOGGLE LOGIC ---
  const handleWishlistToggle = async (productId) => {
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
          toast.success("Saved to wishlist ❤️");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateQuantity = async (productId, currentQty, change) => {
    const newQuantity = currentQty + change;
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast.error("Maximum limit of 10 items reached");
      return;
    }

    try {
      setActionLoading(productId);
      const response = await updateCartItemQuantity(productId, newQuantity);
      if (response?.success) {
        updateCartState(response.cart);
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setActionLoading(productId);
      const response = await removeCartItem(productId);
      if (response?.success) {
        updateCartState(response.cart);
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item");
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      const response = await clearCart();
      if (response?.success) {
        setCartItems([]);
        setCartTotal(0);
        setCartQuantity(0);
        dispatch(clearCartQuantity());
        toast.success("Cart cleared");
      }
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = (item) => {
    navigate("/checkout", {
      state: {
        buyNowProduct: [
          {
            product: {
              _id: item.productId,
              name: item.name,
              price: item.price,
              images: [item.image],
            },
            quantity: item.quantity,
          },
        ],
      },
    });
  };
  const shipping = cartTotal > 500 || cartTotal === 0 ? 0 : 50;
  const finalTotal = cartTotal + shipping;
  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white mb-2">
          Your cart is empty
        </h2>
        <Link
          to="/"
          className="mt-4 px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
            Shopping Cart{" "}
            <span className="text-gray-500 font-normal text-lg">
              ({cartQuantity})
            </span>
          </h1>
          <button
            onClick={handleClearCart}
            className="text-red-500 font-bold text-sm flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={16} />{" "}
            <span className="hidden sm:inline">Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => {
              // 2. Check if this specific product is in the wishlist
              const isWishlisted = wishlistedIds.includes(item.productId);

              return (
                <div
                  key={item.productId}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border dark:border-gray-700 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-opacity ${actionLoading === item.productId ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="shrink-0 w-full sm:w-32 h-32 bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-lg font-bold dark:text-white hover:text-primary transition-colors cursor-pointer line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <div className="mt-1 text-primary font-bold text-xl">
                          ₹{item.price?.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* 3. WISHLIST TOGGLE BUTTON */}
                        <button
                          onClick={() => handleWishlistToggle(item.productId)}
                          className={`p-2 rounded-lg transition-all cursor-pointer ${isWishlisted ? "bg-red-50 dark:bg-red-900/20 text-red-500" : "text-gray-400 hover:text-red-500"}`}
                        >
                          <Heart
                            size={20}
                            fill={isWishlisted ? "currentColor" : "none"}
                          />
                        </button>

                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="p-2 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity,
                                -1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 cursor-pointer"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-bold dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId,
                                item.quantity,
                                1,
                              )
                            }
                            disabled={item.quantity >= 10}
                            className="p-2 cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => handleBuyNow(item)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-xs font-bold cursor-pointer border border-primary/20 shadow-sm"
                        >
                          <Zap size={16} /> Buy Now
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">
                          Subtotal
                        </span>
                        <span className="font-bold dark:text-white">
                          ₹
                          {(
                            item.subtotal || item.price * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border dark:border-gray-700 sticky top-24">
              <h2 className="text-xl font-bold dark:text-white mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-bold dark:text-white">
                    ₹{cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-bold text-green-500">
                    {finalTotal - cartTotal === 0
                      ? "Free"
                      : `₹${finalTotal - cartTotal}`}
                  </span>
                </div>
              </div>
              <div className="border-t dark:border-gray-700 pt-4 mb-6 flex justify-between items-end">
                <span className="text-lg font-bold dark:text-white">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg cursor-pointer"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
