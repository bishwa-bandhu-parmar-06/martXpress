import React from "react";
import { Card, CardContent } from "../../Components/ui/card";
import { Users as UsersIcon, Users, Package, AlertCircle } from "lucide-react";

export const DashboardTab = ({ dashboardStats, pendingSellersCount }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-900 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Total Users
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {dashboardStats?.totalUsers || 0}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <UsersIcon size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Active Sellers
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {dashboardStats?.approvedSellers || 0}
                </h3>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
                <Users size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Total Products
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {dashboardStats?.totalProducts || 0}
                </h3>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                <Package size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Pending Approvals
                </p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                  {pendingSellersCount}
                </h3>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl">
                <AlertCircle size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
