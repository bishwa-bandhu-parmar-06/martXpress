import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  LogIn,
  UserPlus,
  CheckCircle2,
} from "lucide-react";

const UsersAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // "login" or "register"
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const stats = [
    { label: "Happy Customers", value: "2M+", color: "text-primary" },
    { label: "Products Sold", value: "50M+", color: "text-green-600" },
    { label: "Delivery Cities", value: "500+", color: "text-blue-600" },
    { label: "Trust Score", value: "4.8★", color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 selection:bg-primary/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Brand Info */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900 dark:text-white">
                Shop Smarter, <br />
                <span className="text-primary">Live Better.</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg">
                Join India's fastest-growing shopping community. Quality
                products, lightning-fast delivery.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-linear-to-r from-primary/10 to-transparent p-6 rounded-2xl border-l-4 border-primary">
              <h3 className="font-bold flex items-center gap-2 mb-2 text-gray-800 dark:text-white">
                <Shield className="h-5 w-5 text-primary" /> 100% Buyer
                Protection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your safety is our priority. Secure payments and hassle-free
                returns on every order.
              </p>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="w-full max-w-xl mx-auto lg:ml-auto">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Animated Tab Switcher */}
              <div className="flex p-2  bg-gray-50 dark:bg-gray-800/50 m-8 mb-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === "login"
                      ? "bg-white dark:bg-gray-700 text-primary shadow-md"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <LogIn className="h-5 w-5" /> Sign In
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={` cursor-pointer flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === "register"
                      ? "bg-white dark:bg-gray-700 text-primary shadow-md"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <UserPlus className="h-5 w-5" /> Sign Up
                </button>
              </div>

              {/* Form Section */}
              <div className="px-8 pb-8">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeTab === "login" ? "Welcome Back!" : "Create Account"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {activeTab === "login"
                      ? "Sign in to manage your orders and wishlist"
                      : "Start your shopping journey with us today"}
                  </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeTab === "login" ? (
                    <LoginForm userType="user" />
                  ) : (
                    <UserRegistration
                      onSwitchToLogin={() => setActiveTab("login")}
                    />
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 text-center border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Verified Shopping • Secure Checkout
                </p>
              </div>
            </div>

            {/* Seller Quick Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Want to grow your business?{" "}
                <button
                  onClick={() => navigate("/sellers/auth")}
                  className="text-secondary font-bold hover:underline"
                >
                  Become a Seller
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAuth;
