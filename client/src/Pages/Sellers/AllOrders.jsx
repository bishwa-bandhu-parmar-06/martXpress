import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  EyeOff,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Package,
  MapPin,
  Phone,
} from "lucide-react";
import {
  getSellerOrdersApi,
  updateSellerOrderStatusApi,
} from "../../API/Sellers/SellersApi";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Track which order row is expanded to show product details
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getSellerOrdersApi();
      if (res.orders) {
        setOrders(res.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateSellerOrderStatusApi(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );
    } catch (error) {
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: Clock,
      },
      processing: {
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        icon: Truck,
      },
      shipped: {
        color:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        icon: Truck,
      },
      delivered: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle,
      },
      cancelled: {
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircle,
      },
    };

    const config = configs[status?.toLowerCase()] || configs.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold capitalize ${config.color}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {status}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.shippingAddress?.fullName || "";
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header & Filters */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Order Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track and process your specific products ordered by customers.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Your Earnings
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    {/* Main Row */}
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                            <ShoppingBag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              #{order._id.substring(0, 10).toUpperCase()}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                              {order.shippingAddress?.fullName || "Unknown"} •{" "}
                              {order.items?.length || 0} items
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-lg text-indigo-600 dark:text-indigo-400">
                        ₹{(order.sellerTotalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                          >
                            {expandedOrderId === order._id ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="hidden md:inline">
                              {expandedOrderId === order._id
                                ? "Hide Details"
                                : "View Details"}
                            </span>
                          </button>

                          {/* Dynamic Action Buttons */}
                          {order.orderStatus === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "processing")
                              }
                              disabled={updatingId === order._id}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {updatingId === order._id ? "..." : "Accept"}
                            </button>
                          )}
                          {order.orderStatus === "processing" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "shipped")
                              }
                              disabled={updatingId === order._id}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {updatingId === order._id ? "..." : "Ship"}
                            </button>
                          )}
                          {order.orderStatus === "shipped" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "delivered")
                              }
                              disabled={updatingId === order._id}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                            >
                              {updatingId === order._id ? "..." : "Deliver"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* EXPANDED ROW: Shows Customer Details & Product List */}
                    {expandedOrderId === order._id && (
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                        <td colSpan="5" className="p-0">
                          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                            {/* Left Col: Customer Info */}
                            <div className="md:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-indigo-500" />{" "}
                                Customer Details
                              </h4>
                              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <p>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    Name:
                                  </span>{" "}
                                  {order.shippingAddress?.fullName}
                                </p>
                                <p className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" />{" "}
                                  {order.shippingAddress?.mobile}
                                </p>
                                <p className="leading-relaxed">
                                  {order.shippingAddress?.house},{" "}
                                  {order.shippingAddress?.street}
                                  <br />
                                  {order.shippingAddress?.city},{" "}
                                  {order.shippingAddress?.state} -{" "}
                                  {order.shippingAddress?.pincode}
                                </p>
                                <p className="mt-2 text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded inline-block">
                                  Payment: {order.paymentMethod} (
                                  {order.paymentStatus})
                                </p>
                              </div>
                            </div>

                            {/* Right Col: Products Ordered */}
                            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Package className="h-4 w-4 text-indigo-500" />{" "}
                                Products Ordered From You
                              </h4>
                              <div className="space-y-4">
                                {order.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="h-14 w-14 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden shrink-0">
                                        <img
                                          src={
                                            item.productId?.images?.[0] ||
                                            "/placeholder.png"
                                          }
                                          alt={item.productId?.name}
                                          className="h-full w-full object-contain p-1"
                                        />
                                      </div>
                                      <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                                          {item.productId?.name ||
                                            "Product Name"}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          Brand:{" "}
                                          {item.productId?.brand || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        ₹{item.price.toLocaleString()}{" "}
                                        <span className="text-gray-500 font-normal">
                                          x {item.quantity}
                                        </span>
                                      </p>
                                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                        Total: ₹
                                        {(
                                          item.price * item.quantity
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
