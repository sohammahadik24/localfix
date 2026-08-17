// ─────────────────────────────────────────────────────────────────────────────
// src/pages/ServicesPage.jsx
//
// Public and authenticated-friendly Services Catalog page.
// Features live search, category filtering, pricing guides, and direct booking.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import services from "../data/services";

function ServicesPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Categories list for filter pills
  const categories = [
    { id: "all", label: "All Services", icon: "bi-grid-fill" },
    { id: "Plumbing", label: "Plumbing", icon: "bi-droplet-fill" },
    { id: "Electrical", label: "Electrical", icon: "bi-lightning-charge-fill" },
    { id: "AC Repair", label: "AC Repair", icon: "bi-snow" },
    { id: "Cleaning", label: "Cleaning", icon: "bi-stars" },
    { id: "Carpentry", label: "Carpentry", icon: "bi-hammer" },
    { id: "Appliance", label: "Appliance", icon: "bi-tv-fill" },
  ];

  const query = searchQuery.toLowerCase().trim();

  const filteredServices = services.filter((service) => {
    const matchesCategory =
      selectedCategory === "all" ||
      service.name.toLowerCase().includes(selectedCategory.toLowerCase());

    if (!matchesCategory) return false;
    if (!query) return true;

    const matchesName = service.name.toLowerCase().includes(query);
    const matchesDesc = service.description.toLowerCase().includes(query);
    return matchesName || matchesDesc;
  });

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />

      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="bg-white py-5 border-bottom">
        <Container>
          <div className="text-center max-w-700 mx-auto">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-3">
              EXPERT HOME & COMMERCIAL SERVICES
            </span>
            <h1 className="display-5 fw-bold text-dark mb-3">
              Explore Our Services
            </h1>
            <p className="lead text-muted mb-4">
              Connect with vetted, top-rated local professionals for repairs, installations, and maintenance.
            </p>

            {/* Search Input Bar */}
            <div className="mx-auto" style={{ maxWidth: "600px" }}>
              <InputGroup className="shadow-sm rounded-pill overflow-hidden border p-1 bg-white">
                <InputGroup.Text className="bg-white border-0 ps-3 text-muted">
                  <i className="bi bi-search fs-5 text-primary"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search plumbing, AC repair, electricians, painting..."
                  className="border-0 shadow-none py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="link"
                    className="text-muted text-decoration-none border-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </Button>
                )}
                <Button className="btn-getstarted rounded-pill px-4 me-1 my-1">
                  Search
                </Button>
              </InputGroup>
            </div>

            {/* Category Filter Pills */}
            <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "btn-primary shadow-sm"
                      : "btn-light border text-muted"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <i className={`bi ${cat.icon} me-1`}></i>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────────────── */}
      <section className="py-5 flex-grow-1">
        <Container>
          {/* Active Filter Indicators */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold text-dark mb-1">
                {selectedCategory === "all" ? "All Available Services" : `${selectedCategory} Services`}
              </h4>
              <p className="text-muted small mb-0">
                Showing {filteredServices.length} verified category offerings
              </p>
            </div>

            {(searchQuery || selectedCategory !== "all") && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="rounded-pill"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
              </Button>
            )}
          </div>

          {filteredServices.length > 0 ? (
            <Row className="g-4">
              {filteredServices.map((service) => (
                <Col key={service.id} xs={12} md={6} lg={4}>
                  <Card className="h-100 border-0 shadow-sm rounded-4 p-4 hover-lift d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3 fs-3"
                          style={{
                            width: "56px",
                            height: "56px",
                            backgroundColor: `${service.color || "#2563EB"}18`,
                            color: service.color || "#2563EB",
                          }}
                        >
                          {service.emoji ? (
                            <span>{service.emoji}</span>
                          ) : (
                            <i className={service.icon || "bi bi-tools"}></i>
                          )}
                        </div>

                        <Badge bg="light" text="dark" className="border rounded-pill px-3 py-2">
                          <i className="bi bi-people-fill text-primary me-1"></i>
                          {service.professionals || `${service.providers || 15}+ Pros`}
                        </Badge>
                      </div>

                      <h5 className="fw-bold text-dark mb-2">{service.name}</h5>
                      <p className="text-muted small mb-3">{service.description}</p>
                    </div>

                    <div className="pt-3 border-top mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <small className="text-muted d-block">Starting from</small>
                          <strong className="text-success fs-5">₹299</strong>
                        </div>
                        <div className="text-end">
                          <small className="text-muted d-block">Avg. Rating</small>
                          <span className="badge bg-warning-subtle text-warning-emphasis fw-bold">
                            <i className="bi bi-star-fill text-warning me-1"></i> 4.8 / 5.0
                          </span>
                        </div>
                      </div>

                      <Button
                        as={Link}
                        to={`/request?service=${encodeURIComponent(service.name)}`}
                        className="btn-getstarted w-100 py-2 fw-semibold"
                      >
                        Book {service.name} <i className="bi bi-arrow-right ms-1"></i>
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="border-0 shadow-sm rounded-4 p-5 text-center my-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light text-muted mx-auto mb-3"
                style={{ width: "80px", height: "80px", fontSize: "2rem" }}
              >
                <i className="bi bi-search"></i>
              </div>
              <h4 className="fw-bold text-dark">No Services Found</h4>
              <p className="text-muted mb-4">
                We couldn't find any services matching "<strong>{searchQuery}</strong>".
              </p>
              <div>
                <Button
                  variant="primary"
                  className="rounded-pill px-4"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          )}
        </Container>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
      <section className="bg-white py-5 border-top">
        <Container>
          <div className="p-4 p-md-5 rounded-4 bg-primary text-white text-center position-relative overflow-hidden shadow">
            <h2 className="fw-bold mb-2">Can't Find the Exact Service You Need?</h2>
            <p className="text-white-50 mb-4 max-w-600 mx-auto">
              Our network of certified technicians handles custom and emergency repair jobs. Contact support or post a custom request.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button as={Link} to="/request" variant="light" className="fw-bold px-4 py-2 text-primary shadow">
                Submit Custom Request
              </Button>
              <Button as={Link} to="/help" variant="outline-light" className="fw-bold px-4 py-2">
                Contact Support
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default ServicesPage;
