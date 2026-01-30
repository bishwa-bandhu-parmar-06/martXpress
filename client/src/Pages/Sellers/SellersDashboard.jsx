//SellersDashboard
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
} from "lucide-react";
import {
  AddProductsForLoggedInSeller,
  getAllProductsOfLoggedInSeller,
} from "../../API/ProductsApi/productsAPI.js";

import AddProduct from "../../Components/Products/AddProduct.jsx";

const SellersDashboard = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("overview");
  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [products, setProducts] = useState([]);

  // !Function for Get All Products of Logged in Seller
  const getAllProducts = async () => {
    try {
      const response = await getAllProductsOfLoggedInSeller();

      setProducts(Array.isArray(response.products) ? response.products : []);

      console.log("Seller Products:", response);
    } catch (error) {
      console.error("Error While Getting Products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // !Functions for Add Products
  const handleAdditionOfProducts = async () => {
    try {
      const response = await AddProductsForLoggedInSeller();
      console.log("Selled Products : ", response);
    } catch (error) {
      console.error("Error While Gettting All Products : ", error);
    }
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
    },
    {
      title: "Total Orders",
      value: "1,245",
      change: "+8.2%",
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "Products",
      value: "86",
      change: "+3.1%",
      icon: Package,
      color: "bg-purple-500",
    },
    {
      title: "Customers",
      value: "4,892",
      change: "+5.7%",
      icon: Users,
      color: "bg-orange-500",
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

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { text: "Active", bg: "bg-green-100 text-green-800" },
      "out-of-stock": { text: "Out of Stock", bg: "bg-red-100 text-red-800" },
      pending: { text: "Pending", bg: "bg-yellow-100 text-yellow-800" },
      processing: { text: "Processing", bg: "bg-blue-100 text-blue-800" },
      shipped: { text: "Shipped", bg: "bg-purple-100 text-purple-800" },
      delivered: { text: "Delivered", bg: "bg-green-100 text-green-800" },
    };

    const config = statusConfig[status] || {
      text: status,
      bg: "bg-gray-100 text-gray-800",
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 flex items-center">
          {!sidebarCollapsed ? (
            <>
              <ShoppingBag className="h-8 w-8 text-indigo-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">SellerPro</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </>
          ) : (
            <ShoppingBag className="h-8 w-8 text-indigo-600 mx-auto" />
          )}
        </div>

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
                  className={`w-full flex items-center ${
                    sidebarCollapsed ? "justify-center px-2" : "px-4"
                  } py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      activeTab === item.id
                        ? "text-indigo-600"
                        : "text-gray-500"
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
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">SJ</span>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Seller Jones
                </p>
                <p className="text-xs text-gray-500">Premium Seller</p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-2 p-1 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight
                className={`h-4 w-4 text-gray-500 transition-transform ${
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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search products, orders, customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-gray-100 relative"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">
                        Notifications
                      </h3>
                      <p className="text-sm text-gray-500">
                        You have 5 unread notifications
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="p-4 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="flex items-start">
                            <div className="shrink-0">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Bell className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                New order received
                              </p>
                              <p className="text-sm text-gray-500">
                                Order #ORD-7895{i}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                10 minutes ago
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    Seller Jones
                  </p>
                  <p className="text-xs text-gray-500">seller@example.com</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SJ</span>
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, Seller Jones!
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your store today.
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <button className="flex items-center text-sm text-indigo-600 hover:text-indigo-800">
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
                      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            {stat.value}
                          </p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm font-medium text-green-600">
                              {stat.change}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              from last month
                            </span>
                          </div>
                        </div>
                        <div
                          className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center`}
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
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Revenue Overview
                      </h3>
                      <p className="text-gray-600">Last 30 days performance</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        Monthly
                      </button>
                      <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Weekly
                      </button>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Revenue chart visualization
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Interactive chart would appear here
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">
                        Average Daily Revenue
                      </p>
                      <p className="text-xl font-bold text-gray-900">$819.33</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total This Month</p>
                      <p className="text-xl font-bold text-gray-900">$24,580</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Recent Activities
                    </h3>
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {activities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start">
                          <div className="shrink-0 h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.details}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="w-full mt-6 py-2.5 text-center text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-gray-200 rounded-lg hover:bg-gray-50">
                    View All Activities
                  </button>
                </div>
              </div>

              {/* Products and Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Top Products
                    </h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Product
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-8 text-center text-gray-500 text-sm"
                            >
                              🚫 No products yet
                            </td>
                          </tr>
                        ) : (
                          products.slice(0, 5).map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded bg-linear-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-indigo-600" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">
                                      {product.name}
                                    </p>
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                      <span className="text-xs text-gray-500 ml-1">
                                        {product.rating ?? 0} (
                                        {product.sales ?? 0} sold)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                {product.stock} units
                              </td>
                              <td className="px-6 py-4">₹{product.price}</td>
                              <td className="px-6 py-4">
                                <StatusBadge status={product.status} />
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button className="p-1 text-gray-400 hover:text-blue-600">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 text-gray-400 hover:text-green-600">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="p-1 text-gray-400 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Recent Orders
                    </h3>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                {order.id}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.date}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {order.customer}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.items} items
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">
                                ${order.amount}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <ChevronRight className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Showing 5 of 1,245 orders
                    </p>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                      View All Orders
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                  <p className="text-gray-600 mt-1">
                    Manage your product inventory
                  </p>
                </div>
                <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </button>
              </div>

              {/* Product Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => getAllProducts()}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium"
                >
                  All Products
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                  Active
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                  Out of Stock
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                  Best Sellers
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                      <Package className="h-16 w-16 text-indigo-300" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {product.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating} · {product.sales} sold
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={product.status} />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${product.price}
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.stock} in stock
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 bg-gray-100 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                  <p className="text-gray-600 mt-1">
                    Manage and track customer orders
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </button>
                  <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    + New Order
                  </button>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Pending",
                    count: 24,
                    icon: Clock,
                    color: "text-yellow-500",
                    bg: "bg-yellow-50",
                  },
                  {
                    label: "Processing",
                    count: 12,
                    icon: RefreshCw,
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Shipped",
                    count: 45,
                    icon: Truck,
                    color: "text-purple-500",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "Delivered",
                    count: 1164,
                    icon: CheckCircle,
                    color: "text-green-500",
                    bg: "bg-green-50",
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center">
                        <div
                          className={`${stat.bg} h-10 w-10 rounded-lg flex items-center justify-center mr-3`}
                        >
                          <Icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-xl font-bold text-gray-900">
                            {stat.count.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {order.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-xs">
                              {order.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {order.customer}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.items} items
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {order.date}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            ${order.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100">
                              View
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Analytics Dashboard
                </h1>
                <p className="text-gray-600">
                  Deep insights into your store performance
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="lg:col-span-2">
                    <div className="h-80 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
                        <p className="text-gray-500">Sales Analytics Chart</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Interactive pie chart showing sales distribution
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Conversion Rate",
                        value: "3.2%",
                        change: "+0.4%",
                        trend: "up",
                      },
                      {
                        label: "Avg. Order Value",
                        value: "$89.42",
                        change: "+$5.21",
                        trend: "up",
                      },
                      {
                        label: "Customer Retention",
                        value: "42%",
                        change: "-2.1%",
                        trend: "down",
                      },
                      {
                        label: "Return Rate",
                        value: "1.8%",
                        change: "-0.3%",
                        trend: "down",
                      },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              {metric.label}
                            </p>
                            <p className="text-xl font-bold text-gray-900 mt-1">
                              {metric.value}
                            </p>
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              metric.trend === "up"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {metric.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Quick Stats Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>
                  Store Status:{" "}
                  <span className="font-medium text-gray-900">Online</span>
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
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SellersDashboard;
