/**
 * StatusBadge.jsx — Reusable status badge
 */
import React from "react";
import {
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Package,
  AlertCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  // Order statuses
  pending: {
    label: "Pending",
    icon: Clock,
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  processing: {
    label: "Processing",
    icon: Package,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    cls: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
  // Product statuses
  active: {
    label: "Active",
    icon: CheckCircle,
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  inactive: {
    label: "Inactive",
    icon: AlertCircle,
    cls: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400",
  },
  "out of stock": {
    label: "Out of Stock",
    icon: AlertCircle,
    cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
};

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase() ?? "";
  const config = STATUS_CONFIG[key] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${config.cls}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
