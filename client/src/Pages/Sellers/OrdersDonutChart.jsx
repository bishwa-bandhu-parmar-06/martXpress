import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getSellerOrdersApi } from "../../API/Sellers/SellersApi.js";

/* ── Shared Colors ────────────────────────────────────────────────── */
const PIE_COLORS = [
  "#7C3AED",
  "#6366F1",
  "#0EA5E9",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#EF4444",
];

/* ── Orders Donut (Now fetches real order status from DB) ────────── */
export const OrdersDonutChart = () => {
  const [donutData, setDonutData] = useState([]);

  useEffect(() => {
    // Fetch real orders and calculate status breakdown
    getSellerOrdersApi()
      .then((res) => {
        if (res.orders) {
          const statuses = {
            Delivered: 0,
            Processing: 0,
            Pending: 0,
            Cancelled: 0,
            Shipped: 0,
          };
          res.orders.forEach((o) => {
            const s = o.orderStatus
              ? o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)
              : "Pending";
            if (statuses[s] !== undefined) statuses[s]++;
            else statuses[s] = 1;
          });

          const colorMap = {
            Delivered: "#10B981",
            Shipped: "#6366F1",
            Processing: "#0EA5E9",
            Pending: "#F59E0B",
            Cancelled: "#EF4444",
          };

          const formattedData = Object.keys(statuses)
            .filter((k) => statuses[k] > 0)
            .map((k) => ({
              name: k,
              value: statuses[k],
              color: colorMap[k] || "#7C3AED",
            }));

          setDonutData(formattedData);
        }
      })
      .catch(console.error);
  }, []);

  const total = donutData.reduce((sum, item) => sum + item.value, 0);

  const DonutTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white dark:bg-[#1E2238] border border-gray-100 dark:border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs z-50">
          <p style={{ color: payload[0].payload.color }} className="font-bold">
            {payload[0].name}: {payload[0].value} Orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
        Order Status
      </h3>
      <p className="text-xs text-gray-400 mb-4">Current order distribution</p>

      {donutData.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
          No orders yet
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<DonutTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {donutData.map(({ name, value, color }) => (
              <div key={name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {name}
                </span>
                <span className="ml-auto text-xs font-bold text-gray-700 dark:text-gray-200">
                  {total > 0 ? Math.round((value / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ── Category Performance Bar (Takes dynamic data from parent) ───── */
export const CategoryChart = ({ categoryData = [] }) => {
  // Map colors for the bar chart
  const displayData = categoryData.slice(0, 5).map((cat, i) => ({
    ...cat,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  return (
    <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
        Top Categories
      </h3>
      <p className="text-xs text-gray-400 mb-4">Revenue by category</p>

      {displayData.length === 0 ? (
        <div className="h-46.25 flex items-center justify-center text-gray-400 text-sm">
          No sales data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={185}>
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            barSize={10}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#f0f0f0"
              className="dark:stroke:#ffffff0d"
            />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip
              cursor={{ fill: "rgba(124,58,237,0.05)" }}
              contentStyle={{
                background: "var(--chart-tooltip-bg, white)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 10,
                fontSize: 11,
                zIndex: 50,
              }}
              formatter={(val) => [`₹${val.toLocaleString()}`, "Revenue"]}
            />
            <Bar
              dataKey="value"
              fill="#7C3AED"
              radius={[0, 6, 6, 0]}
              name="Revenue"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
