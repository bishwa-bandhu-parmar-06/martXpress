import React, { useEffect, useState } from "react";
import {
  getAdminProfile,
  getPendingAccountForSellers,
  getApprovedAccountOfSellers,
  getRejectededAccountOfSellers,
  approveAccountOfSellers,
  rejectAccountOfSellers,
  deleteSellersAccountBySellersId,
  getAdminDashboardStats,
  getSellersAccountBySellersId,
  // We'll add more API functions for other features
} from "../../API/Admin/adminApi";
import FileLoader from "../../Components/Common/Loader/FileLoader";
import { Button } from "../../Components/ui/button";
import { removeAuthToken, removeUserRole } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  LogOut,
  Users,
  UserCheck,
  UserX,
  BarChart3,
  User,
  Mail,
  Shield,
  LayoutDashboard,
  ShoppingBag,
  Package,
  DollarSign,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  Users as UsersIcon,
  ShoppingCart,
  PieChart,
  BarChart,
  LineChart,
  Tag,
  Truck,
  MessageSquare,
  CreditCard,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Globe,
  Star,
  AlertCircle,
  CheckSquare,
  XSquare,
  MoreHorizontal,
  EyeOff,
  Lock,
  Unlock,
  Edit,
} from "lucide-react";
import { Badge } from "../../Components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../Components/ui/avatar";
import { Input } from "../../Components/ui/input";
import { Separator } from "../../Components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../Components/ui/tabs";
import { Progress } from "../../Components/ui/progress";

