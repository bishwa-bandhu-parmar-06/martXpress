import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../../API/Common/commonApi.js";

const LoginForm = ({ onSwitchToRegister, userType = "user" }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ email });

      if (res.status !== 200) throw new Error(res.message);

      // Navigate to OTP verification with user type
      navigate("/verify-otp", {
        state: {
          email,
          mode: "login",
          // Pass user type for role-based redirection
          userType: userType,
        },
      });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (userType) {
      case "admin":
        return "Admin Login";
      case "seller":
        return "Seller Login";
      default:
        return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (userType) {
      case "admin":
        return "Sign in to your admin account";
      case "seller":
        return "Sign in to your seller account";
      default:
        return "Sign in to your account";
    }
  };

  const getButtonColor = () => {
    switch (userType) {
      case "admin":
        return "bg-red-600 hover:bg-red-700";
      case "seller":
        return "bg-secondary hover:bg-secondary/90";
      default:
        return "bg-primary hover:bg-primary/90";
    }
  };

  const getLinkColor = () => {
    switch (userType) {
      case "admin":
        return "text-red-600 hover:text-red-700";
      case "seller":
        return "text-secondary hover:text-secondary/80";
      default:
        return "text-primary hover:text-primary/80";
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {getTitle()}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{getSubtitle()}</p>
      </div>

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
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-primary/50 focus:border-primary
              outline-none transition-all duration-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${getButtonColor()} text-white font-semibold 
            py-3 px-4 rounded-lg transition-all duration-200
            transform hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending OTP...
            </span>
          ) : (
            "Send OTP"
          )}
        </button>
      </form>

      {onSwitchToRegister && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            {userType === "admin"
              ? "Don't have an admin account?"
              : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={`font-semibold transition-colors ${getLinkColor()}`}
            >
              {userType === "admin" ? "Register as Admin" : "Sign up"}
            </button>
          </p>

          {userType === "admin" && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
