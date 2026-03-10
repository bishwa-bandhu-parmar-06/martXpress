import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Star,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronRight,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

// Import your API functions
import {
  getAllProductsOfLoggedInSeller,
  deleteProductsForLoggedInSeller,
} from "../../API/ProductsApi/productsAPI.js";
import { getSellerOrdersApi } from "../../API/Sellers/SellersApi.js";

const ProductsList = ({ onAddProduct, onNavigate }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch both products and orders simultaneously for better performance
      const [productsRes, ordersRes] = await Promise.all([
        getAllProductsOfLoggedInSeller(1, 5), // Get top 5 recent products
        getSellerOrdersApi(), // Get seller orders
      ]);

      if (productsRes?.products) {
        setProducts(productsRes.products.slice(0, 5));
      }
      if (ordersRes?.orders) {
        setOrders(ordersRes.orders.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setDeleteLoading(productId);
    try {
      await deleteProductsForLoggedInSeller(productId);
      toast.success("Product deleted successfully");
      // Remove from local state to update UI instantly
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      toast.error(error?.message || "Failed to delete product");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Reusable Status Badge Component
  const StatusBadge = ({ status, type = "product" }) => {
    const normalizedStatus = status?.toLowerCase() || "pending";

    let config = {
      bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
      icon: AlertCircle,
    };

    if (type === "product") {
      if (normalizedStatus === "active")
        config = {
          bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
          icon: CheckCircle,
        };
      else if (normalizedStatus === "inactive")
        config = {
          bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
          icon: XCircle,
        };
      else if (normalizedStatus === "out of stock")
        config = {
          bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: AlertCircle,
        };
    } else {
      if (normalizedStatus === "pending")
        config = {
          bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
          icon: Clock,
        };
      else if (normalizedStatus === "processing")
        config = {
          bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          icon: Truck,
        };
      else if (normalizedStatus === "shipped")
        config = {
          bg: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
          icon: Truck,
        };
      else if (normalizedStatus === "delivered")
        config = {
          bg: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
          icon: CheckCircle,
        };
      else if (normalizedStatus === "cancelled")
        config = {
          bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
          icon: XCircle,
        };
    }

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold capitalize ${config.bg}`}
      >
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ===================== TOP PRODUCTS CARD ===================== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Products
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Your latest additions
            </p>
          </div>
          <button
            onClick={onAddProduct}
            className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add New
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-white dark:bg-gray-800 text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Price / Stock</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-gray-600">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate max-w-30 md:max-w-40">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-[10px] text-gray-500 font-medium">
                              {product.averageRating || "0.0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{(product.finalPrice || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {product.stock} in stock
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={product.status} type="product" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onNavigate("products")} // Assuming "products" tab handles editing in full view
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deleteLoading === product._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === product._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    No products added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Link */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 text-center">
          <button
            onClick={() => onNavigate("products")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All Products
          </button>
        </div>
      </div>

      {/* ===================== RECENT ORDERS CARD ===================== */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Latest customer purchases
            </p>
          </div>
          <button
            onClick={() => onNavigate("orders")}
            className="text-xs p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-white dark:bg-gray-800 text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-5 py-3 font-semibold">Order / Customer</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        #{order._id.substring(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-30">
                        {order.shippingAddress?.fullName || "Unknown"}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{(order.sellerTotalAmount || 0).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {order.items?.length || 0} items
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.orderStatus} type="order" />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => onNavigate("orders")}
                        className="p-1.5 inline-flex text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Link */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 text-center">
          <button
            onClick={() => onNavigate("orders")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Manage All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
