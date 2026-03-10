import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1E2238] border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 shadow-xl text-xs z-50 relative">
        <p className="font-bold text-gray-700 dark:text-gray-200 mb-2">
          {label}
        </p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name === "revenue"
              ? `₹${p.value.toLocaleString()}`
              : `${p.value} orders`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Takes "data" from parent (OverviewPage)
const RevenueChart = ({ data = [] }) => {
  const [metric, setMetric] = useState("revenue");

  // Fallback for empty data
  const chartData =
    data.length > 0
      ? data
      : [
          { month: "Jan", revenue: 0, orders: 0 },
          { month: "Feb", revenue: 0, orders: 0 },
        ];

  return (
    <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Revenue Overview
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your earnings this year
          </p>
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-1">
          {["revenue", "orders"].map((p) => (
            <button
              key={p}
              onClick={() => setMetric(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer capitalize ${
                metric === p
                  ? "bg-white dark:bg-white/10 text-violet-700 dark:text-violet-400 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={metric === "revenue" ? "#7C3AED" : "#0EA5E9"}
                stopOpacity={0.2}
              />
              <stop
                offset="95%"
                stopColor={metric === "revenue" ? "#7C3AED" : "#0EA5E9"}
                stopOpacity={0}
              />
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
            tickFormatter={(v) =>
              metric === "revenue" ? `₹${(v / 1000).toFixed(0)}k` : v
            }
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={metric === "revenue" ? "#7C3AED" : "#0EA5E9"}
            strokeWidth={2}
            fill="url(#revenueGrad)"
            name={metric}
            dot={false}
            activeDot={{
              r: 4,
              fill: metric === "revenue" ? "#7C3AED" : "#0EA5E9",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary row */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
        <div>
          <p className="text-xs text-gray-400">Total Revenue (YTD)</p>
          <p className="font-bold text-gray-900 dark:text-white">
            ₹
            {chartData
              .reduce((s, d) => s + (d.revenue || 0), 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total Orders (YTD)</p>
          <p className="font-bold text-gray-900 dark:text-white">
            {chartData
              .reduce((s, d) => s + (d.orders || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
