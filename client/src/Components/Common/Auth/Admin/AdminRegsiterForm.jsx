import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAdmin } from "../../../../API/Admin/adminApi";

const AdminRegisterForm = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = { email };

      const res = await registerAdmin(payload);

      if (res.status !== 200) throw new Error(res.message);

      setSuccess("Registration successful! Please check your email for OTP.");

      // Navigate to OTP verification
      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: email,
            role: "admin",
            mode: "register",
          },
        });
      }, 1500);
    } catch (err) {
      setError(err.message || "Admin registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Registration
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Register as an administrator for MartXpress
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium">
            {success}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="Enter admin email address"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-red-500/50 focus:border-red-500
              outline-none transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Only authorized email addresses can register as admin
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold 
            py-3 px-4 rounded-lg transition-all duration-200
            transform hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registering...
            </span>
          ) : (
            "Register as Admin"
          )}
        </button>
      </form>

      {/* Admin Benefits */}
      <div className="mt-8 p-6 bg-linear-to-r from-red-500/5 to-red-600/5 dark:from-red-500/10 dark:to-red-600/10 rounded-xl">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Admin Privileges
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mt-0.5 shrink-0">
              ✓
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Full access to system management
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mt-0.5 shrink-0">
              ✓
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Manage users, sellers, and products
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mt-0.5 shrink-0">
              ✓
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              View analytics and reports
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mt-0.5 shrink-0">
              ✓
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Access to system settings
            </span>
          </li>
        </ul>
      </div>

      {/* Switch to Login */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an admin account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            Sign in here
          </button>
        </p>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
          Not an admin?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Go to User Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminRegisterForm;
