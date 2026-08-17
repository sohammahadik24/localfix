// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProviderSidebar.jsx
//
// WHAT IS THIS COMPONENT?
//   The dedicated fixed navigation sidebar for Service Provider pages:
//     - Dashboard        → /provider/dashboard
//     - Service Requests → /provider/requests
//     - Profile          → /profile
//     - Help & Support   → /help
//
// PROPS:
//   activeTab → Highlights the currently selected menu item (e.g. "requests")
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Link, useNavigate } from "react-router-dom";

const providerNavItems = [
  {
    id: 1,
    label: "Dashboard",
    icon: "bi bi-grid-1x2-fill",
    path: "/provider/dashboard",
    tab: "dashboard",
  },
  {
    id: 2,
    label: "Jobs & Requests",
    icon: "bi bi-briefcase-fill",
    path: "/provider/jobs",
    tab: "jobs",
  },
  {
    id: 3,
    label: "My Profile",
    icon: "bi bi-person-badge-fill",
    path: "/provider/profile",
    tab: "profile",
  },
  {
    id: 4,
    label: "Help & Support",
    icon: "bi bi-headset",
    path: "/provider/help",
    tab: "help",
  },
];

function ProviderSidebar({ activeTab }) {
  const navigate = useNavigate();

  return (
    <div className="lf-sidebar">
      {/* Brand / Logo */}
      <Link to="/" className="lf-sidebar-brand">
        <i className="bi bi-tools"></i>
        <span>LocalFix</span>
      </Link>

      <p className="lf-sidebar-section-label">PROVIDER MENU</p>

      {/* Navigation Menu Links */}
      <nav className="lf-sidebar-nav">
        {providerNavItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`lf-sidebar-link ${activeTab === item.tab ? "active" : ""}`}
          >
            <i className={`${item.icon} lf-sidebar-icon`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="lf-sidebar-spacer"></div>
      <div className="lf-sidebar-divider"></div>

      {/* Logout */}
      <button className="lf-sidebar-logout" onClick={() => navigate("/")}>
        <i className="bi bi-box-arrow-left lf-sidebar-icon"></i>
        <span>Logout</span>
      </button>
    </div>
  );
}

export default ProviderSidebar;
