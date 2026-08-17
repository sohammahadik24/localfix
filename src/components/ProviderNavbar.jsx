// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProviderNavbar.jsx
//
// WHAT IS THIS COMPONENT?
//   Top navbar for service provider pages with page title, notifications,
//   dynamic provider profile info, and functional Logout.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

function ProviderNavbar({ pageTitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || "Service Pro";
  const displayEmail = user?.email || "provider@localfix.com";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="lf-dash-navbar">
      {/* ── LEFT: PAGE TITLE ────────────────────────────────────────────── */}
      <div className="lf-dash-navbar-left">
        <h5 className="lf-dash-page-title">{pageTitle}</h5>
      </div>

      {/* ── RIGHT: NOTIFICATIONS + PROVIDER DROPDOWN ────────────────────── */}
      <div className="lf-dash-navbar-right d-flex align-items-center gap-3">
        {/* Real-time Notification Dropdown */}
        <NotificationDropdown align="end" />

        {/* Provider Profile Dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="provider-dropdown"
            className="lf-user-dropdown-btn"
          >
            <span className="lf-user-avatar" style={{ backgroundColor: "#2563EB" }}>
              {initial}
            </span>
            <span className="lf-user-name">{displayName} (Pro)</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="lf-user-dropdown-menu">
            <div className="lf-dropdown-header">
              <p className="lf-dropdown-user-name">{displayName}</p>
              <p className="lf-dropdown-user-email">{displayEmail}</p>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item as={Link} to="/provider/profile">
              <i className="bi bi-person me-2"></i> Provider Profile
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/provider/jobs">
              <i className="bi bi-briefcase me-2"></i> My Assigned Jobs
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/provider/help">
              <i className="bi bi-headset me-2"></i> Support Center
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

export default ProviderNavbar;
