import React, { useState, useEffect } from "react";
import Theme from "../../Components/Navbar/Theme";
import LoginForm from "../../Components/Common/Auth/Common/LoginForm";
import UserRegistration from "../../Components/Common/Auth/UsersAuth/UserRegistration";
import {
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  Gift,
  Star,
  Package,
  Heart,
} from "lucide-react";

const UsersAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to document
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Fast Delivery",
      description: "Same-day delivery in select cities",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Shopping",
      description: "100% secure payment protection",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Easy Returns",
      description: "30-day hassle-free returns",
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: "Exclusive Deals",
      description: "Member-only discounts & offers",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Verified sellers & products",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Wide Selection",
      description: "Millions of products across categories",
    },
  ];

  const stats = [
    { label: "Happy Customers", value: "2M+", color: "text-primary" },
    { label: "Products Sold", value: "50M+", color: "text-green-600" },
    { label: "Delivery Cities", value: "500+", color: "text-blue-600" },
    { label: "Trust Score", value: "4.8★", color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03] pointer-events-none"></div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-12 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                MartXpress
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your Shopping Destination
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                #1 E-commerce
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Live Shoppers:{" "}
              </span>
              <span className="font-semibold text-green-600">5,234+</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Brand & Info */}
          <div className="space-y-8">
            {/* Main Brand */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
                  Shop Smarter
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
                Join millions of happy customers shopping on India's fastest
                growing e-commerce platform. Get the best deals on everything
                you need.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Why Choose MartXpress?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                        <div className="text-primary">{feature.icon}</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-linear-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-6 border border-primary/20 dark:border-primary/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    100% Buyer Protection
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Your money is safe with us. Full refund if you don't receive
                    your order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Forms */}
          <div className="space-y-8">
            {/* Auth Container */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-linear-to-r from-primary to-secondary p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {isLogin ? "Welcome Back!" : "Join MartXpress"}
                  </h2>
                  <p className="text-white/90 mt-2">
                    {isLogin
                      ? "Sign in to your account to continue shopping"
                      : "Create your account to unlock amazing benefits"}
                  </p>
                </div>
              </div>

              {/* Auth Toggle */}
              <div className="px-8 pt-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isLogin
                          ? "bg-white dark:bg-gray-800 text-primary shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                      Sign In
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        !isLogin
                          ? "bg-white dark:bg-gray-800 text-primary shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="transition-all duration-300">
                  {isLogin ? (
                    <div className="w-full">
                      <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                    </div>
                  ) : (
                    <UserRegistration
                      onSwitchToLogin={() => setIsLogin(true)}
                    />
                  )}
                </div>
              </div>

              {/* Trust Footer */}
              <div className="px-8 pb-8">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      100% Secure
                    </span>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Safe Payments
                    </span>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Fast Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Benefits */}
            <div className="bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                Member Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Get ₹200 off on your first order
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Access to exclusive flash sales
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Free shipping on orders above ₹499
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Early access to new collections
                  </span>
                </li>
              </ul>
            </div>

            {/* Testimonial */}
            <div className="bg-linear-to-r from-secondary/5 to-primary/5 dark:from-secondary/10 dark:to-primary/10 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <p className="text-sm italic text-gray-600 dark:text-gray-300">
                    "MartXpress made my shopping experience so easy! Fast
                    delivery and great customer support."
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mt-2">
                    - Anjali Sharma
                  </p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-3 w-3 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} MartXpress - India's Favorite
                Shopping Destination
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Over 2 million happy customers and counting
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Help Center
              </button>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Return Policy
              </button>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Contact Us
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Live:{" "}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  5,234 Shoppers Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              #e5e7eb 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .dark .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              #374151 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, #374151 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default UsersAuth;
