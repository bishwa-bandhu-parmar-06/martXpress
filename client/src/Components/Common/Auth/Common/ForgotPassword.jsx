import React, { useState, useEffect } from "react";
import { Mail, ArrowLeft, X } from "lucide-react";
import { forgotPassword } from "../../../../API/Common/commonApi.js";

const ForgotPasswordModal = ({ isOpen, onClose, userType }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Clear form states whenever the modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setMessage("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword({ email, role: userType });
      setMessage(res.message || "Reset link sent! Please check your email.");
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 text-sm font-semibold text-center text-red-600 border rounded-xl bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50">
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 text-sm font-semibold text-center text-green-600 border rounded-xl bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50">
              {message}
            </div>
          )}

          <div className="space-y-2">
            <label className="ml-1 text-sm font-bold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute w-5 h-5 transition-colors -translate-y-1/2 left-4 top-1/2 text-gray-400 group-focus-within:text-primary" />
              <input
                type="email"
                required
                className="w-full py-4 pl-12 pr-5 transition-all border outline-none rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-white transition-all shadow-lg bg-primary hover:bg-primary/90 rounded-2xl shadow-primary/20 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="flex items-center justify-center w-full gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
