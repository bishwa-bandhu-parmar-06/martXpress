import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home, ArrowLeft, Search, ShoppingBag, RefreshCw } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 
      dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4"
    >
      {/* Main Content */}
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div
            className="text-9xl font-bold text-gray-300 dark:text-gray-700 
            tracking-wider opacity-50"
          >
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-6xl md:text-8xl font-bold bg-linear-to-right 
              from-primary to-secondary bg-clip-text text-transparent"
            >
              404
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="group flex items-center justify-center gap-3 px-8 py-4 
              bg-linear-to-right from-primary to-secondary text-white 
              font-semibold rounded-xl hover:shadow-xl transition-all 
              duration-300 transform hover:-translate-y-0.5"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>

          {/* Go Back */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center gap-3 px-8 py-4 
              bg-white dark:bg-gray-800 border-2 border-primary text-primary 
              font-semibold rounded-xl hover:bg-primary hover:text-white 
              transition-all duration-300"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold dark:text-white mb-6">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl 
                border border-gray-200 dark:border-gray-700 hover:border-primary 
                transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full 
                flex items-center justify-center group-hover:bg-primary/20 
                transition-colors"
              >
                <Home className="text-primary" size={24} />
              </div>
              <span className="font-medium dark:text-white">Home</span>
            </Link>

            <Link
              to="/cart"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl 
                border border-gray-200 dark:border-gray-700 hover:border-primary 
                transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full 
                flex items-center justify-center group-hover:bg-primary/20 
                transition-colors"
              >
                <ShoppingBag className="text-primary" size={24} />
              </div>
              <span className="font-medium dark:text-white">Cart</span>
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl 
                border border-gray-200 dark:border-gray-700 hover:border-primary 
                transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full 
                flex items-center justify-center group-hover:bg-primary/20 
                transition-colors"
              >
                <RefreshCw className="text-primary" size={24} />
              </div>
              <span className="font-medium dark:text-white">Refresh</span>
            </button>

            <Link
              to="/help"
              className="p-4 bg-white dark:bg-gray-800 rounded-xl 
                border border-gray-200 dark:border-gray-700 hover:border-primary 
                transition-all duration-300 group"
            >
              <div
                className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full 
                flex items-center justify-center group-hover:bg-primary/20 
                transition-colors"
              >
                <Search className="text-primary" size={24} />
              </div>
              <span className="font-medium dark:text-white">Help</span>
            </Link>
          </div>
        </div>

        {/* Search Suggestions */}
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border 
          border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold dark:text-white mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try searching or check our popular categories:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/?category=electronics")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full 
                hover:bg-primary hover:text-white transition-colors"
            >
              Electronics
            </button>
            <button
              onClick={() => navigate("/?category=fashion")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full 
                hover:bg-primary hover:text-white transition-colors"
            >
              Fashion
            </button>
            <button
              onClick={() => navigate("/?category=home")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full 
                hover:bg-primary hover:text-white transition-colors"
            >
              Home & Living
            </button>
            <button
              onClick={() => navigate("/?category=sports")}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full 
                hover:bg-primary hover:text-white transition-colors"
            >
              Sports
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12">
          <div className="flex justify-center space-x-8 opacity-50">
            <div
              className="w-24 h-24 rounded-full bg-linear-to-right from-primary/20 to-secondary/20 
              blur-xl"
            ></div>
            <div
              className="w-24 h-24 rounded-full bg-linear-to-right from-secondary/20 to-primary/20 
              blur-xl"
            ></div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Still having trouble?
        </p>
        <button
          onClick={() => navigate("/help")}
          className="text-primary font-semibold hover:underline"
        >
          Contact Support →
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
