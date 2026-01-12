import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuthToken,
  getUserRole,
  getUserEmail,
  clearAuthData,
} from "../../utils/auth";

const UsersDashBoard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    role: "",
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      navigate("/");
      return;
    }

    // Get user data from localStorage
    const email = getUserEmail();
    const role = getUserRole();

    if (email && role) {
      setUserData({ email, role });
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              User Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-linear-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Welcome, {userData.email}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Role: <span className="font-semibold">{userData.role}</span>
              </p>
            </div>

            {/* Add more dashboard content here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersDashBoard;
