import React, { useState, useEffect } from "react";
import AdminRegisterForm from "../../Components/Common/Auth/Admin/AdminRegsiterForm";
import LoginForm from "../../Components/Common/Auth/Common/LoginForm";
import {
  Shield,
  Lock,
  Users,
  Settings,
  Bell,
  BarChart3,
  Database,
  Server,
} from "lucide-react";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to document
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Advanced Security",
      description: "Enterprise-grade security with role-based access control",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-time Analytics",
      description: "Monitor platform performance with live dashboards",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Management",
      description: "Manage users, sellers, and administrators efficiently",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "System Control",
      description: "Full control over platform settings and configurations",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Management",
      description: "Secure database management and backup systems",
    },
    {
      icon: <Server className="h-6 w-6" />,
      title: "Server Monitoring",
      description: "24/7 system health monitoring and alerts",
    },
  ];

  const stats = [
    { label: "Active Admins", value: "48", color: "text-blue-600" },
    { label: "Platform Uptime", value: "99.9%", color: "text-green-600" },
    { label: "Security Score", value: "A+", color: "text-purple-600" },
    { label: "Response Time", value: "< 50ms", color: "text-yellow-600" },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03] pointer-events-none"></div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-12 pt-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-linear-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                MartXpress
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Admin Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Live Status
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Server:{" "}
                </span>
                <span className="font-semibold text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Brand & Info */}
          <div className="space-y-8">
            {/* Main Brand */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="bg-linear-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                  Admin Portal
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
                Secure access to the MartXpress management system. Monitor,
                manage, and optimize your e-commerce platform.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Platform Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-800 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                        <div className="text-red-600 dark:text-red-400">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-linear-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <Lock className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">
                    256-bit Encryption
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    All data is encrypted end-to-end with military-grade
                    security protocols
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Forms */}
          <div className="space-y-8">
            {/* Auth Container */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-linear-to-r from-red-600 to-red-800 p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    {isLogin ? "Admin Sign In" : "Admin Registration"}
                  </h2>
                  <p className="text-red-100 mt-2">
                    {isLogin
                      ? "Access the admin dashboard"
                      : "Create a new administrator account"}
                  </p>
                </div>
              </div>

              {/* Auth Toggle */}
              <div className="px-8 pt-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`cursor-pointer py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isLogin
                          ? "bg-white dark:bg-gray-800 text-red-600 shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <Lock className="h-4 w-4" />
                      Login
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={` cursor-pointer py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        !isLogin
                          ? "bg-white dark:bg-gray-800 text-red-600 shadow-md"
                          : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-600/50"
                      }`}
                    >
                      <Users className="h-4 w-4" />
                      Register
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="transition-all duration-300">
                  {isLogin ? (
                    <div className="w-full max-w-md mx-auto">
                      <LoginForm
                        onSwitchToRegister={() => setIsLogin(false)}
                        userType="admin"
                      />
                    </div>
                  ) : (
                    <AdminRegisterForm
                      onSwitchToLogin={() => setIsLogin(true)}
                    />
                  )}
                </div>
              </div>

              {/* Security Footer */}
              <div className="px-8 pb-8">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>
                      Enterprise Security • Two-Factor Authentication • Activity
                      Logging
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .dark .bg-grid-pattern {
          background-image:
            linear-gradient(to right, #374151 1px, transparent 1px),
            linear-gradient(to bottom, #374151 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default AdminAuth;
