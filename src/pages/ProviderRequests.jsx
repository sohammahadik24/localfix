// ─────────────────────────────────────────────────────────────────────────────
// src/pages/ProviderRequests.jsx
//
// WHAT IS THIS PAGE?
//   The "Service Requests" management page for LocalFix providers.
//   Route: /provider/requests
//
// FEATURES:
//   - Fetches available pending service requests from Express backend & MongoDB.
//   - Allows provider to Accept requests (PATCH /api/requests/:id/accept).
//   - Filters by category, status, and search query.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, InputGroup, Form, Button, Alert, Spinner } from "react-bootstrap";

// ── Import Provider Layout Components ─────────────────────────────────────
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderNavbar  from "../components/ProviderNavbar";

// ── Import Provider Request Card ──────────────────────────────────────────
import ProviderRequestCard from "../components/ProviderRequestCard";

// ── Import API Service ────────────────────────────────────────────────────
import { requestsAPI } from "../services/api";

function ProviderRequests() {
  const [requestsList, setRequestsList] = useState([]);
  const [providerSkill, setProviderSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [alertMsg, setAlertMsg] = useState("");

  const categories = ["All", "Plumbing", "Electrical", "AC Repair", "Cleaning", "Carpentry", "Painting", "Appliance Repair"];
  const statusOptions = ["All", "Pending", "Accepted"];

  // Fetch available requests from backend (Filtered strictly by provider category)
  const fetchAvailableRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await requestsAPI.getAvailableRequests();
      if (res.success && res.data) {
        setRequestsList(res.data);
        if (res.providerSkill) {
          setProviderSkill(res.providerSkill);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load available service requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRequests();
  }, []);

  // Handle Accept Action
  const handleAccept = async (reqId, title) => {
    try {
      const res = await requestsAPI.acceptRequest(reqId);
      if (res.success) {
        setAlertMsg(`✓ You have accepted the request for "${title || 'Job'}"! Customer has been notified.`);
        fetchAvailableRequests();
        setTimeout(() => setAlertMsg(""), 4000);
      }
    } catch (err) {
      alert(err.message || "Failed to accept service request.");
    }
  };

  // Handle Reject Action (Local UI dismiss)
  const handleReject = (reqId, title) => {
    setRequestsList((prev) => prev.filter((r) => (r._id || r.id) !== reqId));
    setAlertMsg(`You dismissed the request for "${title}".`);
    setTimeout(() => setAlertMsg(""), 4000);
  };

  // Multi-criteria filter
  const query = searchQuery.toLowerCase().trim();

  const filteredRequests = requestsList.filter((req) => {
    const customerName =
      typeof req.customer === "object" && req.customer !== null
        ? req.customer.name
        : req.customer || "";

    const matchesSearch =
      !query ||
      (req.title && req.title.toLowerCase().includes(query)) ||
      (req.service && req.service.toLowerCase().includes(query)) ||
      customerName.toLowerCase().includes(query) ||
      (req.description && req.description.toLowerCase().includes(query)) ||
      (req.location && req.location.toLowerCase().includes(query));

    const matchesService =
      selectedService === "All" || req.service === selectedService;

    const matchesStatus =
      selectedStatus === "All" || req.status === selectedStatus;

    return matchesSearch && matchesService && matchesStatus;
  });

  return (
    <div className="lf-dashboard-wrapper">
      <ProviderSidebar activeTab="requests" />

      <div className="lf-dashboard-main">
        <ProviderNavbar pageTitle="Service Requests" />

        <div className="lf-dashboard-content">
          <Container fluid className="px-0">
            {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h2 className="lf-requests-title mb-0">Available Service Requests</h2>
                  {providerSkill && (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fs-7">
                      <i className="bi bi-tools me-1"></i> Showing Trade: <strong>{providerSkill}</strong>
                    </span>
                  )}
                </div>
                <p className="lf-requests-sub mt-1 mb-0">
                  Showing customer service requests tailored to your registered category.
                </p>
              </div>
              <Button variant="outline-primary" size="sm" onClick={fetchAvailableRequests}>
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh Requests
              </Button>
            </div>

            {/* Notification alert */}
            {alertMsg && (
              <Alert variant="success" dismissible onClose={() => setAlertMsg("")} className="py-2 mb-3">
                <i className="bi bi-check-circle-fill me-2"></i>
                {alertMsg}
              </Alert>
            )}

            {/* ── 2. SEARCH & FILTER CONTROLS ────────────────────────────── */}
            <Row className="g-3 mb-4">
              <Col md={6}>
                <InputGroup className="lf-dash-search-group">
                  <InputGroup.Text className="lf-dash-search-icon">
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by customer, title, service, area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="lf-dash-search-input"
                  />
                  {searchQuery && (
                    <Button variant="light" onClick={() => setSearchQuery("")}>
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  )}
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="lf-form-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Services" : cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={3}>
                <div className="d-flex gap-1 h-100 align-items-center">
                  {statusOptions.map((st) => (
                    <Button
                      key={st}
                      variant={selectedStatus === st ? "primary" : "outline-secondary"}
                      size="sm"
                      className="flex-fill"
                      onClick={() => setSelectedStatus(st)}
                    >
                      {st}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>

            {/* ── 3. LIST OF REQUESTS / LOADING / EMPTY STATE ─────────────── */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="text-muted fs-7">Loading open requests from MongoDB...</p>
              </div>
            ) : error ? (
              <Alert variant="danger" className="py-3 text-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <ProviderRequestCard
                  key={req._id || req.id}
                  request={req}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))
            ) : (
              <div className="lf-requests-empty-card">
                <div className="lf-requests-empty-icon-wrap">
                  <i className="bi bi-inbox text-muted"></i>
                </div>
                <h5 className="lf-requests-empty-title">No Available Requests</h5>
                <p className="lf-requests-empty-desc">
                  There are currently no new open service bookings matching your filter criteria.
                </p>
              </div>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default ProviderRequests;
