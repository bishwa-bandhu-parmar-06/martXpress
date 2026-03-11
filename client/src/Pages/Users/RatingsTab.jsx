import React, { useState, useEffect } from "react";
import { Star, Loader2, Trash2, Edit, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  getAllMyRatings,
  deleteRatingsofUsers,
  addRatings,
} from "../../API/users/ratingApi";

export const RatingsTab = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyRatings = async () => {
    try {
      setLoading(true);
      const res = await getAllMyRatings();
      setRatings(res.ratings || []);
    } catch (error) {
      toast.error("Failed to load your reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRatings();
  }, []);

  const handleDelete = async (productId) => {
    try {
      setDeletingId(productId);
      await deleteRatingsofUsers(productId);
      toast.success("Review deleted successfully");
      setRatings(ratings.filter((r) => r.productId?._id !== productId));
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Reviews
      </h2>

      {ratings.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
          <Star className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            No reviews yet
          </h3>
          <p className="text-gray-500 mt-2">
            Products you review will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ratings.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-5 relative"
            >
              {/* Product Info */}
              <div className="shrink-0 w-full md:w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                <img
                  src={
                    item.productId?.images?.[0] ||
                    "https://placehold.co/100x100"
                  }
                  alt={item.productId?.name}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    to={`/product/${item.productId?._id}`}
                    className="font-bold text-lg text-gray-900 dark:text-white hover:text-primary transition-colors line-clamp-1 flex items-center gap-2"
                  >
                    {item.productId?.name || "Product Unavailable"}
                    <ExternalLink size={14} className="text-gray-400" />
                  </Link>
                  <span className="text-xs text-gray-400 whitespace-nowrap hidden md:block">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < item.rating ? "#fbbf24" : "none"}
                      className={
                        i < item.rating ? "text-yellow-400" : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                {item.review && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    "{item.review}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4 justify-end border-t border-gray-100 dark:border-gray-800 pt-4">
                  <Link
                    to={`/product/${item.productId?._id}`}
                    className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary"
                  >
                    <Edit size={16} /> Edit Review
                  </Link>
                  <button
                    onClick={() => handleDelete(item.productId?._id)}
                    disabled={deletingId === item.productId?._id}
                    className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    {deletingId === item.productId?._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
