import React, { useState, useEffect } from "react";
import { Package, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { toast } from "sonner";
import { getMyOrdersApi } from "../../API/Order/orderApi";

export const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getMyOrdersApi();
        setOrders(res.orders || []);
      } catch (error) {
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "returned":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 relative">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
          <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            No orders yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            When you place an order, its details and tracking information will
            appear here.
          </p>
          <Link to="/">
            <button className="mt-6 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-md">
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Order #{order._id.substring(0, 8)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <div className="mt-3 flex -space-x-2 overflow-hidden">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <img
                      key={idx}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      src={
                        item.productId?.images?.[0] ||
                        "https://placehold.co/100x100?text=No+Img"
                      }
                      alt="Product"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6">
                <div className="text-left md:text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Total Amount
                  </p>
                  <p className="text-xl font-black text-primary">
                    ₹{order.totalAmount.toLocaleString()}
                  </p>
                </div>
                {/* NAVIGATE TO NEW PAGE */}
                <button
                  onClick={() => navigate(`/user/order/${order._id}`)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye size={16} /> Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
