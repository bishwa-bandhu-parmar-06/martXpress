/**
 * RecentOrdersWidget.jsx — Mini order table for the Overview page
 */
import React, { useEffect, useState } from "react";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { getSellerOrdersApi } from "../../API/Sellers/SellersApi.js";
import StatusBadge from "./StatusBadge.jsx";

const RecentOrdersWidget = ({ onNavigate }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSellerOrdersApi()
      .then((res) => setOrders(res.orders?.slice(0, 5) ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Recent Orders
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest customer orders</p>
        </div>
        <button
          onClick={() => onNavigate("orders")}
          className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          View all <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingBag className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="h-9 w-9 shrink-0 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  #{order._id.substring(0, 10).toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {order.shippingAddress?.fullName ?? "Unknown"} ·{" "}
                  {order.items?.length ?? 0} items
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  ₹{(order.sellerTotalAmount ?? 0).toLocaleString()}
                </p>
                <StatusBadge status={order.orderStatus} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrdersWidget;
