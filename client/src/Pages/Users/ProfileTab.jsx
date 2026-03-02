import React from "react";
import { Edit3 } from "lucide-react";

export const ProfileTab = ({ profileData, onEdit }) => {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Personal Information
        </h2>
        <button
          onClick={onEdit}
          className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
        >
          <Edit3 size={16} /> Edit
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {profileData?.name || "Not provided"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Email Address
          </p>
          <p className="font-medium text-gray-900 dark:text-white">
            {profileData?.email || "Not provided"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Phone Number
          </p>
          <p className="font-medium text-gray-900 dark:text-white">
            {profileData?.mobile || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
};
