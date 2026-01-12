import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  Shield,
  CreditCard,
  Tag,
  Gift,
  AlertCircle,
  Package,
  RefreshCw,
  Heart,
  Share2,
} from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      brand: "SoundMax",
      color: "Black",
      price: 2999,
      originalPrice: 4999,
      discount: 40,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      inStock: true,
      deliveryDate: "Tomorrow, 10 AM - 2 PM",
      seller: "ElectroHub",
      rating: 4.5,
      reviews: 1245,
    },
    {
      id: 2,
      name: "Casual Running Shoes",
      brand: "SportFit",
      color: "Blue",
      price: 1899,
      originalPrice: 2999,
      discount: 37,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w-400",
      inStock: true,
      deliveryDate: "Today, 6 PM - 9 PM",
      seller: "ShoeMart",
      rating: 4.3,
      reviews: 876,
    },
    {
      id: 3,
      name: "Premium Cotton T-Shirt",
      brand: "UrbanWear",
      color: "White",
      price: 799,
      originalPrice: 1499,
      discount: 47,
      quantity: 3,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      inStock: true,
      deliveryDate: "Tomorrow, 2 PM - 6 PM",
      seller: "FashionHub",
      rating: 4.2,
      reviews: 543,
    },
    {
      id: 4,
      name: "Smart Watch Series 5",
      brand: "TechGear",
      color: "Silver",
      price: 12999,
      originalPrice: 19999,
      discount: 35,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      inStock: false,
      deliveryDate: "Out of Stock",
      seller: "GadgetWorld",
      rating: 4.7,
      reviews: 2341,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Calculate cart summary
  const calculateSummary = () => {
    const subtotal = cartItems
      .filter((item) => item.inStock)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const discount = cartItems
      .filter((item) => item.inStock)
      .reduce(
        (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
        0
      );

    const delivery = subtotal > 999 ? 0 : 49;
    const couponDiscount = appliedCoupon ? 200 : 0;
    const total = subtotal + delivery - couponDiscount;

    return {
      subtotal,
      discount,
      delivery,
      couponDiscount,
      total,
      itemsCount: cartItems
        .filter((item) => item.inStock)
        .reduce((sum, item) => sum + item.quantity, 0),
      savedAmount: discount + couponDiscount,
    };
  };

  const summary = calculateSummary();

  // Handle quantity changes
  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 1 && newQuantity <= 10) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Move to wishlist
  const moveToWishlist = (id) => {
    const item = cartItems.find((item) => item.id === id);
    alert(`"${item.name}" moved to wishlist`);
    removeItem(id);
  };

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.trim() === "MARTX20") {
      setAppliedCoupon(true);
      alert("Coupon applied successfully! You saved ₹200.");
    } else {
      alert("Invalid coupon code. Try 'MARTX20' for ₹200 off.");
    }
  };

  // Addresses
  const addresses = [
    {
      id: 1,
      name: "Home",
      address: "123 Main Street, Apartment 4B, Bangalore, Karnataka 560001",
      phone: "9876543210",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      address:
        "456 Tech Park, 5th Floor, Sector 62, Noida, Uttar Pradesh 201301",
      phone: "9876543211",
      isDefault: false,
    },
    {
      id: 3,
      name: "Parents' Home",
      address: "789 Colony Road, Near City Mall, Mumbai, Maharashtra 400001",
      phone: "9876543212",
      isDefault: false,
    },
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: 1,
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Pay with your card",
    },
    {
      id: 2,
      name: "UPI",
      icon: "📱",
      description: "Google Pay, PhonePe, Paytm",
    },
    { id: 3, name: "Net Banking", icon: "🏦", description: "All major banks" },
    {
      id: 4,
      name: "Cash on Delivery",
      icon: "💰",
      description: "Pay when delivered",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span>Continue Shopping</span>
            </button>

            <div className="flex items-center gap-2">
              <ShoppingBag className="text-primary" size={24} />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Shopping Cart ({summary.itemsCount} items)
              </h1>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Items reserved for{" "}
              <span className="font-semibold text-primary">30 min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Your Cart Items
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Review and manage your items
                </p>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 ${
                      !item.inStock ? "bg-red-50 dark:bg-red-900/20" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {!item.inStock && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Out of Stock
                          </div>
                        )}
                        {item.discount > 0 && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                            {item.discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {item.brand} • Color: {item.color}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white ml-1">
                                  {item.rating}
                                </span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {item.reviews.toLocaleString()} reviews
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Seller: {item.seller}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{item.price.toLocaleString()}
                              </span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                  ₹{item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                              You save ₹
                              {(
                                item.originalPrice - item.price
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 text-gray-900 dark:text-white font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                disabled={item.quantity >= 10}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            <div className="text-sm">
                              {item.inStock ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                  <Package size={14} />
                                  <span>Delivery {item.deliveryDate}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                  <AlertCircle size={14} />
                                  <span>Currently unavailable</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => moveToWishlist(item.id)}
                              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Heart size={18} />
                              <span className="hidden sm:inline">Wishlist</span>
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 size={18} />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-4 justify-between">
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setCartItems([]);
                        alert("Cart cleared successfully!");
                      }}
                      className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={() => alert("Cart updated successfully!")}
                      className="px-6 py-3 bg-primary hover:bg-orange-700 text-white rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <RefreshCw size={18} />
                      Update Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="text-primary" size={24} />
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Delivery Address
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Choose your delivery location
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-primary hover:text-orange-700 font-medium cursor-pointer"
                  >
                    + Add New Address
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddress(address.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-gray-300 dark:border-gray-600 hover:border-primary"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {address.name}
                            </span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {address.address}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Phone: {address.phone}
                          </p>
                        </div>
                        {selectedAddress === address.id && (
                          <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Price Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{summary.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Discount
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      -₹{summary.discount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-flex items-center gap-2">
                      Delivery
                      {summary.delivery === 0 ? (
                        <span className="text-green-600 dark:text-green-400 text-xs">
                          FREE
                        </span>
                      ) : null}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {summary.delivery === 0 ? "FREE" : `₹${summary.delivery}`}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Coupon Discount
                      </span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        -₹{summary.couponDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{summary.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    You save ₹{summary.savedAmount.toLocaleString()} on this
                    order
                  </p>
                </div>

                {/* Coupon Code */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={appliedCoupon}
                      className={`px-6 py-3 rounded-lg font-medium cursor-pointer ${
                        appliedCoupon
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-primary hover:bg-orange-700 text-white"
                      }`}
                    >
                      {appliedCoupon ? "Applied" : "Apply"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Try coupon code:{" "}
                    <span className="font-mono text-primary">MARTX20</span> for
                    ₹200 off
                  </p>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield size={16} />
                  <span>Safe and Secure Payments</span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={() => {
                    const inStockItems = cartItems.filter(
                      (item) => item.inStock
                    );
                    if (inStockItems.length === 0) {
                      alert("Please add items to your cart to place an order.");
                      return;
                    }
                    navigate("/checkout");
                  }}
                  className="w-full py-4 bg-linear-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  PROCEED TO CHECKOUT
                </button>

                {/* Payment Methods */}
                <div className="grid grid-cols-4 gap-2 pt-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="text-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors cursor-pointer"
                    >
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {method.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Offers & Benefits */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-sm border border-blue-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="text-blue-600 dark:text-blue-400" size={24} />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Available Offers
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      ₹
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Get ₹100 cashback on orders above ₹999
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use code: CASHBACK100
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                    <Truck className="text-primary" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Free delivery on orders above ₹499
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Applied automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <Gift
                      className="text-purple-600 dark:text-purple-400"
                      size={16}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Buy 2 Get 1 Free on selected items
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Limited time offer
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors cursor-pointer">
                View All Offers
              </button>
            </div>

            {/* Need Help */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    Return Policy
                  </span>
                  <span className="text-primary font-medium">10 Days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    Warranty
                  </span>
                  <span className="text-primary font-medium">1 Year</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-700 dark:text-gray-300">
                    Customer Support
                  </span>
                  <span className="text-primary font-medium">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Address
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address Name
                </label>
                <input
                  type="text"
                  placeholder="Home, Office, etc."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Complete Address
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter your complete address"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  className="rounded"
                />
                <label
                  htmlFor="defaultAddress"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddressModal(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Address added successfully!");
                  setShowAddressModal(false);
                }}
                className="flex-1 py-3 bg-primary hover:bg-orange-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
