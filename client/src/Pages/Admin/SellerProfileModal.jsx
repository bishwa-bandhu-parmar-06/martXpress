import React from "react";
import { Badge } from "../../Components/ui/badge";
import { Button } from "../../Components/ui/button";
import { XCircle } from "lucide-react";

export const SellerProfileModal = ({
  selectedSeller,
  setSelectedSeller,
  handleApproveSeller,
  handleRejectSeller,
}) => {
  if (!selectedSeller) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            Seller Profile
          </h3>
          <button
            onClick={() => setSelectedSeller(null)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-primary/10 text-primary flex items-center justify-center rounded-2xl font-black text-2xl shadow-inner">
              {selectedSeller.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedSeller.name}
              </h2>
              <p className="text-gray-500 font-medium">
                {selectedSeller.email}
              </p>
            </div>
            <Badge
              className={`ml-auto border-none ${selectedSeller.verified === "approved" ? "bg-green-100 text-green-700" : selectedSeller.verified === "rejected" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}
            >
              {selectedSeller.verified?.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Phone Number
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {selectedSeller.mobile || "N/A"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Joined Date
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(selectedSeller.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
          <Button
            variant="outline"
            onClick={() => setSelectedSeller(null)}
            className="cursor-pointer font-semibold"
          >
            Close
          </Button>
          {selectedSeller.verified === "pending" && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer font-semibold"
                onClick={() => {
                  handleApproveSeller(selectedSeller._id);
                  setSelectedSeller(null);
                }}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer font-semibold"
                onClick={() => {
                  handleRejectSeller(selectedSeller._id);
                  setSelectedSeller(null);
                }}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
