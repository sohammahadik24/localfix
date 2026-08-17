// ─────────────────────────────────────────────────────────────────────────────
// src/pages/CustomerDashboard.jsx
//
// WHAT IS THIS FILE?
//   This is the MAIN PAGE of the Customer Dashboard.
//   Think of it as the "blueprint" or "frame" that organises everything.
//
//   It is responsible for:
//     1. Setting up the two-column layout (Sidebar + Main Content)
//     2. Importing and placing all child components in the right spots
//     3. Holding the data (services, requests) and passing it to children
//
// WHY IS IT CALLED THE PARENT?
//   Because it CONTAINS all the other components. It decides what data
//   each child component gets. Children just display what they receive.
//
// COMPONENT TREE:
//   CustomerDashboard  ← this file (parent)
//     ├── DashboardSidebar   ← receives activeTab prop
//     └── (main area)
//           ├── DashboardNavbar     ← receives pageTitle prop
//           ├── Hero Banner & Search ← inline JSX (Merged greeting, CTA & search bar)
//           ├── ServiceCards        ← receives services prop
//           ├── StatCards           ← no props (has its own static data for now)
//           └── RecentRequests      ← receives requests prop
//
// DATA FLOW:
//   This component imports data from the /data/ folder
//   and passes it DOWN to child components via PROPS.
//
//   services array   → passed to <ServiceCards services={services} />
//   requests array   → passed to <RecentRequests requests={recentRequests} />
//
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, InputGroup, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

// ── Import Child Components ──────────────────────────────────────────────
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import ServiceCards from "../components/ServiceCards";
import StatCards from "../components/StatCards";
import RecentRequests from "../components/RecentRequests";

// ── Import Data & Services ───────────────────────────────────────────────
import services from "../data/services";
import { requestsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ── Helper: Greeting based on time of day ────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [liveRequests, setLiveRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await requestsAPI.getMyRequests();
        if (res.success && res.data) {
          setLiveRequests(res.data);
        }
      } catch (err) {
        console.log("Error loading customer requests:", err.message);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    // ── OUTER DASHBOARD WRAPPER ────────────────────────────────────────
    //   "lf-dashboard-wrapper" is a custom CSS class defined in App.css.
    //   It sets up the side-by-side layout: sidebar on left, content on right.
    <div className="lf-dashboard-wrapper">

      {/* ════════════════════════════════════════════════════════════════
          SIDEBAR
          We pass activeTab="dashboard" so the sidebar knows to highlight
          the "Dashboard" menu item with a blue background.

          HOW PROPS WORK (recap):
            <DashboardSidebar activeTab="dashboard" />
            ↓ Inside DashboardSidebar.jsx:
            function DashboardSidebar({ activeTab }) {
              // activeTab === "dashboard"
              // used to add "active" CSS class to the matching nav link
            }
      ════════════════════════════════════════════════════════════════ */}
      <DashboardSidebar activeTab="dashboard" />

      {/* ════════════════════════════════════════════════════════════════
          MAIN CONTENT AREA
          Everything to the right of the sidebar lives here.
          "lf-dashboard-main" handles the layout and scrolling.
      ════════════════════════════════════════════════════════════════ */}
      <div className="lf-dashboard-main">

        {/* ── TOP NAVBAR ──────────────────────────────────────────────── */}
        {/*
          pageTitle prop: we pass "Dashboard" so the navbar can display it.
          <DashboardNavbar pageTitle="Dashboard" />
          Inside DashboardNavbar.jsx: <h5>{pageTitle}</h5> → renders "Dashboard"
        */}
        <DashboardNavbar pageTitle="Dashboard" />

        {/* ── SCROLLABLE PAGE CONTENT ─────────────────────────────────── */}
        <div className="lf-dashboard-content">
          <Container fluid className="px-0">

            {/* ════════════════════════════════════════════════════════
                1. WELCOME & SERVICE REQUEST HERO BANNER
                Merged greeting ("Good evening...") and CTA banner ("Need something fixed?").
                Contains the dynamic greeting, problem description,
                prominent Create Service Request button, and the service search bar.
            ════════════════════════════════════════════════════════ */}
            <div className="lf-dash-hero-banner">
              <div className="lf-dash-hero-top">
                <div>
                  <h2 className="lf-dash-hero-title">
                    {getGreeting()}, {user?.name || "Customer"} 👋
                  </h2>
                  <p className="lf-dash-hero-sub">
                    Need something fixed? Describe your problem and get matched with trusted local professionals.
                  </p>
                </div>
                {/* Create Request CTA button */}
                <Link to="/request" className="btn lf-btn-create-request-lg">
                  <i className="bi bi-plus-circle-fill me-2"></i>
                  Create Service Request
                </Link>
              </div>

              {/* Service Search Bar */}
              <div className="lf-dash-hero-search">
                <Form onSubmit={handleSearch}>
                  <InputGroup className="lf-dash-search-group">
                    {/* Left icon */}
                    <InputGroup.Text className="lf-dash-search-icon">
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>

                    {/* Text input — controlled by searchQuery state */}
                    <Form.Control
                      className="lf-dash-search-input"
                      type="text"
                      placeholder="Search for a service (e.g. Plumbing, AC Repair, Cleaning...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Search button */}
                    <Button
                      type="submit"
                      className="lf-dash-search-btn"
                    >
                      Search
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                2. POPULAR SERVICES SECTION
            ════════════════════════════════════════════════════════ */}
            <div className="lf-dash-section">
              <div className="lf-dash-section-header">
                <h5 className="lf-dash-section-title">Popular Services</h5>
                <Link to="/services" className="lf-dash-section-link">
                  View All <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              <ServiceCards services={services} />
            </div>

            {/* ════════════════════════════════════════════════════════
                3. OVERVIEW / STATS SECTION
            ════════════════════════════════════════════════════════ */}
            <div className="lf-dash-section">
              <div className="lf-dash-section-header">
                <h5 className="lf-dash-section-title">Overview</h5>
              </div>
              <StatCards />
            </div>

            {/* ════════════════════════════════════════════════════════
                4. RECENT REQUESTS SECTION
            ════════════════════════════════════════════════════════ */}
            <div className="lf-dash-section">
              <div className="lf-dash-section-header">
                <h5 className="lf-dash-section-title">Recent Requests</h5>
                <Link to="/requests" className="lf-dash-section-link">
                  View All <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              <RecentRequests requests={liveRequests} />
            </div>

          </Container>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
