// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProtectedRoute.jsx
//
// WHAT IS THIS COMPONENT?
//   Higher-order route protection wrapper that validates authentication and
//   enforces strict role-based access control (RBAC).
//
// REDIRECTION RULES:
//   1. Unauthenticated users -> Redirect to /login
//   2. Customer accessing Provider/Admin routes -> Redirect to /dashboard
//   3. Provider accessing Admin routes -> Redirect to /provider/dashboard
//   4. Authorized user -> Renders the requested route element
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, role, loading } = useAuth();

  // If auth state is rehydrating from localStorage, show brief spinner
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // 1. Not Authenticated -> Redirect to Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role Check: If allowedRoles is defined and user role is not allowed
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
    // If a customer tries to open /admin or provider routes -> redirect to customer dashboard
    if (role === "customer") {
      return <Navigate to="/dashboard" replace />;
    }
    // If a provider tries to open /admin -> redirect to provider dashboard
    if (role === "provider") {
      return <Navigate to="/provider/dashboard" replace />;
    }
    // If an admin tries to open other pages
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  // 3. User is authenticated and authorized for this route
  return children;
}

export default ProtectedRoute;