// Chart components (install recharts: npm install recharts)
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [rejectedSellers, setRejectedSellers] = useState([]);
  const [approvedSellers, setApprovedSellers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("month");

  // Additional state for comprehensive e-commerce features
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New seller registration",
      time: "10 min ago",
      read: false,
    },
    { id: 2, message: "Order #1234 completed", time: "1 hour ago", read: true },
    {
      id: 3,
      message: "Low stock alert: Product XYZ",
      time: "2 hours ago",
      read: false,
    },
  ]);

  // Mock data for charts (replace with actual API data)
  const salesData = [
    { month: "Jan", sales: 4000, orders: 240 },
    { month: "Feb", sales: 3000, orders: 139 },
    { month: "Mar", sales: 2000, orders: 980 },
    { month: "Apr", sales: 2780, orders: 390 },
    { month: "May", sales: 1890, orders: 480 },
    { month: "Jun", sales: 2390, orders: 380 },
    { month: "Jul", sales: 3490, orders: 430 },
  ];

  const categoryData = [
    { name: "Electronics", value: 35, color: "#0088FE" },
    { name: "Fashion", value: 25, color: "#00C49F" },
    { name: "Home & Kitchen", value: 20, color: "#FFBB28" },
    { name: "Books", value: 15, color: "#FF8042" },
    { name: "Sports", value: 5, color: "#8884d8" },
  ];

  const userGrowthData = [
    { month: "Jan", sellers: 40, customers: 200 },
    { month: "Feb", sellers: 60, customers: 350 },
    { month: "Mar", sellers: 85, customers: 500 },
    { month: "Apr", sellers: 110, customers: 750 },
    { month: "May", sellers: 150, customers: 1000 },
    { month: "Jun", sellers: 180, customers: 1250 },
    { month: "Jul", sellers: 220, customers: 1500 },
  ];

  const topProducts = [
    { id: 1, name: "Wireless Headphones", sales: 1250, revenue: 62500 },
    { id: 2, name: "Smart Watch", sales: 980, revenue: 49000 },
    { id: 3, name: "Laptop Stand", sales: 750, revenue: 22500 },
    { id: 4, name: "Phone Case", sales: 2000, revenue: 20000 },
    { id: 5, name: "Coffee Maker", sales: 450, revenue: 45000 },
  ];

  // Navigation menu items
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "sellers",
      label: "Sellers",
      icon: <Users size={20} />,
      badge: pendingSellers.length,
    },
    { id: "products", label: "Products", icon: <Package size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
    { id: "customers", label: "Customers", icon: <UsersIcon size={20} /> },
    {
      id: "transactions",
      label: "Transactions",
      icon: <DollarSign size={20} />,
    },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={20} /> },
    { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
    { id: "marketing", label: "Marketing", icon: <TrendingUp size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [adminRes, pendingRes, approvedRes, rejectedRes, statsRes] =
          await Promise.all([
            getAdminProfile(),
            getPendingAccountForSellers(),
            getApprovedAccountOfSellers(),
            getRejectededAccountOfSellers(),
            getAdminDashboardStats(),
          ]);

        setAdmin(adminRes.admin);
        setPendingSellers(pendingRes.sellers || []);
        setApprovedSellers(approvedRes.sellers || []);
        setRejectedSellers(rejectedRes.sellers || []);
        // setDashboardStats(statsRes);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleApproveSeller = async (sellerId) => {
    try {
      const response = await approveAccountOfSellers(sellerId);
      // Refresh the lists
      const [pendingRes, approvedRes] = await Promise.all([
        getPendingAccountForSellers(),
        getApprovedAccountOfSellers(),
      ]);
      setPendingSellers(pendingRes.sellers || []);
      setApprovedSellers(approvedRes.sellers || []);
    } catch (err) {
      alert("Failed to approve seller");
      console.error(err);
    }
  };

  const handleRejectSeller = async (sellerId) => {
    try {
      await rejectAccountOfSellers(sellerId);
      // Refresh the lists
      const [pendingRes, rejectedRes] = await Promise.all([
        getPendingAccountForSellers(),
        getRejectededAccountOfSellers(),
      ]);
      setPendingSellers(pendingRes.sellers || []);
      setRejectedSellers(rejectedRes.sellers || []);
    } catch (err) {
      alert("Failed to reject seller");
      console.error(err);
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    
      try {
        await deleteSellersAccountBySellersId(sellerId);
        // Refresh all seller lists
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          getPendingAccountForSellers(),
          getApprovedAccountOfSellers(),
          getRejectededAccountOfSellers(),
        ]);
        setPendingSellers(pendingRes.sellers || []);
        setApprovedSellers(approvedRes.sellers || []);
        setRejectedSellers(rejectedRes.sellers || []);
      } catch (err) {
        alert("Failed to delete seller");
        console.error(err);
      }

  };

  const handleViewSellerDetails = async (sellerId) => {
    try {
      const res = await getSellersAccountBySellersId(sellerId);
      setSelectedSeller(res.seller);
    } catch (err) {
      alert("Failed to load seller details");
      console.error(err);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeUserRole();
    navigate("/");
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes, rejectedRes, statsRes] =
        await Promise.all([
          getPendingAccountForSellers(),
          getApprovedAccountOfSellers(),
          getRejectededAccountOfSellers(),
          getAdminDashboardStats(),
        ]);
      setPendingSellers(pendingRes.sellers || []);
      setApprovedSellers(approvedRes.sellers || []);
      setRejectedSellers(rejectedRes.sellers || []);
      // setDashboardStats(statsRes);
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  if (loading) return <FileLoader />;
  if (error) return <h2 className="p-4 text-red-500">{error}</h2>;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Revenue
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        $45,231
                      </h3>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp size={14} className="mr-1" /> +20.1% from
                        last month
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <DollarSign
                        className="text-blue-600 dark:text-blue-400"
                        size={24}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Orders
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        2,350
                      </h3>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp size={14} className="mr-1" /> +12.5% from
                        last month
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <ShoppingCart
                        className="text-green-600 dark:text-green-400"
                        size={24}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Active Customers
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        12,543
                      </h3>
                      <p className="text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp size={14} className="mr-1" /> +8.2% from
                        last month
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Users
                        className="text-purple-600 dark:text-purple-400"
                        size={24}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Conversion Rate
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        4.35%
                      </h3>
                      <p className="text-sm text-red-600 flex items-center mt-1">
                        <TrendingUp size={14} className="mr-1 rotate-180" />{" "}
                        -1.2% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <BarChart3
                        className="text-orange-600 dark:text-orange-400"
                        size={24}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Sales Trend Chart */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <LineChart size={20} />
                      Sales Trend
                    </span>
                    <select
                      className="text-sm border rounded-lg px-3 py-1 bg-transparent"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </select>
                  </CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#4B5563",
                            color: "#F9FAFB",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="orders"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* User Growth Chart */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    User Growth
                  </CardTitle>
                  <CardDescription>Sellers vs Customers growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#4B5563",
                            color: "#F9FAFB",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="sellers"
                          fill="#8B5CF6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="customers"
                          fill="#10B981"
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart size={20} />
                    Category Distribution
                  </CardTitle>
                  <CardDescription>Sales by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1F2937",
                            borderColor: "#4B5563",
                            color: "#F9FAFB",
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Top Performing Products
                  </CardTitle>
                  <CardDescription>Best selling products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Package
                              className="text-blue-600 dark:text-blue-400"
                              size={18}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {product.sales} units sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ${product.revenue.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Revenue
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell size={20} />
                    Recent Activity
                  </span>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${notification.read ? "bg-transparent" : "bg-blue-50 dark:bg-blue-900/20"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.read ? "bg-gray-200 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-800"}`}
                        >
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        );

      case "sellers":
        return (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Search sellers..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter size={16} />
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Calendar size={16} />
                      Date Range
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Tabs */}
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="pending"
                  className="flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  Pending ({pendingSellers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="approved"
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Approved ({approvedSellers.length})
                </TabsTrigger>
                <TabsTrigger
                  value="rejected"
                  className="flex items-center gap-2"
                >
                  <XCircle size={16} />
                  Rejected ({rejectedSellers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingSellers.map((seller) => (
                  <Card key={seller._id} className="dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {seller.name?.charAt(0) || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {seller.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {seller.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200"
                              >
                                Pending Review
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Registered:{" "}
                                {new Date(
                                  seller.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSellerDetails(seller._id)}
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveSeller(seller._id)}
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                            onClick={() => handleRejectSeller(seller._id)}
                          >
                            <XCircle size={14} className="mr-1" />
                            Reject
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="approved">
                {approvedSellers.map((seller) => (
                  <Card key={seller._id} className="dark:bg-gray-800 mb-4">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              {seller.name?.charAt(0) || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {seller.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {seller.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200"
                              >
                                Active
                              </Badge>
                              <Badge variant="outline">Products: 24</Badge>
                              <Badge variant="outline">Sales: $12,450</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSellerDetails(seller._id)}
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                            onClick={() => handleDeleteSeller(seller._id)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="rejected">
                {rejectedSellers.map((seller) => (
                  <Card key={seller._id} className="dark:bg-gray-800 mb-4">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              {seller.name?.charAt(0) || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {seller.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {seller.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                variant="outline"
                                className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200"
                              >
                                Rejected
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Rejected on: {new Date().toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSellerDetails(seller._id)}
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                            onClick={() => handleDeleteSeller(seller._id)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        );

      // Add more cases for other tabs (products, orders, etc.)
      default:
        return (
          <Card className="dark:bg-gray-800">
            <CardHeader>
              <CardTitle>
                {navItems.find((item) => item.id === activeTab)?.label} Content
              </CardTitle>
              <CardDescription>
                This section is under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                The{" "}
                {navItems
                  .find((item) => item.id === activeTab)
                  ?.label.toLowerCase()}{" "}
                management features will be implemented here.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {sidebarCollapsed ? "A" : "Admin Panel"}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              PRO
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              v2.5.1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshData}
            className="hidden md:flex"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>

          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">
                {admin?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {admin?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {admin?.role}
              </p>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            {!sidebarCollapsed && "Logout"}
          </Button>
        </div>
      </div>

      {/* Sidebar and Main Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <div
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="p-4">
            <div className={`${sidebarCollapsed ? "px-2" : "px-4"} mb-6`}>
              <Button
                variant="ghost"
                size="icon"
                className="w-full"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? (
                  <ChevronRight size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </Button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-2" : "justify-start px-4"} py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!sidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && item.badge && item.badge > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>

            <Separator className="my-6" />

            {/* Quick Stats in Sidebar */}
            {!sidebarCollapsed && dashboardStats && (
              <div className="px-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Sellers
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {dashboardStats.totalSellers || 0}
                      </span>
                    </div>
                    <Progress value={75} className="h-1" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Approval Rate
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {approvedSellers.length}/
                        {approvedSellers.length + rejectedSellers.length || 0}
                      </span>
                    </div>
                    <Progress value={85} className="h-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <div className="p-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {navItems.find((item) => item.id === activeTab)?.label}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === "dashboard"
                    ? "Welcome back! Here's what's happening with your store today."
                    : `Manage ${navItems.find((item) => item.id === activeTab)?.label.toLowerCase()} from here.`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {activeTab === "dashboard" && (
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Last 30 Days
                  </Button>
                )}
                <Button className="flex items-center gap-2">
                  <Download size={16} />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Render Content Based on Active Tab */}
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center justify-between">
                <span>Seller Details</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSeller(null)}
                >
                  X
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Personal Information
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedSeller.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {selectedSeller.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-gray-400" />
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            selectedSeller.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : selectedSeller.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {selectedSeller.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Statistics
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Products
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        24
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Sales
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        $12,450
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Conversion Rate
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        4.2%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedSeller(null)}>
                Close
              </Button>
              {selectedSeller.status === "pending" && (
                <>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleApproveSeller(selectedSeller._id);
                      setSelectedSeller(null);
                    }}
                  >
                    Approve Seller
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                    onClick={() => {
                      handleRejectSeller(selectedSeller._id);
                      setSelectedSeller(null);
                    }}
                  >
                    Reject Seller
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
