import React, { useState } from "react";
import {
  Search,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "../../Components/ui/button";
import { Avatar, AvatarFallback } from "../../Components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../Components/ui/tabs";

export const SellersTab = ({
  pendingSellers,
  approvedSellers,
  rejectedSellers,
  handleViewSellerDetails,
  handleApproveSeller,
  handleRejectSeller,
  setSellerToDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    // Locked height with flex-col to enable inner scrolling
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* --- TOP CONTROLS --- */}
      <div className="shrink-0 space-y-4 mb-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <Search className="text-gray-400 ml-3" size={18} />
          <input
            type="text"
            placeholder="Search sellers by name or email..."
            className="w-full bg-transparent border-none outline-none text-sm p-1.5 text-gray-900 dark:text-white placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          />
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="pending" className="w-full flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl shrink-0">
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm font-semibold cursor-pointer transition-all"
            >
              <Clock size={16} className="hidden sm:block text-orange-500" />
              Pending <BadgeCount count={pendingSellers.length} />
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm font-semibold cursor-pointer transition-all"
            >
              <CheckCircle
                size={16}
                className="hidden sm:block text-green-500"
              />
              Approved <BadgeCount count={approvedSellers.length} />
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm font-semibold cursor-pointer transition-all"
            >
              <XCircle size={16} className="hidden sm:block text-red-500" />
              Rejected <BadgeCount count={rejectedSellers.length} />
            </TabsTrigger>
          </TabsList>

          {/* --- SCROLLABLE CONTENT AREA --- */}
          <div className="flex-1 overflow-y-auto pr-1 pb-4 mt-4 custom-scrollbar">
            {["pending", "approved", "rejected"].map((status) => {
              const listMap = {
                pending: pendingSellers,
                approved: approvedSellers,
                rejected: rejectedSellers,
              };
              const currentList = listMap[status].filter(
                (s) =>
                  s.name?.toLowerCase().includes(searchTerm) ||
                  s.email?.toLowerCase().includes(searchTerm),
              );

              return (
                <TabsContent
                  key={status}
                  value={status}
                  className="space-y-3 m-0"
                >
                  {currentList.length === 0 ? (
                    // Beautiful Empty State
                    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        No {status} sellers found
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 max-w-sm">
                        {searchTerm
                          ? "We couldn't find any sellers matching your search criteria."
                          : `There are currently no sellers in the ${status} queue.`}
                      </p>
                    </div>
                  ) : (
                    // Seller Cards
                    currentList.map((seller) => (
                      <div
                        key={seller._id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 gap-4 group hover:border-primary/30 transition-colors"
                      >
                        {/* Seller Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Avatar className="h-12 w-12 rounded-xl shrink-0 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <AvatarFallback
                              className={`font-black text-lg ${
                                status === "approved"
                                  ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                                  : status === "rejected"
                                    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                    : "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                              }`}
                            >
                              {seller.name?.charAt(0).toUpperCase() || "S"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate">
                              {seller.name}
                            </h4>
                            <p className="text-sm font-medium text-gray-500 truncate mt-0.5">
                              {seller.email}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSellerDetails(seller._id)}
                            className="cursor-pointer font-semibold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            View Details
                          </Button>

                          {status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveSeller(seller._id)}
                                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer font-semibold shadow-sm"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectSeller(seller._id)}
                                className="cursor-pointer font-semibold shadow-sm"
                              >
                                Reject
                              </Button>
                            </>
                          )}

                          {status !== "pending" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setSellerToDelete(seller._id)}
                              className="cursor-pointer font-semibold shadow-sm flex items-center gap-1.5"
                            >
                              <Trash2 size={16} />
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

// Helper component for the little number badges in the tabs
const BadgeCount = ({ count }) => {
  if (count === 0) return null;
  return (
    <span className="ml-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-[10px] px-2 py-0.5 rounded-full">
      {count}
    </span>
  );
};
