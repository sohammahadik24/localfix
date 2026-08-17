// ─────────────────────────────────────────────────────────────────────────────
// src/components/DashboardSidebar.jsx
//
// WHAT IS THIS COMPONENT?
//   DashboardSidebar is the LEFT panel of the dashboard. It always stays fixed
//   on screen while the main content scrolls.
//
//   It shows:
//   - The LocalFix logo/brand at the top
//   - Navigation links (Dashboard, Find a Service, etc.)
//   - A Logout button at the bottom
//
// WHAT ARE PROPS? (activeTab)
//   Props = "properties" = data passed FROM a parent component INTO a child.
//
//   Think of it like a function argument:
//   function greet(name) { return "Hello " + name; }
//                ↑ argument
//
//   In React:
//   <DashboardSidebar activeTab="dashboard" />
//                     ↑ this is a prop
//
//   Inside this component, we receive it as:
//   function DashboardSidebar({ activeTab }) { ... }
//
//   We use activeTab to highlight the currently selected menu item.
//   If activeTab === "dashboard", the Dashboard link gets a blue highlight.
//
// WHY SEPARATE THIS INTO ITS OWN COMPONENT?
//   The sidebar appears on EVERY dashboard page (Dashboard, Requests, Profile...).
//   If we put it in CustomerDashboard.jsx directly, we'd have to copy it to
//   every page file. By making it a separate component, we import it once.
//   This is the DRY principle: Don't Repeat Yourself.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Navigation menu items defined as an ARRAY of OBJECTS ──────────────────
const navItems = [
  {
    id: 1,
    label: "Dashboard",
    icon: "bi bi-grid-1x2-fill",
    path: "/dashboard",
    tab: "dashboard",
  },
  {
    id: 2,
    label: "Find a Service",
    icon: "bi bi-search",
    path: "/services",
    tab: "services",
  },
  {
    id: 3,
    label: "My Requests",
    icon: "bi bi-list-check",
    path: "/requests",
    tab: "requests",
  },
  {
    id: 4,
    label: "Profile",
    icon: "bi bi-person-fill",
    path: "/profile",
    tab: "profile",
  },
  {
    id: 5,
    label: "Help & Support",
    icon: "bi bi-headset",
    path: "/help",
    tab: "help",
  },
];

function DashboardSidebar({ activeTab }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    // The outer div is the full sidebar container.
    // It uses CSS class "lf-sidebar" defined in App.css.
    <div className="lf-sidebar">

      {/* ── BRAND / LOGO ──────────────────────────────────────────────── */}
      {/*
        Link is from React Router. It changes the URL WITHOUT reloading the page.
        <a href="/"> would reload the entire page (bad for React apps).
        <Link to="/"> changes the URL smoothly and React updates only what changed.
      */}
      <Link to="/" className="lf-sidebar-brand">
        <i className="bi bi-tools"></i>
        <span>LocalFix</span>
      </Link>

      {/* ── SECTION LABEL ─────────────────────────────────────────────── */}
      <p className="lf-sidebar-section-label">MAIN MENU</p>

      {/* ── NAVIGATION LINKS ──────────────────────────────────────────── */}
      {/*
        navItems.map() goes through every item in the navItems array above.
        For each item, it creates a <Link> element.
        The "key" prop is required by React to track each list item efficiently.

        HOW .map() WORKS:
          Imagine navItems = [item1, item2, item3]
          navItems.map(item => <Link>...</Link>)
          → creates [<Link/>, <Link/>, <Link/>]
          React renders all three automatically.

        We check: is this item the active one?
          item.tab === activeTab
          If yes, add the CSS class "active" to highlight it.
      */}
      <nav className="lf-sidebar-nav">
        {navItems.map((item) => (
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

      {/* ── SPACER: pushes logout button to the bottom ─────────────────── */}
      <div className="lf-sidebar-spacer"></div>

      {/* ── DIVIDER ───────────────────────────────────────────────────── */}
      <div className="lf-sidebar-divider"></div>

      {/* ── LOGOUT BUTTON ─────────────────────────────────────────────── */}
      <button
        className="lf-sidebar-logout"
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-left lf-sidebar-icon"></i>
        <span>Logout</span>
      </button>

    </div>
  );
}

export default DashboardSidebar;
