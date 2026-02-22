import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../../API/Common/commonApi.js";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../../Features/auth/AuthSlice.js";

const LoginForm = ({ userType = "user" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  // Conditional Styling based on userType
  const isAdmin = userType === "admin";
  const themeColor = isAdmin ? "red-600" : "primary";
  const ringColor = isAdmin ? "focus:ring-red-500/50" : "focus:ring-primary/10";
  const borderColor = isAdmin ? "focus:border-red-600" : "focus:border-primary";
  const hoverColor = isAdmin ? "hover:bg-red-700" : "hover:bg-primary/90";
  const iconFocus = isAdmin
    ? "group-focus-within:text-red-600"
    : "group-focus-within:text-primary";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(formData);
      if (res.success) {
        dispatch(
          loginSuccess({
            user: {
              name: res.user.name,
              email: res.user.email,
              role: res.role,
            },
          }),
        );
        const dashboardPaths = {
          user: "/users/dashboard",
          admin: "/admin/dashboard",
          seller: "/sellers/dashboard",
        };
        navigate(dashboardPaths[res.role] || "/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-sm text-center font-semibold">
            {error}
          </p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
          {isAdmin ? "Admin Email" : "Email Address"}
        </label>
        <div className="relative group">
          <Mail
            className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${iconFocus} transition-colors`}
          />
          <input
            name="email"
            type="email"
            required
            className={`w-full pl-12 pr-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-offset-2 ${ringColor} ${borderColor} focus:ring-4 outline-none transition-all`}
            placeholder={isAdmin ? "admin@martxpress.com" : "name@business.com"}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex justify-between px-1">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Password
          </label>
          <button
            type="button"
            className={`text-xs font-bold hover:underline ${isAdmin ? "text-red-600" : "text-primary"}`}
          >
            Forgot?
          </button>
        </div>
        <div className="relative group">
          <Lock
            className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${iconFocus} transition-colors`}
          />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className={`w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-offset-2 ${ringColor} ${borderColor} focus:ring-4 outline-none transition-all`}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors ${isAdmin ? "hover:text-red-600" : "hover:text-primary"}`}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-${themeColor} ${hoverColor} text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 ${isAdmin ? "shadow-red-500/20" : "shadow-primary/20"}`}
      >
        {loading ? "Verifying..." : isAdmin ? "Access Admin Panel" : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
