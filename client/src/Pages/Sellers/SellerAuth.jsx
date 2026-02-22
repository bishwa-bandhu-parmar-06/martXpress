import React, { useState, useEffect } from "react";
import {
  Store,
  TrendingUp,
  CreditCard,
  BarChart3,
  Shield,
  Truck,
  Award,
  LogIn,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import LoginForm from "@/Components/Common/Auth/Common/LoginForm.jsx";
import SellerRegisterForm from "@/Components/Common/Auth/SellersAuth/SellerRegisterForm.jsx";


const SellerAuth = () => {
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
    { label: "Active Sellers", value: "85K+", color: "text-primary" },
    { label: "Monthly Sales", value: "₹250Cr+", color: "text-green-600" },
    { label: "Customer Reach", value: "50M+", color: "text-blue-600" },
    { label: "Success Rate", value: "98%", color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans selection:bg-primary/30">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
       
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Branding & Features */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-black leading-[1.1] text-gray-900 dark:text-white">
                Empower your <br />
                <span className="text-primary">Business Growth</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                Unlock access to millions of customers across India. We provide
                the tools; you provide the vision.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-transform hover:-translate-y-1"
                >
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" /> Why sell on
                MartXpress?
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  🚀 Fastest Logistics Network
                </div>
                <div className="flex items-center gap-2">
                  🛡️ Seller Protection Policy
                </div>
                <div className="flex items-center gap-2">
                  💰 Lowest Commission Rates
                </div>
                <div className="flex items-center gap-2">
                  📊 Advanced Sales Analytics
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Card */}
          <div className="w-full max-w-xl mx-auto lg:ml-auto">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500">
              {/* Custom Tab Switcher */}
              <div className="flex p-2 bg-gray-50 dark:bg-gray-800/50 m-8 mb-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`cursor-pointer flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === "login"
                      ? "bg-white dark:bg-gray-700 text-primary shadow-md scale-100"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 scale-95"
                  }`}
                >
                  <LogIn className="h-5 w-5" />
                  Login
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={` cursor-pointer flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all duration-300 ${
                    activeTab === "register"
                      ? "bg-white dark:bg-gray-700 text-primary shadow-md scale-100"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 scale-95"
                  }`}
                >
                  <UserPlus className="h-5 w-5" />
                  Register
                </button>
              </div>

              {/* Conditional Form Rendering */}
              <div className="px-8 pb-8">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeTab === "login"
                      ? "Welcome Back!"
                      : "Start Your Journey"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    {activeTab === "login"
                      ? "Enter your credentials to manage your shop"
                      : "Fill out the form to become an authorized seller"}
                  </p>
                </div>

                <div className="transition-all duration-500 ease-in-out">
                  {activeTab === "login" ? (
                    <LoginForm userType="seller" />
                  ) : (
                    <SellerRegisterForm onSwitchToLogin={() => setActiveTab("login")}/>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 dark:bg-gray-800/30 p-6 text-center border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
                  Securely Encrypted • ISO Certified Platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerAuth;
