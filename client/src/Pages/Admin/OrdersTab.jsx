import React from "react";
import { Package } from "lucide-react";

export const OrdersTab = () => {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Platform Orders
      </h2>
      <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
        <Package className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          No orders found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
          When buyers place orders on the platform, you will be able to monitor
          them here.
        </p>
      </div>
    </div>
  );
};
