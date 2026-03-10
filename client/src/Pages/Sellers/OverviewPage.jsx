import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  RefreshCw,
  Calendar,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import StatsCard from "./StatsCard.jsx";
import RevenueChart from "./RevenueChart.jsx";
import { OrdersDonutChart, CategoryChart } from "./OrdersDonutChart.jsx";
import RecentOrdersWidget from "./RecentOrdersWidget.jsx";
import TopProductsWidget from "./TopProductsWidget.jsx";
import ActivityFeed from "./ActivityFeed.jsx";

// Import APIs
import { getSellerOrdersApi } from "../../API/Sellers/SellersApi.js";
import { getAllProductsOfLoggedInSeller } from "../../API/ProductsApi/productsAPI.js";
import { getSellerAnalyticsApi } from "../../API/Sellers/SellersApi.js"; // The new API!

const OverviewPage = ({ seller, onNavigate, onAddProduct, onEditProduct }) => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0,
  });

  // States to pass down to charts
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [productsRes, analyticsRes] = await Promise.all([
        getAllProductsOfLoggedInSeller(1, 100),
        getSellerAnalyticsApi(), // Fetch the real aggregated data!
      ]);

      const products = productsRes.products ?? [];
      const analytics = analyticsRes.success ? analyticsRes : null;

      if (analytics) {
        setStats({
          revenue: analytics.kpis.totalRevenue,
          orders: analytics.kpis.totalOrders,
          products: products.filter((p) => p.status === "active").length,
          customers: analytics.kpis.totalOrders, // Simplification: estimating 1 order = 1 customer for now
        });
        setMonthlyRevenue(analytics.monthlyRevenue);
        setCategorySales(analytics.categorySales);
      }

      if (isRefresh) toast.success("Dashboard refreshed!");
    } catch (err) {
      console.error(err);
      if (isRefresh) toast.error("Failed to refresh.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const STATS = [
    {
      key: "revenue",
      title: "Total Revenue",
      icon: IndianRupee,
      gradient: "bg-gradient-to-br from-violet-500 to-indigo-600",
      format: (v) => `₹${(v ?? 0).toLocaleString()}`,
    },
    {
      key: "orders",
      title: "Total Orders",
      icon: ShoppingBag,
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
      format: (v) => (v ?? 0).toLocaleString(),
    },
    {
      key: "products",
      title: "Active Products",
      icon: Package,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      format: (v) => (v ?? 0).toLocaleString(),
    },
    {
      key: "customers",
      title: "Est. Customers",
      icon: Users,
      gradient: "bg-gradient-to-br from-orange-500 to-rose-500",
      format: (v) => (v ?? 0).toLocaleString(),
    },
  ];

  const isPending = seller?.verified === "pending";
  const isRejected = seller?.verified === "rejected";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Welcome back, {seller?.name?.split(" ")[0] ?? "Seller"} 👋
          </h1>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <button
          onClick={() => loadStats(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* ── Verification banners ─────────────────────────────────── */}
      {isPending && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
          <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
              Account Under Review
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Your seller profile is being verified by MartXpress admin. You'll
              be notified once approved.
            </p>
          </div>
        </div>
      )}
      {isRejected && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
          <Shield className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-800 dark:text-red-300">
              Account Rejected
            </p>
            <p className="text-xs text-red-700 dark:text-red-400">
              Your profile was rejected. Please contact support@martxpress.in
              for assistance.
            </p>
          </div>
        </div>
      )}

      {/* ── KPI Stats ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ key, title, icon, gradient, format }) => (
          <StatsCard
            key={key}
            title={title}
            value={format(stats[key])}
            icon={icon}
            gradient={gradient}
            loading={loading}
          />
        ))}
      </div>

      {/* ── Charts Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {/* Pass dynamic data down */}
          <RevenueChart data={monthlyRevenue} />
        </div>
        {/* Pass dynamic category data down */}
        <OrdersDonutChart categoryData={categorySales} />
      </div>

      {/* ── Products + Orders + Activity ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopProductsWidget
          onNavigate={onNavigate}
          onAddProduct={onAddProduct}
        />
        <RecentOrdersWidget onNavigate={onNavigate} />
        <div className="space-y-4">
          {/* Pass dynamic category data down */}
          <CategoryChart categoryData={categorySales} />
        </div>
      </div>

      {/* ── Activity Feed ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed />

        {/* Quick Actions Card */}
        <div className="bg-linear-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-violet-500/20 text-white">
          <h3 className="font-bold text-base mb-1">Quick Actions</h3>
          <p className="text-violet-200 text-xs mb-5">
            Manage your store efficiently
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Add Product", action: onAddProduct, icon: "📦" },
              {
                label: "View Orders",
                action: () => onNavigate("orders"),
                icon: "📋",
              },
              {
                label: "Analytics",
                action: () => onNavigate("analytics"),
                icon: "📊",
              },
              {
                label: "Settings",
                action: () => onNavigate("settings"),
                icon: "⚙️",
              },
            ].map(({ label, action, icon }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-2.5 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-all cursor-pointer backdrop-blur-sm border border-white/10 hover:border-white/20 hover:-translate-y-0.5"
              >
                <span className="text-base">{icon}</span> {label}
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-violet-200">
              Shop:{" "}
              <span className="font-semibold text-white">
                {seller?.shopName ?? "—"}
              </span>
            </p>
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${seller?.verified === "approved" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}
            >
              {seller?.verified === "approved" ? "✓ Verified" : "⏳ Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
