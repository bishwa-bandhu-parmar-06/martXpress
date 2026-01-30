import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, ResendOtp } from "../../../../API/Common/commonApi.js";
import {setAuthToken, setUserRole} from "../../../../utils/auth.js"
const VerifyRegisterLoginOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email || "";
  const role = state?.role || "user";
  const mode = state?.mode || "login";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = { email, otp };
      const res = await verifyOtp(payload);

      setAuthToken(res.token)
      setUserRole(res.role)
      // console.log("token : ", res.token);
      // console.log("role : ", res.role);
      if (res.status !== 200)
        throw new Error(res.message || "Verification failed");

      if (!res.token) {
        setSuccess(res.message);
        return;
      }
      setSuccess(res.message || "Verified successfully");
      let userRole = res.role;
      if (userRole) {
        if (userRole === "user") navigate("/users/dashboard");
        else if (userRole === "seller") navigate("/sellers/dashboard");
        else if (userRole === "admin") navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await ResendOtp({ email });
      if (res.status === 200) {
        setSuccess("OTP resent successfully!");
        setError("");
      } else {
        setError(res.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  const getBackButtonPath = () => {
    if (role === "admin") return "/admins/auth";
    if (role === "seller")
      return mode === "register" ? "/sellers/auth" : "/seller/login";
    return mode === "register" ? "/register" : "/login";
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Brand Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-primary mb-4">MartXpress</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Secure Verification
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <form
            onSubmit={handleVerify}
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Verify OTP
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                    bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center
                    text-2xl tracking-[0.5em] font-mono
                    focus:ring-2 focus:ring-primary/50 focus:border-primary
                    outline-none transition-all duration-200"
                  required
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-600 dark:text-green-400 text-sm text-center font-medium">
                    {success}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold 
                  py-3 px-4 rounded-lg transition-all duration-200
                  transform hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary hover:text-primary/80 font-semibold text-sm
                    transition-colors"
                >
                  Didn't receive code? Resend OTP
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  OTP expires in 10 minutes
                </p>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate(getBackButtonPath())}
                  className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium
                    transition-colors text-sm"
                >
                  ← Back to {mode === "register" ? "Registration" : "Login"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegisterLoginOtp;
