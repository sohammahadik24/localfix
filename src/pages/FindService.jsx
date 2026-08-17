// ─────────────────────────────────────────────────────────────────────────────
// src/pages/FindService.jsx
//
// WHAT IS THIS PAGE?
//   The "Find a Service" page for LocalFix customers.
//   Route: /services
//
// WHAT DOES THIS COMPONENT DO?
//   1. Reuses DashboardSidebar (with activeTab="services") and DashboardNavbar.
//   2. Manages search state (searchQuery) using React's useState() hook.
//   3. Uses JavaScript's .filter() method to filter services by name and description.
//   4. Uses JavaScript's .map() method to dynamically render a grid of <ServiceCard /> components.
//   5. Renders a friendly empty state if no services match the search query.
//
// REACT CONCEPTS DEMONSTRATED:
//   - useState() for reactive search input state
//   - Array.prototype.filter() for real-time multi-field search filtering
//   - Array.prototype.map() for generating dynamic lists with unique keys
//   - Props passing to child components (<ServiceSearch /> and <ServiceCard />)
//   - Conditional rendering (cards grid vs. empty search state)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

// ── Import Reusable Layout Shell ──────────────────────────────────────────
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar  from "../components/DashboardNavbar";

// ── Import Page-Specific Components ───────────────────────────────────────
import ServiceSearch from "../components/ServiceSearch";
import ServiceCard   from "../components/ServiceCard";

// ── Import Static Service Data ────────────────────────────────────────────
import services from "../data/services";

function FindService() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // ── 2. FILTERING LOGIC (Array.prototype.filter) ─────────────────────────
  //
  // HOW .filter() WORKS:
  //   .filter() goes through every item in the services array.
  //   For each service, it tests if our condition returns true:
  //     - If true  → the service is kept in filteredServices
  //     - If false → the service is excluded
  //
  // Search matches if:
  //   a) The user hasn't typed anything (!query is true)
  //   OR
  //   b) The service name contains the search text
  //   OR
  //   c) The service description contains the search text
  //
  // .toLowerCase() makes the search CASE-INSENSITIVE (e.g. "plumbing" matches "Plumbing").
  // .trim() removes any leading or trailing accidental spaces.
  //
  const query = searchQuery.toLowerCase().trim();

  const filteredServices = services.filter((service) => {
    if (!query) return true; // Show all services if search is empty

    const matchesName = service.name.toLowerCase().includes(query);
    const matchesDescription = service.description.toLowerCase().includes(query);

    return matchesName || matchesDescription;
  });

  return (
    <div className="lf-dashboard-wrapper">
      {/* ── SIDEBAR (Active tab: "services") ──────────────────────────────── */}
      <DashboardSidebar activeTab="services" />

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────────── */}
      <div className="lf-dashboard-main">
        {/* Top Navbar */}
        <DashboardNavbar pageTitle="Find a Service" />

        {/* Scrollable Page Content */}
        <div className="lf-dashboard-content">
          <Container fluid className="px-0">

            {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
            <div className="lf-find-services-header mb-4">
              <h2 className="lf-find-services-title">Find a Service</h2>
              <p className="lf-find-services-subtitle">
                Choose the service you need and connect with a trusted local professional.
              </p>
            </div>

            {/* ── 2. LARGE SEARCH BAR ────────────────────────────────────── */}
            <div className="mb-4">
              <ServiceSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>

            {/* ── 3. RESULTS COUNT BAR (Shown when filtering) ────────────── */}
            {searchQuery && (
              <div className="lf-services-count-bar mb-4">
                <span className="lf-services-count-text">
                  Showing <strong>{filteredServices.length}</strong> of{" "}
                  <strong>{services.length}</strong> services matching "{searchQuery}"
                </span>
                <button
                  type="button"
                  className="lf-reset-filters-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="bi bi-arrow-counterclockwise me-1"></i>
                  Reset Search
                </button>
              </div>
            )}

            {/* ── 4. SERVICE CARDS GRID OR EMPTY STATE ───────────────────── */}
            {filteredServices.length > 0 ? (
              /*
                HOW .map() WORKS HERE:
                filteredServices.map((service) => (
                  <Col key={service.id}> <ServiceCard service={service} /> </Col>
                ))
                It loops through all matching services and generates a responsive
                Bootstrap column and <ServiceCard /> for each one.
              */
              <Row className="g-4">
                {filteredServices.map((service) => (
                  <Col key={service.id} xs={12} md={6} lg={4}>
                    <ServiceCard service={service} />
                  </Col>
                ))}
              </Row>
            ) : (
              /*
                EMPTY STATE:
                Rendered when no services match the search query.
              */
              <div className="lf-requests-empty-card">
                <div className="lf-requests-empty-icon-wrap">
                  <i className="bi bi-search"></i>
                </div>
                <h4 className="lf-requests-empty-title">No Services Found</h4>
                <p className="lf-requests-empty-desc">
                  We couldn't find any service matching "<strong>{searchQuery}</strong>".
                  Try searching for terms like <em>Plumbing</em>, <em>AC</em>, <em>Cleaning</em>, or <em>Electrical</em>.
                </p>
                <Button
                  variant="outline-primary"
                  className="lf-empty-reset-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Clear Search
                </Button>
              </div>
            )}

          </Container>
        </div>
      </div>
    </div>
  );
}

export default FindService;
