import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // If they are already logged in, send them to their respective dashboard
  if (isAuthenticated) {
    if (user?.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === "seller")
      return <Navigate to="/sellers/dashboard" replace />;
    return <Navigate to="/users/dashboard" replace />;
  }

  // If not logged in, let them see the Auth page
  return children;
};

export default GuestRoute;
