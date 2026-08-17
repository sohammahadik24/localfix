// ─────────────────────────────────────────────────────────────────────────────
// src/pages/MyRequests.jsx
//
// WHAT IS THIS FILE?
//   The "My Requests" page for LocalFix customers.
//   It allows customers to track and manage all service requests they have created.
//
// WHAT DOES THIS COMPONENT DO?
//   1. Reuses DashboardSidebar (with activeTab="requests") and DashboardNavbar.
//   2. Manages search state (searchQuery) and filter state (activeFilter).
//   3. Uses JavaScript .filter() to combine search query and status filter in real time.
//   4. Renders dynamic request count and list of <RequestCard /> components.
//   5. Displays a helpful empty state when no requests match the search/filter.
//
// REACT CONCEPTS DEMONSTRATED:
//   - useState for local reactive state
//   - Array.prototype.filter() for multi-criteria searching
//   - Array.prototype.map() for list rendering with unique keys
//   - Props passing to child components (RequestFilters & RequestCard)
//   - Conditional rendering (empty state vs. request list)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useMemo } from "react";
import { Container, InputGroup, Form, Button, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

// ── Import Reusable Layout Components ─────────────────────────────────────
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar  from "../components/DashboardNavbar";

// ── Import Page-Specific Components ───────────────────────────────────────
import RequestFilters from "../components/RequestFilters";
import RequestCard    from "../components/RequestCard";

// ── Import API Service ────────────────────────────────────────────────────
import { requestsAPI } from "../services/api";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── 1. STATE FOR SEARCH INPUT ───────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  // ── 2. STATE FOR STATUS FILTER TAB ──────────────────────────────────────
  const [activeFilter, setActiveFilter] = useState("All");

  // ── 3. FETCH LIVE REQUESTS FROM BACKEND ─────────────────────────────────
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await requestsAPI.getMyRequests();
        if (res.success && res.data) {
          setRequests(res.data);
        }
      } catch (err) {
        setError(err.message || "Failed to load your service requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // ── 4. COMPUTE COUNTS FOR EACH FILTER OPTION ───────────────────────────
  const filterCounts = useMemo(() => {
    const counts = {
      All: requests.length,
      Pending: 0,
      Accepted: 0,
      "In Progress": 0,
      "On the Way": 0,
      Completed: 0,
      Cancelled: 0,
    };

    requests.forEach((req) => {
      if (counts[req.status] !== undefined) {
        counts[req.status] += 1;
      }
    });

    return counts;
  }, [requests]);

  // ── 5. COMBINED SEARCH + FILTER LOGIC ───────────────────────────────────
  const filteredRequests = requests.filter((req) => {
    const matchesStatus =
      activeFilter === "All" || req.status === activeFilter;

    const query = searchQuery.toLowerCase().trim();
    const providerName =
      typeof req.provider === "object" && req.provider !== null
        ? req.provider.name
        : req.provider || "";

    const matchesSearch =
      !query ||
      (req.title && req.title.toLowerCase().includes(query)) ||
      (req.service && req.service.toLowerCase().includes(query)) ||
      (req.aiCategory && req.aiCategory.toLowerCase().includes(query)) ||
      (req.description && req.description.toLowerCase().includes(query)) ||
      providerName.toLowerCase().includes(query) ||
      (req.location && req.location.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="lf-dashboard-wrapper">
      {/* ── SIDEBAR (reused from Customer Dashboard) ──────────────────────── */}
      <DashboardSidebar activeTab="requests" />

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────────── */}
      <div className="lf-dashboard-main">
        {/* Top Navbar */}
        <DashboardNavbar pageTitle="My Requests" />

        {/* Scrollable Page Content */}
        <div className="lf-dashboard-content">
          <Container fluid className="px-0">

            {/* ── 1. PAGE HEADER ROW ─────────────────────────────────────── */}
            <div className="lf-requests-header-row">
              <div>
                <h2 className="lf-requests-title">My Requests</h2>
                <p className="lf-requests-sub">
                  Track and manage your scheduled and ongoing service requests.
                </p>
              </div>

              {/* Action Button: Create New Request */}
              <Link to="/request" className="btn lf-btn-create-request">
                <i className="bi bi-plus-circle-fill me-2"></i>
                Create New Request
              </Link>
            </div>

            {/* ── 2. SEARCH BAR ──────────────────────────────────────────── */}
            <div className="lf-requests-search-bar">
              <InputGroup className="lf-dash-search-group">
                <InputGroup.Text className="lf-dash-search-icon">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  className="lf-dash-search-input"
                  type="text"
                  placeholder="Search by title, service (e.g. Plumbing), provider, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="light"
                    className="lf-search-clear-btn"
                    onClick={() => setSearchQuery("")}
                    title="Clear search"
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                )}
              </InputGroup>
            </div>

            {/* ── 3. STATUS FILTERS ──────────────────────────────────────── */}
            <div className="mb-3">
              <RequestFilters
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                counts={filterCounts}
              />
            </div>

            {/* ── 4. REQUEST COUNT & SUMMARY BAR ─────────────────────────── */}
            <div className="lf-requests-count-bar">
              <span className="lf-requests-count-text">
                Showing{" "}
                <strong>
                  {filteredRequests.length}
                </strong>{" "}
                {filteredRequests.length === 1 ? "request" : "requests"}
                {activeFilter !== "All" && ` in "${activeFilter}"`}
                {searchQuery && ` matching "${searchQuery}"`}
              </span>

              {/* Reset filters shortcut if any filter/search is active */}
              {(activeFilter !== "All" || searchQuery) && (
                <button
                  type="button"
                  className="lf-reset-filters-btn"
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchQuery("");
                  }}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Reset Filters
                </button>
              )}
            </div>

            {/* ── 5. REQUEST LIST OR EMPTY STATE ─────────────────────────── */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="text-muted fs-7">Loading your service bookings from LocalFix...</p>
              </div>
            ) : error ? (
              <Alert variant="danger" className="py-3 text-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            ) : filteredRequests.length > 0 ? (
              <div className="lf-requests-list">
                {filteredRequests.map((req) => (
                  <RequestCard key={req._id || req.id} request={req} />
                ))}
              </div>
            ) : (
              /*
                Empty State:
                Shown when no requests match the current search or status filter.
              */
              <div className="lf-requests-empty-card">
                <div className="lf-requests-empty-icon-wrap">
                  <i className="bi bi-clipboard-x"></i>
                </div>
                <h4 className="lf-requests-empty-title">No Requests Found</h4>
                <p className="lf-requests-empty-desc">
                  {searchQuery || activeFilter !== "All"
                    ? `We couldn't find any requests matching your current filter "${activeFilter}" and search "${searchQuery}".`
                    : "You have not submitted any service requests yet."}
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  {(searchQuery || activeFilter !== "All") && (
                    <Button
                      variant="outline-secondary"
                      className="lf-empty-reset-btn"
                      onClick={() => {
                        setActiveFilter("All");
                        setSearchQuery("");
                      }}
                    >
                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                      Clear Filters
                    </Button>
                  )}
                  <Link to="/request" className="btn lf-btn-create-request">
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    Create Service Request
                  </Link>
                </div>
              </div>
            )}

          </Container>
        </div>
      </div>
    </div>
  );
}

export default MyRequests;
