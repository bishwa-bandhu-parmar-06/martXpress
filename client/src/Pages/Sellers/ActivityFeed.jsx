import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Package,
  Loader2,
  Activity,
} from "lucide-react";

import { getSellerOrdersApi } from "../../API/Sellers/SellersApi.js";
import { getAllProductsOfLoggedInSeller } from "../../API/ProductsApi/productsAPI.js";

// Helper function to calculate relative time (e.g., "10 min ago")
const timeAgo = (dateParam) => {
  const date = new Date(dateParam);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000;
  if (interval >= 1) return Math.floor(interval) + " yr ago";
  interval = seconds / 2592000;
  if (interval >= 1) return Math.floor(interval) + " mo ago";
  interval = seconds / 86400;
  if (interval >= 1) return Math.floor(interval) + " d ago";
  interval = seconds / 3600;
  if (interval >= 1) return Math.floor(interval) + " hr ago";
  interval = seconds / 60;
  if (interval >= 1) return Math.floor(interval) + " min ago";
  return "Just now";
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Fetch recent orders and products concurrently
        const [ordersRes, productsRes] = await Promise.all([
          getSellerOrdersApi(),
          getAllProductsOfLoggedInSeller(1, 10), // Fetch top 10 to get recent ones
        ]);

        const orders = ordersRes.orders || [];
        const products = productsRes.products || [];

        let combinedFeed = [];

        // 1. Format Orders for the feed
        orders.slice(0, 10).forEach((order) => {
          combinedFeed.push({
            id: `order-${order._id}`,
            dateObj: new Date(order.createdAt),
            icon: ShoppingBag,
            color: "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
            title: "New order received",
            desc: `Order #${order._id.substring(0, 8).toUpperCase()} placed`,
          });
        });

        // 2. Format Products for the feed
        products.slice(0, 10).forEach((product) => {
          combinedFeed.push({
            id: `product-${product._id}`,
            dateObj: new Date(product.createdAt),
            icon: CheckCircle2,
            color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
            title: "Product published",
            desc: `"${product.name}" is now live`,
          });
        });

        // 3. Sort chronologically (newest first)
        combinedFeed.sort((a, b) => b.dateObj - a.dateObj);

        // 4. Map the relative time and keep the top 6 events
        const formattedFeed = combinedFeed.slice(0, 6).map((act) => ({
          ...act,
          time: timeAgo(act.dateObj),
        }));

        setActivities(formattedFeed);
      } catch (error) {
        console.error("Failed to fetch activity feed data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Activity Feed
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Latest store events</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center py-8 text-center">
          <Activity className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-xs text-gray-400">No recent activities found</p>
        </div>
      ) : (
        <div className="relative flex-1">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-white/5" />

          <div className="space-y-4 ml-2">
            {activities.map(({ id, icon: Icon, color, title, desc, time }) => (
              <div
                key={id}
                className="flex items-start gap-3 pl-4 relative group"
              >
                {/* Dot on timeline */}
                <div
                  className={`absolute left-px top-2 h-2 w-2 rounded-full border-2 border-white dark:border-[#1A1D2E] transition-transform group-hover:scale-125 ${color.split(" ")[0].replace("text", "bg")}`}
                />

                <div
                  className={`shrink-0 h-7 w-7 rounded-lg flex items-center justify-center ${color}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{desc}</p>
                </div>
                <span className="shrink-0 text-[10px] font-medium text-gray-400 dark:text-gray-500 pt-0.5">
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
