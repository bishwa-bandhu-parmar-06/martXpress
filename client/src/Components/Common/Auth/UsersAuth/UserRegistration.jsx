import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUsers } from "../../../../API/users/usersApi";

const UserRegistration = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await registerUsers({ email });
      // console.log("Response in User Registration Form : ", res);
      // console.log("Response in User Registration Form : ", res.data);
      // console.log("Response in User Registration Form : ", res.status);

      if (res.status !== 200) throw new Error(res.message);
      // console.log("Navigating in User Registration Form : ");

      navigate("/verify-otp", {
        state: {
          email,
          role: "user",
          mode: "register",
        },
      });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Create Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Start your shopping journey with us
        </p>
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
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold 
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
            "Register"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Sign in
          </button>
        </p>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
          Want to sell with us?{" "}
          <button
            type="button"
            onClick={() => navigate("/seller/register")}
            className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
          >
            Become a seller
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserRegistration;
