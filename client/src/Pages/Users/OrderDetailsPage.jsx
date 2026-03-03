import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Loader2,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import {
  getOrderByIdApi,
  cancelOrderApi,
  requestReturnApi,
} from "../../API/Order/orderApi";
import { InvoiceDownloader } from "./InvoiceDownloader"; 

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await getOrderByIdApi(orderId);
      setOrder(res.order);
    } catch (error) {
      toast.error("Failed to load order details");
      navigate("/users/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrderDetails();
  }, [orderId]);

  // --- ACTIONS ---
  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setActionLoading(true);
      await cancelOrderApi(orderId);
      toast.success("Order cancelled successfully");
      fetchOrderDetails(); // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnOrder = async () => {
    if (!window.confirm("Are you sure you want to request a return/exchange?"))
      return;
    try {
      setActionLoading(true);
      await requestReturnApi(orderId);
      toast.success("Return request submitted successfully");
      fetchOrderDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request return");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  // Determine which actions are allowed based on status
  const canCancel = ["pending", "processing"].includes(
    order.orderStatus.toLowerCase(),
  );
  const canReturn = order.orderStatus.toLowerCase() === "delivered";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">
                Order Details
              </h1>
              <p className="text-sm text-gray-500 font-mono mt-1">
                ID: {order._id}
              </p>
            </div>
          </div>
          <InvoiceDownloader order={order} />
        </div>

        <div className="space-y-6">
          {/* TRACKING STATUS */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider">
              Tracking Status
            </h2>
            <div className="flex items-center justify-between relative max-w-3xl mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full z-0"></div>

              {/* Placed */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 ${order.orderStatus !== "cancelled" ? "bg-primary text-white" : "bg-gray-300 text-gray-500"}`}
                >
                  <Package size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Placed
                </span>
              </div>

              {/* Shipped */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 ${["shipped", "delivered", "returned"].includes(order.orderStatus.toLowerCase()) ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}
                >
                  <Truck size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Shipped
                </span>
              </div>

              {/* Delivered */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 ${["delivered", "returned"].includes(order.orderStatus.toLowerCase()) ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-400"}`}
                >
                  <CheckCircle size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Delivered
                </span>
              </div>
            </div>

            {/* Status Messages */}
            {order.orderStatus.toLowerCase() === "cancelled" && (
              <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center gap-3 font-semibold border border-red-100 dark:border-red-900/50">
                <XCircle size={24} /> This order has been cancelled.
              </div>
            )}
            {order.orderStatus.toLowerCase() === "returned" && (
              <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center gap-3 font-semibold border border-purple-100 dark:border-purple-900/50">
                <RefreshCcw size={24} /> A return/exchange has been processed
                for this order.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: Items & Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                  Items Ordered
                </h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 items-center border-b border-gray-50 dark:border-gray-700/50 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shrink-0">
                        <img
                          src={
                            item.productId?.images?.[0] ||
                            "https://placehold.co/100x100?text=No+Img"
                          }
                          alt={item.productId?.name}
                          className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                          {item.productId?.name || "Product Unavailable"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-lg font-black text-primary shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* USER ACTIONS (Cancel / Return) */}
              {(canCancel || canReturn) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <AlertTriangle className="text-orange-500" />
                    <span className="text-sm font-medium">
                      Need to make changes to your order?
                    </span>
                  </div>

                  {canCancel && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={actionLoading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 size={18} className="animate-spin inline" />
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  )}

                  {canReturn && (
                    <button
                      onClick={handleReturnOrder}
                      disabled={actionLoading}
                      className="w-full sm:w-auto px-6 py-2.5 bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 rounded-xl font-bold transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 size={18} className="animate-spin inline" />
                      ) : (
                        "Return / Exchange"
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Address & Summary */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-gray-400" /> Delivery
                  Address
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                  <p className="font-bold text-gray-900 dark:text-white text-base">
                    {order.shippingAddress?.fullName}
                  </p>
                  <p>
                    {order.shippingAddress?.house},{" "}
                    {order.shippingAddress?.street}
                  </p>
                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state} -{" "}
                    {order.shippingAddress?.pincode}
                  </p>
                  <p className="pt-2 font-medium">
                    Phone: {order.shippingAddress?.mobile}
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-gray-400" /> Payment
                  Summary
                </h2>
                <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Method
                    </span>
                    <span className="font-bold dark:text-white">
                      {order.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status
                    </span>
                    <span
                      className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${order.paymentStatus === "completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-2xl font-black text-primary">
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
