// ─────────────────────────────────────────────────────────────────────────────
// src/App.js
//
// WHAT THIS FILE DOES:
//   App.js is the ROUTING LAYER of LocalFix.
//   It defines application routes and applies role-based ProtectedRoute guards.
//
// ROLE ROUTING RULES:
//   - Customer: /dashboard, /requests, /request, /services
//   - Provider: /provider/dashboard, /provider/requests, /provider/jobs, /provider/profile
//   - Admin: /admin, /admin/dashboard (Only users with role === 'admin' can access)
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import the App-wide CSS (component styles)
import "./App.css";

// Import Pages
import Home                 from "./pages/Home";
import Login                from "./pages/Login";
import Register             from "./pages/Register";
import HowItWorks           from "./pages/HowItWorks";
import BecomeProvider       from "./pages/BecomeProvider";
import ServicesPage         from "./pages/ServicesPage";
import FindService          from "./pages/FindService";
import CustomerDashboard    from "./pages/CustomerDashboard";
import ProviderDashboard    from "./pages/ProviderDashboard";
import ProviderRequests     from "./pages/ProviderRequests";
import MyJobs               from "./pages/MyJobs";
import ProviderProfile      from "./pages/ProviderProfile";
import ProviderHelpSupport  from "./pages/ProviderHelpSupport";
import CreateRequest        from "./pages/CreateRequest";
import MyRequests           from "./pages/MyRequests";
import RequestDetails       from "./pages/RequestDetails";
import Profile              from "./pages/Profile";
import HelpSupport          from "./pages/HelpSupport";
import AdminDashboard       from "./pages/AdminDashboard";

// Import ProtectedRoute Component and Auth
import ProtectedRoute       from "./components/ProtectedRoute";
import { useAuth }          from "./context/AuthContext";

// ── Smart Services Route (Dashboard for customer, Public for guest) ───────
function ServicesRoute() {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated && role === "customer") {
    return <FindService />;
  }
  return <ServicesPage />;
}

function App() {
  return (
    <Routes>
      {/* ── PUBLIC ROUTES ─────────────────────────────────────────────────── */}
      <Route path="/"                  element={<Home />} />
      <Route path="/login"             element={<Login />} />
      <Route path="/register"          element={<Register />} />
      <Route path="/provider/register" element={<Register defaultRole="provider" />} />
      <Route path="/how-it-works"      element={<HowItWorks />} />
      <Route path="/become-a-provider" element={<BecomeProvider />} />
      <Route path="/provider"          element={<BecomeProvider />} />
      <Route path="/services"          element={<ServicesRoute />} />

      {/* ── CUSTOMER ROUTES (Protected) ─────────────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin"]}>
            <CreateRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request/:id"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <RequestDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin"]}>
            <MyRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute allowedRoles={["customer", "provider", "admin"]}>
            <RequestDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["customer", "admin"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/help" element={<HelpSupport />} />

      {/* ── PROVIDER ROUTES (Protected) ─────────────────────────────────────── */}
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider-dashboard"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/requests"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <ProviderRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/jobs"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <MyJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/profile"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <ProviderProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/help"
        element={
          <ProtectedRoute allowedRoles={["provider", "admin"]}>
            <ProviderHelpSupport />
          </ProtectedRoute>
        }
      />

      {/* ── ADMIN ROUTES (Protected: ONLY role === 'admin') ─────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
