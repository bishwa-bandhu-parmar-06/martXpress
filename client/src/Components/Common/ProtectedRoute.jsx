import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!isAuthenticated) {
    if (location.pathname.startsWith("/admin"))
      return <Navigate to="/admins/auth" replace />;
    if (location.pathname.startsWith("/sellers"))
      return <Navigate to="/sellers/auth" replace />;
    return <Navigate to="/users/auth" replace />;
  }

  if (isAuthenticated && !user?.role) {
    return null;
  }

  const currentUserRole = user?.role?.toLowerCase()?.trim();
  const normalizedAllowedRoles = allowedRoles.map((r) =>
    r.toLowerCase().trim(),
  );

  // console.log("Checking Access:", {
  //   rawRole: user?.role,
  //   cleanedRole: currentUserRole,
  //   allowed: normalizedAllowedRoles,
  // });

  if (allowedRoles && !normalizedAllowedRoles.includes(currentUserRole)) {
    if (user?.role === "user")
      return <Navigate to="/users/dashboard" replace />;
    if (user?.role === "seller")
      return <Navigate to="/sellers/dashboard" replace />;
    if (user?.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
