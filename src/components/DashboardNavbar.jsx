// ─────────────────────────────────────────────────────────────────────────────
// src/components/DashboardNavbar.jsx
//
// WHAT IS THIS COMPONENT?
//   The top bar that appears above the main customer dashboard content area.
//   Shows dynamic user info from AuthContext and real Logout functionality.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

function DashboardNavbar({ pageTitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Customer";
  const displayEmail = user?.email || "customer@localfix.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="lf-dash-navbar">
      {/* ── LEFT: PAGE TITLE ────────────────────────────────────────────── */}
      <div className="lf-dash-navbar-left">
        <h5 className="lf-dash-page-title">{pageTitle}</h5>
      </div>

      {/* ── RIGHT: NOTIFICATIONS + USER DROPDOWN ────────────────────────── */}
      <div className="lf-dash-navbar-right d-flex align-items-center gap-3">
        {/* Real-time Notification Dropdown */}
        <NotificationDropdown align="end" />

        {/* User Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="user-dropdown"
            className="lf-user-dropdown-btn"
          >
            <span className="lf-user-avatar">{initial}</span>
            <span className="lf-user-name">{displayName}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="lf-user-dropdown-menu">
            <div className="lf-dropdown-header">
              <p className="lf-dropdown-user-name">{displayName}</p>
              <p className="lf-dropdown-user-email">{displayEmail}</p>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/profile">
              <i className="bi bi-person me-2"></i> My Profile
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/requests">
              <i className="bi bi-calendar2-check me-2"></i> My Bookings
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/help">
              <i className="bi bi-headset me-2"></i> Help &amp; Support
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger" style={{ cursor: "pointer" }}>
              <i className="bi bi-box-arrow-left me-2"></i> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default DashboardNavbar;
