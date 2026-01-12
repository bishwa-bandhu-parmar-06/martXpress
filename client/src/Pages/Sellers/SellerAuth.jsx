import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerSeller } from "../../API/Sellers/SellersApi.js";
import { login } from "../../API/Common/commonApi.js";
import {
  Store,
  TrendingUp,
  Users,
  CreditCard,
  BarChart3,
  Shield,
  Truck,
  Award,
  FileText,
  CheckCircle,
  Building2,
} from "lucide-react";

const SellerAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false); // Default to Register for sellers
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    shopName: "",
    gstNumber: "",
    TermsAndCdn: false,
  });
  const [gstCertificate, setGstCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check for theme preference
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setGstCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // Login logic for sellers
        const res = await login({ email: formData.email });
        if (res.status !== 200) throw new Error(res.message);

        navigate("/verify-otp", {
          state: {
            email: formData.email,
            mode: "login",
          },
        });
      } else {
        // Register logic for sellers
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("mobile", formData.mobile);
        payload.append("shopName", formData.shopName);
        payload.append("gstNumber", formData.gstNumber);
        payload.append("TermsAndCdn", formData.TermsAndCdn);

        if (gstCertificate) {
          payload.append("gstCertificate", gstCertificate);
        }

        const res = await registerSeller(payload);
        if (res.status !== 200) throw new Error(res.message);

        setSuccess("Registration successful! Please check your email for OTP.");

        setTimeout(() => {
          navigate("/verify-otp", {
            state: {
              email: formData.email,
              role: "seller",
              mode: "register",
            },
          });
        }, 1500);
      }
    } catch (err) {
      setError(
        err.message || (isLogin ? "Login failed" : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Active Sellers", value: "85K+", color: "text-primary" },
    { label: "Monthly Sales", value: "₹250Cr+", color: "text-green-600" },
    { label: "Customer Reach", value: "50M+", color: "text-blue-600" },
    { label: "Success Rate", value: "98%", color: "text-yellow-600" },
  ];

  const features = [
    {
      icon: <Store className="h-6 w-6" />,
      title: "Digital Storefront",
      description: "Beautiful online shop with customization",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Growth Tools",
      description: "Marketing & promotion features",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Weekly settlements, no delays",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Real-time sales & customer insights",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Logistics Support",
      description: "Shipping & delivery management",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Seller Protection",
      description: "Fraud protection & dispute resolution",
    },
  ];

  const successStories = [
    {
      name: "Raj Textiles",
      story:
        "Grew from local shop to national brand with 500% revenue increase",
      duration: "2 years",
    },
    {
      name: "Healthy Bites",
      story: "Started from home kitchen, now supplies to 200+ cities",
      duration: "18 months",
    },
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
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                MartXpress Seller
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Business Portal
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Trusted Platform
              </span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Active: </span>
              <span className="font-semibold text-green-600">
                85,234 Sellers
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Business Info */}
          <div className="space-y-8">
            {/* Main Brand */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-linear-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent">
                  Grow Your Business
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
                Join India's fastest-growing e-commerce marketplace. Sell to
                millions of customers with powerful tools and support.
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
                Everything You Need to Sell
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

            {/* Success Stories */}
            <div className="bg-linear-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                Seller Success Stories
              </h3>
              <div className="space-y-4">
                {successStories.map((story, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {story.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {story.story}
                      </p>
                      <p className="text-xs text-primary mt-2 font-medium">
                        Within {story.duration}
                      </p>
                    </div>
                  </div>
                ))}
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
                    <Store className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {isLogin ? "Seller Login" : "Start Selling"}
                  </h2>
                  <p className="text-white/90 mt-2">
                    {isLogin
                      ? "Access your seller dashboard"
                      : "Register your business and start selling"}
                  </p>
                </div>
              </div>

              {/* Auth Toggle */}
              <div className="px-8 pt-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setError("");
                        setSuccess("");
                      }}
                      className={`py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        !isLogin
                          ? "bg-white dark:bg-gray-800 text-primary shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      Register
                    </button>
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setError("");
                        setSuccess("");
                      }}
                      className={`py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isLogin
                          ? "bg-white dark:bg-gray-800 text-primary shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                      Login
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {/* Success Message */}
                {success && (
                  <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium">
                      {success}
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">
                      {error}
                    </p>
                  </div>
                )}

                <div className="transition-all duration-300">
                  {isLogin ? (
                    /* Login Form */
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Business Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your business email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-primary/50 focus:border-primary
                            outline-none transition-all duration-200"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold 
                          py-3 px-4 rounded-lg transition-all duration-200
                          transform hover:scale-[1.02] active:scale-[0.98]
                          disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending OTP...
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Registration Form */
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Seller Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-primary/50 focus:border-primary
                              outline-none transition-all duration-200"
                            required
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Business Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="business@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-primary/50 focus:border-primary
                              outline-none transition-all duration-200"
                            required
                          />
                        </div>

                        {/* Mobile */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            name="mobile"
                            placeholder="10-digit mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-primary/50 focus:border-primary
                              outline-none transition-all duration-200"
                            required
                            pattern="[0-9]{10}"
                          />
                        </div>

                        {/* Shop Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Shop Name *
                          </label>
                          <input
                            type="text"
                            name="shopName"
                            placeholder="Your shop/brand name"
                            value={formData.shopName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-primary/50 focus:border-primary
                              outline-none transition-all duration-200"
                            required
                          />
                        </div>

                        {/* GST Number */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            GST Number *
                          </label>
                          <input
                            type="text"
                            name="gstNumber"
                            placeholder="Enter 15-digit GST number"
                            value={formData.gstNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                              uppercase bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-primary/50 focus:border-primary
                              outline-none transition-all duration-200"
                            required
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Required for business verification
                          </p>
                        </div>

                        {/* GST Certificate */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            GST Certificate (Optional)
                          </label>
                          <div
                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4
                            hover:border-primary transition-colors group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.png"
                                  onChange={handleFileChange}
                                  className="w-full text-sm text-gray-700 dark:text-gray-300"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  Upload GST certificate for faster verification
                                </p>
                              </div>
                            </div>
                            {gstCertificate && (
                              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-700 dark:text-green-400">
                                  {gstCertificate.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input
                          type="checkbox"
                          name="TermsAndCdn"
                          checked={formData.TermsAndCdn}
                          onChange={handleChange}
                          className="h-5 w-5 mt-0.5 text-primary focus:ring-primary"
                          required
                        />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            I agree to the MartXpress Seller Terms & Conditions.
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Your shop information will be verified within 24-48
                            hours.
                          </p>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={loading || !formData.TermsAndCdn}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold 
                          py-3 px-4 rounded-lg transition-all duration-200
                          transform hover:scale-[1.02] active:scale-[0.98]
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Registering...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Store className="h-5 w-5" />
                            Register as Seller
                          </span>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Footer */}
              <div className="px-8 pb-8">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Business Verification
                    </span>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Weekly Payments
                    </span>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Dedicated Support
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support */}
            <div className="bg-linear-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                Seller Support
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Free onboarding and training
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Account manager for premium sellers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mt-0.5 shrink-0">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Marketing & promotional support
                  </span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need help? Call our seller support:
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  +91 9142364660
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} MartXpress Seller Portal
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Empowering 85,000+ businesses across India
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate("/seller/terms")}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Seller Agreement
              </button>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              <button
                onClick={() => navigate("/seller/pricing")}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Commission Rates
              </button>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              <button
                onClick={() => navigate("/seller/help")}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Help Center
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Platform:{" "}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  Active
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

export default SellerAuth;
