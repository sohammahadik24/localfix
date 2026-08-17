// ─────────────────────────────────────────────────────────────────────────────
// src/pages/ProviderDashboard.jsx
//
// WHAT IS THIS PAGE?
//   The dedicated dashboard for Service Providers (technicians & professionals).
//   Route: /provider/dashboard
//
// FEATURES:
//   - Fetches live profile, verification status, and availability.
//   - Live availability toggle (Online / Offline).
//   - Displays dynamic KPI stats (New Leads, Active Jobs, Completed Jobs).
//   - Allows instant Acceptance of incoming bookings.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

// ── Import Reusable Layout Shell ──────────────────────────────────────────
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderNavbar  from "../components/ProviderNavbar";

// ── Import API Services & Auth Context ────────────────────────────────────
import { providersAPI, requestsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProviderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Profile
      try {
        const pRes = await providersAPI.getMyProfile();
        if (pRes.success && pRes.data) {
          setProfile(pRes.data);
          setIsOnline(pRes.data.isAvailable);
        }
      } catch (e) {
        console.log("No profile yet or failed to load profile:", e.message);
      }

      // 2. Assigned Jobs
      try {
        const jRes = await requestsAPI.getProviderRequests();
        if (jRes.success && jRes.data) {
          setAssignedJobs(jRes.data);
        }
      } catch (e) {
        console.log("Error loading assigned jobs:", e.message);
      }

      // 3. Open Available Requests (Filtered to provider's specific category)
      try {
        const rRes = await requestsAPI.getAvailableRequests();
        if (rRes.success && rRes.data) {
          setIncomingRequests(rRes.data);
        }
      } catch (e) {
        console.log("Error loading open requests:", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Toggle Availability
  const handleToggleAvailability = async () => {
    setTogglingAvailability(true);
    try {
      const nextState = !isOnline;
      const res = await providersAPI.updateAvailability(nextState);
      if (res.success) {
        setIsOnline(nextState);
        setAlertMsg(`Availability updated: You are now ${nextState ? "Online (Accepting Jobs)" : "Offline (Busy)"}`);
        setTimeout(() => setAlertMsg(""), 4000);
      }
    } catch (err) {
      alert(err.message || "Failed to update availability.");
    } finally {
      setTogglingAvailability(false);
    }
  };

  // Handle Accept Job
  const handleAccept = async (reqId, title) => {
    try {
      const res = await requestsAPI.acceptRequest(reqId);
      if (res.success) {
        setAlertMsg(`✓ Booking "${title || 'Job'}" accepted! Customer has been notified.`);
        loadDashboardData();
        setTimeout(() => setAlertMsg(""), 4000);
      }
    } catch (err) {
      alert(err.message || "Failed to accept booking.");
    }
  };

  // Handle Decline Job
  const handleDecline = (reqId, title) => {
    setIncomingRequests((prev) => prev.filter((r) => (r._id || r.id) !== reqId));
    setAlertMsg(`Request "${title}" dismissed.`);
    setTimeout(() => setAlertMsg(""), 4000);
  };

  // Calculate Metrics
  const activeJobs = assignedJobs.filter((j) => ["Accepted", "On the Way", "In Progress"].includes(j.status));
  const completedJobs = assignedJobs.filter((j) => j.status === "Completed");

  return (
    <div className="lf-dashboard-wrapper">
      <ProviderSidebar activeTab="dashboard" />

      <div className="lf-dashboard-main">
        <ProviderNavbar pageTitle="Provider Dashboard" />

        <div className="lf-dashboard-content">
          <Container fluid className="px-0">
            {/* ── 1. WELCOME & AVAILABILITY BANNER ───────────────────────── */}
            <div className="lf-rd-header-card mb-4">
              <div className="lf-rd-header-left">
                <div className="lf-provider-avatar" style={{ backgroundColor: "#2563EB" }}>
                  {user?.name?.substring(0, 2).toUpperCase() || "LF"}
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h3 className="lf-profile-name mb-0">{user?.name || "Service Provider"}</h3>
                    <Badge
                      bg={profile?.isVerified === "Verified" ? "success" : profile?.isVerified === "Rejected" ? "danger" : "warning"}
                      text={profile?.isVerified === "Pending" ? "dark" : "white"}
                      className="lf-provider-verified-pill"
                    >
                      <i className="bi bi-patch-check-fill me-1"></i>
                      {profile?.isVerified || "Pending"} Professional
                    </Badge>
                  </div>
                  <p className="text-muted small mb-0">
                    {profile?.businessName || "LocalFix Certified Professional"} • {profile?.services?.join(", ") || "Multi-Service"}
                  </p>
                </div>
              </div>

              {/* Online / Offline Toggle Button */}
              <div className="lf-rd-header-right">
                <Button
                  variant={isOnline ? "success" : "outline-secondary"}
                  size="sm"
                  disabled={togglingAvailability}
                  className="rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                  onClick={handleToggleAvailability}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: isOnline ? "#FFFFFF" : "#6B7280",
                      display: "inline-block",
                    }}
                  ></span>
                  {togglingAvailability
                    ? "Updating..."
                    : isOnline
                    ? "Online · Accepting Jobs"
                    : "Offline · Busy"}
                </Button>
              </div>
            </div>

            {/* Notification alert */}
            {alertMsg && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setAlertMsg("")}
                className="lf-action-alert mb-4"
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                {alertMsg}
              </Alert>
            )}

            {/* ── 2. KPI STAT CARDS ──────────────────────────────────────── */}
            <Row className="g-3 mb-4">
              <Col xs={6} lg={3}>
                <div className="lf-stat-card">
                  <div className="lf-stat-icon-wrap bg-primary-subtle text-primary">
                    <i className="bi bi-bell-fill"></i>
                  </div>
                  <div className="lf-stat-count">{incomingRequests.length}</div>
                  <div className="lf-stat-label">Available Leads</div>
                  <div className="lf-stat-sub">Ready to accept</div>
                </div>
              </Col>

              <Col xs={6} lg={3}>
                <div className="lf-stat-card">
                  <div className="lf-stat-icon-wrap bg-info-subtle text-info">
                    <i className="bi bi-tools"></i>
                  </div>
                  <div className="lf-stat-count">{activeJobs.length}</div>
                  <div className="lf-stat-label">Active Jobs</div>
                  <div className="lf-stat-sub">In progress or on way</div>
                </div>
              </Col>

              <Col xs={6} lg={3}>
                <div className="lf-stat-card">
                  <div className="lf-stat-icon-wrap bg-success-subtle text-success">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="lf-stat-count">{completedJobs.length}</div>
                  <div className="lf-stat-label">Completed Jobs</div>
                  <div className="lf-stat-sub">Finished & verified</div>
                </div>
              </Col>

              <Col xs={6} lg={3}>
                <div className="lf-stat-card">
                  <div className="lf-stat-icon-wrap bg-warning-subtle text-warning">
                    <i className="bi bi-star-fill text-dark"></i>
                  </div>
                  <div className="lf-stat-count">5.0 ★</div>
                  <div className="lf-stat-label">Service Rating</div>
                  <div className="lf-stat-sub">LocalFix rating</div>
                </div>
              </Col>
            </Row>

            {/* ── 3. TWO-COLUMN LAYOUT ───────────────────────────────────── */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="text-muted fs-7">Loading provider dashboard...</p>
              </div>
            ) : (
              <Row className="g-4">
                {/* LEFT COLUMN: Incoming Customer Requests */}
                <Col lg={7}>
                  <Card className="lf-profile-card mb-4">
                    <Card.Header className="lf-profile-card-header d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <div className="lf-rd-card-header-icon">
                          <i className="bi bi-inbox-fill"></i>
                        </div>
                        <h5 className="lf-profile-card-title mb-0">Open Service Requests</h5>
                      </div>
                      <Badge bg="primary" pill>
                        {incomingRequests.length} Available
                      </Badge>
                    </Card.Header>

                    <Card.Body className="p-4">
                      {incomingRequests.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                          {incomingRequests.slice(0, 5).map((req) => {
                            const reqId = req._id || req.id;
                            const customerName =
                              typeof req.customer === "object" && req.customer !== null
                                ? req.customer.name
                                : req.customer || "Local Customer";

                            return (
                              <div key={reqId} className="p-3 border rounded-3 bg-light">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div>
                                    <h6 className="fw-bold text-dark mb-1">{req.title}</h6>
                                    <span className="text-muted small">
                                      <i className="bi bi-person-fill me-1"></i> Customer: {customerName}
                                    </span>
                                  </div>
                                  <span className="badge bg-success-subtle text-success fs-6 fw-bold">
                                    ₹500 - ₹1,200
                                  </span>
                                </div>

                                <p className="small text-muted mb-2">{req.description}</p>

                                <div className="d-flex align-items-center gap-3 text-muted small mb-3 flex-wrap">
                                  <span>
                                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                    {req.location}
                                  </span>
                                  <span>
                                    <i className="bi bi-clock-fill text-primary me-1"></i>
                                    {req.preferredDate || "Flexible"} {req.preferredTime && `at ${req.preferredTime}`}
                                  </span>
                                  {req.aiCategory && (
                                    <span className="badge bg-light text-primary border">
                                      <i className="bi bi-robot me-1"></i> AI: {req.aiCategory}
                                    </span>
                                  )}
                                </div>

                                <div className="d-flex gap-2 justify-content-end">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDecline(reqId, req.title)}
                                  >
                                    Decline
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    className="lf-action-btn-primary"
                                    onClick={() => handleAccept(reqId, req.title)}
                                  >
                                    <i className="bi bi-check-lg me-1"></i> Accept Booking
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                          {incomingRequests.length > 5 && (
                            <Link to="/provider/requests" className="btn btn-outline-primary btn-sm w-100">
                              View All {incomingRequests.length} Available Requests →
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted">
                          <i className="bi bi-check-all fs-2 text-success d-block mb-2"></i>
                          <p className="mb-0 fw-semibold text-dark">You're all caught up!</p>
                          <small>New customer requests in your area will appear here automatically.</small>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {/* RIGHT COLUMN: Active Job & Reviews */}
                <Col lg={5} className="d-flex flex-column gap-4">
                  {/* Active Job Card */}
                  <Card className="lf-profile-card">
                    <Card.Header className="lf-profile-card-header d-flex align-items-center gap-2">
                      <div className="lf-rd-card-header-icon bg-info-subtle text-info">
                        <i className="bi bi-hourglass-split"></i>
                      </div>
                      <h5 className="lf-profile-card-title mb-0">Active Job in Progress</h5>
                    </Card.Header>

                    <Card.Body className="p-4">
                      {activeJobs.length > 0 ? (
                        <>
                          <div className="p-3 border rounded-3 bg-white mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <h6 className="fw-bold mb-0 text-dark">{activeJobs[0].title}</h6>
                              <Badge bg={activeJobs[0].status === "On the Way" ? "info" : "primary"}>
                                {activeJobs[0].status}
                              </Badge>
                            </div>
                            <p className="small text-muted mb-2">
                              Location: {activeJobs[0].location}
                            </p>
                            <div className="d-flex justify-content-between align-items-center small">
                              <span className="text-muted">
                                Customer: {typeof activeJobs[0].customer === "object" ? activeJobs[0].customer.name : activeJobs[0].customer}
                              </span>
                              <strong className="text-success">Active</strong>
                            </div>
                          </div>

                          <Link to="/provider/jobs" className="btn btn-outline-primary btn-sm w-100">
                            Go to My Jobs to Update Status →
                          </Link>
                        </>
                      ) : (
                        <div className="text-center py-3 text-muted">
                          <p className="mb-2">No jobs currently in progress.</p>
                          <Link to="/provider/requests" className="btn btn-primary btn-sm">
                            Find New Requests
                          </Link>
                        </div>
                      )}
                    </Card.Body>
                  </Card>

                  {/* Provider Rating Card */}
                  <Card className="lf-profile-card">
                    <Card.Header className="lf-profile-card-header d-flex align-items-center gap-2">
                      <div className="lf-rd-card-header-icon bg-warning-subtle text-warning">
                        <i className="bi bi-star-fill text-dark"></i>
                      </div>
                      <h5 className="lf-profile-card-title mb-0">Customer Ratings &amp; Trust</h5>
                    </Card.Header>

                    <Card.Body className="p-4 text-center">
                      <div className="display-5 fw-bold text-dark mb-1">
                        5.0 <span className="fs-5 text-warning">★</span>
                      </div>
                      <p className="text-muted small mb-3">LocalFix Verified Professional</p>
                      <div className="p-3 bg-light rounded-3 text-start small">
                        <p className="fst-italic text-dark mb-1">
                          "Prompt, courteous service and high quality repairs."
                        </p>
                        <span className="text-muted">- Local Customer Feedback</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default ProviderDashboard;
