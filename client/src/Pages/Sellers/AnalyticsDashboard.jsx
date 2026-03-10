import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  Star,
} from "lucide-react";

import { getSellerAnalyticsApi } from "../../API/Sellers/SellersApi.js"; // Adjust path if needed

/* ── Predefined Colors for Category Pie Chart ───────────────────── */
const PIE_COLORS = [
  "#7C3AED",
  "#6366F1",
  "#0EA5E9",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#EF4444",
];

/* ── Shared custom tooltip ────────────────────────────────────────── */
const ChartTooltip = ({
  active,
  payload,
  label,
  prefix = "₹",
  suffix = "",
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1E2238] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 shadow-xl text-xs z-50 relative">
      <p className="font-bold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {prefix}
          {Number(p.value).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}
          {suffix}
        </p>
      ))}
    </div>
  );
};

/* ── Metric card ─────────────────────────────────────────────────── */
const MetricCard = ({ title, value, change, icon: Icon, color }) => {
  const up = !change?.toString().startsWith("-");
  return (
    <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
            {value}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            {up ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            >
              {change}
            </span>
            <span className="text-xs text-gray-400">vs last year</span>
          </div>
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
};

/* ── Main component ──────────────────────────────────────────────── */
const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [revView, setRevView] = useState("revenue");

  // Real State Data
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProfit: 0,
    avgRating: "0.0",
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getSellerAnalyticsApi();
      if (data.success) {
        setMonthlyRevenue(data.monthlyRevenue);
        setRatingData(data.ratingData);
        setKpis(data.kpis);

        // Map dynamic categories to predefined colors
        const mappedCategories = data.categorySales.map((cat, index) => ({
          ...cat,
          color: PIE_COLORS[index % PIE_COLORS.length],
        }));
        setCategorySales(mappedCategories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Performance insights for your MartXpress store
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`₹${kpis.totalRevenue >= 100000 ? (kpis.totalRevenue / 100000).toFixed(2) + "L" : kpis.totalRevenue.toLocaleString()}`}
          change="+12.5%"
          icon={IndianRupee}
          color="bg-gradient-to-br from-violet-500 to-indigo-600"
        />
        <MetricCard
          title="Total Orders"
          value={kpis.totalOrders.toLocaleString()}
          change="+8.2%"
          icon={ShoppingBag}
          color="bg-gradient-to-br from-blue-500 to-cyan-600"
        />
        <MetricCard
          title="Est. Net Profit"
          value={`₹${kpis.totalProfit >= 100000 ? (kpis.totalProfit / 100000).toFixed(2) + "L" : kpis.totalProfit.toLocaleString()}`}
          change="+15.3%"
          icon={TrendingUp}
          color="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <MetricCard
          title="Avg. Rating"
          value={kpis.avgRating}
          change="+0.3"
          icon={Star}
          color="bg-gradient-to-br from-amber-400 to-orange-500"
        />
      </div>

      {/* Revenue & Profit chart */}
      <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              Revenue & Profit — {new Date().getFullYear()}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Monthly breakdown across the year
            </p>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-1 self-start sm:self-auto">
            {["revenue", "profit", "orders"].map((v) => (
              <button
                key={v}
                onClick={() => setRevView(v)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize ${
                  revView === v
                    ? "bg-white dark:bg-white/10 text-violet-700 dark:text-violet-400 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={monthlyRevenue}
            margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              className="dark:stroke:#ffffff0d"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              width={45}
              tickFormatter={(v) =>
                revView === "orders" ? v : `₹${(v / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              content={
                <ChartTooltip prefix={revView === "orders" ? "" : "₹"} />
              }
            />
            <Area
              type="monotone"
              dataKey={revView}
              stroke={revView === "profit" ? "#10B981" : "#7C3AED"}
              strokeWidth={2.5}
              fill={revView === "profit" ? "url(#grad2)" : "url(#grad1)"}
              name={revView.charAt(0).toUpperCase() + revView.slice(1)}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Category distribution */}
        <div className="lg:col-span-1 bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
            Sales by Category
          </h3>
          <p className="text-xs text-gray-400 mb-4">Revenue distribution</p>

          {categorySales.length === 0 ? (
            <div className="h-50 flex items-center justify-center text-gray-400 text-sm">
              No sales data yet
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categorySales.map((e, i) => (
                      <Cell key={i} fill={e.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`₹${v.toLocaleString()}`, n]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2 mt-2 max-h-24 overflow-y-auto custom-scrollbar">
                {categorySales.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm shrink-0"
                      style={{ background: color }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">
                      {name}
                    </span>
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      ₹{value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Monthly orders bar */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm flex flex-col">
          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
            Monthly Orders
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Order volume across {new Date().getFullYear()}
          </p>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={monthlyRevenue}
              margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
              barSize={20}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                className="dark:stroke:#ffffff0d"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "none",
                  fontSize: 11,
                }}
                cursor={{ fill: "rgba(124,58,237,0.05)" }}
              />
              <Bar
                dataKey="orders"
                fill="#7C3AED"
                radius={[4, 4, 0, 0]}
                name="Orders"
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Rating trend */}
          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Rating Trend (8 weeks)
              </p>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
                {kpis.avgRating} avg
              </span>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <LineChart
                data={ratingData}
                margin={{ top: 0, right: 5, bottom: 0, left: 0 }}
              >
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "none",
                    fontSize: 11,
                  }}
                  formatter={(v) => [Number(v).toFixed(1) + " ★", "Rating"]}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
