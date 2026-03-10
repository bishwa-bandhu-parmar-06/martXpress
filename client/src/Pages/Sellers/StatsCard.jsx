/**
 * StatsCard.jsx — Animated KPI card for the overview
 */
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  gradient,
  loading,
}) => {
  const isPositive = !change?.startsWith("-");

  return (
    <div className="group relative bg-white dark:bg-[#1A1D2E] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md dark:hover:shadow-none hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      {/* Decorative gradient glow */}
      <div
        className={`absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity ${gradient}`}
      />

      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </p>
          {loading ? (
            <div className="mt-2 h-7 w-24 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />
          ) : (
            <p className="mt-1.5 text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {value}
            </p>
          )}
          {change && (
            <div className="flex items-center gap-1 mt-1.5">
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-semibold ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
              >
                {change}
              </span>
              <span className="text-xs text-gray-400">
                {changeLabel ?? "vs last month"}
              </span>
            </div>
          )}
        </div>

        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${gradient} shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
