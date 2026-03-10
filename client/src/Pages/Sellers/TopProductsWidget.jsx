/**
 * TopProductsWidget.jsx — Top selling products for Overview
 */
import React, { useEffect, useState } from "react";
import {
  Package,
  Edit2,
  Plus,
  ChevronRight,
  Loader2,
  Star,
} from "lucide-react";
import { getAllProductsOfLoggedInSeller } from "../../API/ProductsApi/productsAPI.js";

const TopProductsWidget = ({ onNavigate, onAddProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProductsOfLoggedInSeller(1, 5)
      .then((res) => setProducts(res.products ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-[#1A1D2E] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Top Products
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Your best-performing items
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAddProduct}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
          <button
            onClick={() => onNavigate("products")}
            className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
          >
            All <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-400 mb-3">No products yet</p>
          <button
            onClick={onAddProduct}
            className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer"
          >
            + Add your first product
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {products.map((product, i) => (
            <div
              key={product._id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
            >
              {/* Rank */}
              <span className="text-xs font-black text-gray-300 dark:text-gray-600 w-4 shrink-0">
                {i + 1}
              </span>

              {/* Thumbnail or icon */}
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-10 w-10 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-white/5"
                />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-gray-400" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] text-gray-400">
                      {product.rating ?? "N/A"}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">·</span>
                  <span className="text-[10px] text-gray-400">
                    {product.stock ?? 0} in stock
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  ₹{(product.finalPrice ?? product.price ?? 0).toLocaleString()}
                </p>
                {product.discount > 0 && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    -{product.discount}% off
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopProductsWidget;
