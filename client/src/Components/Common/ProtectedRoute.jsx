import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated as checkAuth, getUserRole } from "../../utils/auth.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = checkAuth();
  const role = getUserRole();

  // console.log("ProtectedRoute :", isAuth, role);

  //  Not logged in
  if (!isAuth) {
    return <Navigate to="/users/auth" replace />;
  }

  //  Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "user") return <Navigate to="/users/dashboard" replace />;
    if (role === "seller") return <Navigate to="/sellers/dashboard" replace />;
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  // Allowed
  return children;
};

export default ProtectedRoute;
