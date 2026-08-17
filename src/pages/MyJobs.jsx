// ─────────────────────────────────────────────────────────────────────────────
// src/pages/MyJobs.jsx
//
// WHAT IS THIS PAGE?
//   The "My Jobs" management page for LocalFix service providers.
//   Route: /provider/jobs
//
// FEATURES:
//   - Fetches assigned jobs from Express backend & MongoDB in real-time.
//   - Allows provider to advance status: Accepted ➔ On the Way ➔ In Progress ➔ Completed.
//   - Filters jobs by Status tabs and Search query.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, InputGroup, Form, Button, Alert, Spinner } from "react-bootstrap";

// ── Import Provider Layout Components ─────────────────────────────────────
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderNavbar  from "../components/ProviderNavbar";

// ── Import Job Card Component ─────────────────────────────────────────────
import JobCard from "../components/JobCard";

// ── Import API Service ────────────────────────────────────────────────────
import { requestsAPI } from "../services/api";

function MyJobs() {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [alertMsg, setAlertMsg] = useState("");

  const statusTabs = [
    { label: "All", value: "All" },
    { label: "Accepted", value: "Accepted" },
    { label: "On the Way", value: "On the Way" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
  ];

  const categories = ["All", "Plumbing", "Electrical", "AC Repair", "Cleaning", "Carpentry", "Painting", "Appliance Repair"];

  // Fetch provider's assigned jobs from MongoDB
  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await requestsAPI.getProviderRequests();
      if (res.success && res.data) {
        setJobsList(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load assigned jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle Update Status with backend PATCH /api/requests/:id/status
  const handleUpdateStatus = async (jobId, newStatus, title) => {
    try {
      const res = await requestsAPI.updateStatus(jobId, newStatus);
      if (res.success) {
        setAlertMsg(`✓ Status for "${title || 'Job'}" updated to "${newStatus}"!`);
        fetchJobs();
        setTimeout(() => setAlertMsg(""), 4000);
      }
    } catch (err) {
      alert(err.message || "Failed to update job status.");
    }
  };

  // Combined Filtering Logic
  const query = searchQuery.toLowerCase().trim();

  const filteredJobs = jobsList.filter((job) => {
    const customerName =
      typeof job.customer === "object" && job.customer !== null
        ? job.customer.name
        : job.customer || "";

    const matchesSearch =
      !query ||
      (job.title && job.title.toLowerCase().includes(query)) ||
      (job.service && job.service.toLowerCase().includes(query)) ||
      customerName.toLowerCase().includes(query) ||
      (job.location && job.location.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" || job.service === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getTabCount = (tabValue) => {
    if (tabValue === "All") return jobsList.length;
    return jobsList.filter((j) => j.status === tabValue).length;
  };

  return (
    <div className="lf-dashboard-wrapper">
      <ProviderSidebar activeTab="jobs" />

      <div className="lf-dashboard-main">
        <ProviderNavbar pageTitle="My Jobs" />

        <div className="lf-dashboard-content">
          <Container fluid className="px-0">
            {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h2 className="lf-requests-title">My Assigned Jobs</h2>
                <p className="lf-requests-sub">
                  Manage ongoing, on the way, and completed service orders.
                </p>
              </div>
              <Button variant="outline-primary" size="sm" onClick={fetchJobs}>
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh Jobs
              </Button>
            </div>

            {/* ── 2. ALERT BANNER ────────────────────────────────────────── */}
            {alertMsg && (
              <Alert variant="success" dismissible onClose={() => setAlertMsg("")} className="py-2 mb-3">
                <i className="bi bi-check-circle-fill me-2"></i>
                {alertMsg}
              </Alert>
            )}

            {/* ── 3. SEARCH & CATEGORY FILTER ROW ────────────────────────── */}
            <Row className="g-3 mb-3">
              <Col md={8}>
                <InputGroup className="lf-dash-search-group">
                  <InputGroup.Text className="lf-dash-search-icon">
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by customer name, job title, service, location..."
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

              <Col md={4}>
                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="lf-form-select"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            {/* ── 4. STATUS PILL TABS ────────────────────────────────────── */}
            <div className="d-flex gap-2 flex-wrap mb-4">
              {statusTabs.map((tab) => {
                const count = getTabCount(tab.value);
                const isActive = statusFilter === tab.value;
                return (
                  <button
                    key={tab.value}
                    className={`btn btn-sm ${isActive ? "btn-primary fw-semibold" : "btn-light text-muted border"} px-3 rounded-pill`}
                    onClick={() => setStatusFilter(tab.value)}
                  >
                    {tab.label}{" "}
                    <span className={`badge ms-1 ${isActive ? "bg-white text-primary" : "bg-secondary-subtle text-dark"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── 5. JOBS LIST / LOADING / EMPTY STATE ───────────────────── */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="text-muted fs-7">Loading your assigned jobs from LocalFix...</p>
              </div>
            ) : error ? (
              <Alert variant="danger" className="py-3 text-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))
            ) : (
              <div className="lf-requests-empty-card">
                <div className="lf-requests-empty-icon-wrap">
                  <i className="bi bi-briefcase text-muted"></i>
                </div>
                <h5 className="lf-requests-empty-title">No Jobs Found</h5>
                <p className="lf-requests-empty-desc">
                  {statusFilter !== "All"
                    ? `You currently have no jobs in "${statusFilter}" status.`
                    : "You have not accepted any jobs yet. Check available requests to find new bookings."}
                </p>
              </div>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default MyJobs;
