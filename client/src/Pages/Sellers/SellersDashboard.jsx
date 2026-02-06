import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  MoreVertical,
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  ChevronRight,
  ShoppingCart,
  CreditCard,
  Truck,
  Home,
  Settings,
  Bell,
  User,
  LogOut,
  Calendar,
  RefreshCw,
  Activity,
  PieChart,
  Target,
  Sun,
  Moon,
} from "lucide-react";
import {
  AddProductsForLoggedInSeller,
  getAllProductsOfLoggedInSeller,
} from "../../API/ProductsApi/productsAPI.js";

import AddProduct from "../../Components/SellersDashboard/Products/AddProduct.jsx";
import { getSellersDetails } from "../../API/Sellers/SellersApi.js";
import AllOrders from "../../Components/SellersDashboard/Orders/AllOrders.jsx";
import AllProducts from "../../Components/SellersDashboard/Products/AllProducts.jsx";
import AnalyticsDashboard from "../../Components/SellersDashboard/AnalyticsDashboard.jsx";
import SettingsPage from "../../Components/SellersDashboard/SettingsPage.jsx";
import { clearAuthData } from "../../utils/auth.js";
import { useNavigate } from "react-router-dom";
import EditProduct from "../../Components/SellersDashboard/Products/EditProduct.jsx";

const SellersDashboard = () => {
  const navigate = useNavigate();
  // State for active tab
  const [activeTab, setActiveTab] = useState("overview");
  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [products, setProducts] = useState([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [seller, setSeller] = useState(null);
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // TODO: Get All Sellers Details
  const getAllDetailsOfSellers = async () => {
    try {
      const fetchSellersData = await getSellersDetails();
      setSeller(fetchSellersData.seller);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  useEffect(() => {
    getAllDetailsOfSellers();
  }, []);

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  

  // State for orders
  const [orders] = useState([
    {
      id: "#ORD-78945",
      customer: "Alex Johnson",
      date: "2024-01-15",
      amount: 299.99,
      status: "delivered",
      items: 2,
    },
    {
      id: "#ORD-78946",
      customer: "Maria Garcia",
      date: "2024-01-15",
      amount: 154.98,
      status: "shipped",
      items: 3,
    },
    {
      id: "#ORD-78947",
      customer: "Robert Chen",
      date: "2024-01-14",
      amount: 449.97,
      status: "processing",
      items: 1,
    },
    {
      id: "#ORD-78948",
      customer: "Sarah Williams",
      date: "2024-01-14",
      amount: 89.99,
      status: "pending",
      items: 1,
    },
    {
      id: "#ORD-78949",
      customer: "James Wilson",
      date: "2024-01-13",
      amount: 579.98,
      status: "delivered",
      items: 4,
    },
  ]);

  // Stats data
  const stats = [
    {
      title: "Total Revenue",
      value: "$24,580",
      change: "+12.5%",
      icon: DollarSign,
      color: "bg-green-500",
      darkColor: "dark:bg-green-600",
    },
    {
      title: "Total Orders",
      value: "1,245",
      change: "+8.2%",
      icon: ShoppingBag,
      color: "bg-blue-500",
      darkColor: "dark:bg-blue-600",
    },
    {
      title: "Products",
      value: "86",
      change: "+3.1%",
      icon: Package,
      color: "bg-purple-500",
      darkColor: "dark:bg-purple-600",
    },
    {
      title: "Customers",
      value: "4,892",
      change: "+5.7%",
      icon: Users,
      color: "bg-orange-500",
      darkColor: "dark:bg-orange-600",
    },
  ];

  // Recent activities
  const activities = [
    {
      id: 1,
      action: "New order received",
      details: "Order #ORD-78950",
      time: "10 min ago",
      icon: ShoppingBag,
    },
    {
      id: 2,
      action: "Product review",
      details: "Wireless Headphones got 5 stars",
      time: "1 hour ago",
      icon: Star,
    },
    {
      id: 3,
      action: "Payment received",
      details: "$299.99 from Order #ORD-78945",
      time: "2 hours ago",
      icon: DollarSign,
    },
    {
      id: 4,
      action: "Low stock alert",
      details: "Smart Watch Series 5 (12 left)",
      time: "5 hours ago",
      icon: AlertCircle,
    },
    {
      id: 5,
      action: "Product published",
      details: 'New product "Fitness Tracker"',
      time: "1 day ago",
      icon: CheckCircle,
    },
  ];

  // Status badge component with dark mode support
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: {
        text: "Active",
        bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      },
      "out-of-stock": {
        text: "Out of Stock",
        bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      },
      pending: {
        text: "Pending",
        bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      },
      processing: {
        text: "Processing",
        bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      },
      shipped: {
        text: "Shipped",
        bg: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      },
      delivered: {
        text: "Delivered",
        bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      },
    };

    const config = statusConfig[status] || {
      text: status,
      bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300`}
      >
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingCart },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "customers", label: "Customers", icon: Users },
              { id: "reviews", label: "Reviews", icon: Star },
              { id: "marketing", label: "Marketing", icon: Target },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={` cursor-pointer w-full flex items-center ${
                    sidebarCollapsed ? "justify-center px-2" : "px-4"
                  } py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      activeTab === item.id
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">
                {seller?.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
            </div>

            {!sidebarCollapsed && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {seller?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Premium Seller
                </p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronRight
                className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${
                  sidebarCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="search"
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You have 5 unread notifications
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-start">
                            <div className="shrink-0">
                              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                New order received
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Order #ORD-7895{i}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                10 minutes ago
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {seller?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {seller?.email}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {seller?.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Overview */}
          {activeTab === "overview" && (
            <>
              {/* Welcome Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {seller?.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Here's what's happening with your store today.
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <button className=" cursor-pointer flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh Data
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            {stat.value}
                          </p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {stat.change}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                              from last month
                            </span>
                          </div>
                        </div>
                        <div
                          className={`${stat.color} ${stat.darkColor} h-12 w-12 rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts and Data Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Revenue Overview
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Last 30 days performance
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                        Monthly
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Weekly
                      </button>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-indigo-300 dark:text-indigo-500 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Revenue chart visualization
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Interactive chart would appear here
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Average Daily Revenue
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        $819.33
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total This Month
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        $24,580
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products Tab */}
          {activeTab === "products" && <AllProducts />}

          {/* Orders Tab */}
          {activeTab === "orders" && <AllOrders />}

          {/* Analytics Tab */}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {/* {Settings Tab} */}
          {activeTab === "settings" && <SettingsPage />}
        </main>

        {/* Quick Stats Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>
                  Store Status:{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    Online
                  </span>
                </span>
              </div>
              <div className="hidden md:block">
                <span>
                  Last Updated: Today at{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("settings")}
                className="cursor-pointer flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </button>

              <button
                onClick={() => handleLogout()}
                className="cursor-pointer flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </footer>
      </div>

      <AddProduct
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
      />
      <EditProduct
        isOpen={isEditProductOpen}
        product={selectedProduct}
        onClose={() => {
          setIsEditProductOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default SellersDashboard;
