// ─────────────────────────────────────────────────────────────────────────────
// src/pages/AdminDashboard.jsx
//
// WHAT IS THIS PAGE?
//   Dedicated Super Administrator Portal for LocalFix.
//   Route: /admin or /admin/dashboard
//
// ADMIN CAPABILITIES:
//   1. Provider Verification Center: Approve or Reject new provider applications.
//   2. Work & Task Management: View, search, and manage all assigned platform bookings.
//   3. Customer & Provider Issues / Disputes: View ALL problems raised across the platform,
//      inspect details, add resolution notes, and resolve tickets.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Form, Tabs, Tab, Table, Modal, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { requestsAPI, providersAPI, supportAPI, notificationsAPI } from "../services/api";
import NotificationDropdown from "../components/NotificationDropdown";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tabs: "providers" | "work" | "issues"
  const [activeTab, setActiveTab] = useState("issues");
  const [requests, setRequests] = useState([]);
  const [providers, setProviders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all"); // "all" | "customer" | "provider"
  const [broadcastPriority, setBroadcastPriority] = useState("medium");
  const [broadcasting, setBroadcasting] = useState(false);

  // Filters
  const [providerFilter, setProviderFilter] = useState("Pending");
  const [providerSearch, setProviderSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");
  const [requestSearch, setRequestSearch] = useState("");

  // Ticket Filters
  const [ticketRoleFilter, setTicketRoleFilter] = useState("all");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [ticketSearch, setTicketSearch] = useState("");

  // Modals State
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderModal, setShowProviderModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketResolutionNote, setTicketResolutionNote] = useState("");

  const loadData = async () => {
    setLoading(true);
    setActionError("");
    try {
      const [reqRes, provRes, ticketRes] = await Promise.all([
        requestsAPI.getAllRequestsAdmin(),
        providersAPI.getAllProviders(),
        supportAPI.getAllTicketsAdmin(),
      ]);

      if (reqRes.success) setRequests(reqRes.data || []);
      if (provRes.success) setProviders(provRes.data || []);
      if (ticketRes.success) setTickets(ticketRes.data || []);
    } catch (err) {
      setActionError(err.message || "Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Provider Verification
  const handleVerifyProvider = async (providerId, verificationStatus) => {
    setActionError("");
    setActionSuccess("");
    try {
      const res = await providersAPI.verifyProvider(providerId, verificationStatus);
      if (res.success) {
        setActionSuccess(`✓ Provider verification status updated to '${verificationStatus}' in MongoDB!`);
        if (showProviderModal) setShowProviderModal(false);
        loadData();
        setTimeout(() => setActionSuccess(""), 5000);
      }
    } catch (err) {
      setActionError(err.message || "Failed to update verification status.");
    }
  };

  // Handle Admin Request Status Transition
  const handleUpdateStatus = async (requestId, newStatus) => {
    setActionError("");
    setActionSuccess("");
    try {
      const res = await requestsAPI.updateStatus(requestId, newStatus, "Status updated by Platform Admin");
      if (res.success) {
        setActionSuccess(`✓ Service request status updated to '${newStatus}'!`);
        loadData();
        if (showHistoryModal) setShowHistoryModal(false);
        setTimeout(() => setActionSuccess(""), 5000);
      }
    } catch (err) {
      setActionError(err.message || "Failed to update request status.");
    }
  };

  // Handle Ticket Status Update & Resolution
  const handleUpdateTicket = async (ticketId, status) => {
    setActionError("");
    setActionSuccess("");
    try {
      const res = await supportAPI.updateTicketStatus(ticketId, status, ticketResolutionNote);
      if (res.success) {
        setActionSuccess(`✓ Support problem marked as '${status}'!`);
        setShowTicketModal(false);
        setTicketResolutionNote("");
        loadData();
        setTimeout(() => setActionSuccess(""), 5000);
      }
    } catch (err) {
      setActionError(err.message || "Failed to update ticket status.");
    }
  };

  // Handle Admin Broadcast Dispatch
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");

    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      setActionError("Please provide both a broadcast title and message.");
      return;
    }

    setBroadcasting(true);
    try {
      const res = await notificationsAPI.broadcastNotification({
        title: broadcastTitle,
        message: broadcastMessage,
        targetRole: broadcastTarget,
        priority: broadcastPriority,
        type: "broadcast",
      });

      if (res.success) {
        setActionSuccess(`✓ Broadcast notification dispatched to '${broadcastTarget}' successfully!`);
        setShowBroadcastModal(false);
        setBroadcastTitle("");
        setBroadcastMessage("");
        setTimeout(() => setActionSuccess(""), 5000);
      }
    } catch (err) {
      setActionError(err.message || "Failed to dispatch broadcast.");
    } finally {
      setBroadcasting(false);
    }
  };

  // Filtered Providers
  const filteredProviders = providers.filter((p) => {
    const matchesFilter =
      providerFilter === "all" || p.verificationStatus === providerFilter;
    const query = providerSearch.toLowerCase().trim();
    const name = p.businessName || p.user?.name || "";
    const email = p.user?.email || "";
    const service = p.service || p.services?.[0] || "";
    const location = p.location || "";

    const matchesSearch =
      !query ||
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      service.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  // Filtered Requests
  const filteredRequests = requests.filter((r) => {
    const matchesStatus =
      requestStatusFilter === "all" || r.status === requestStatusFilter;
    const query = requestSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.title?.toLowerCase().includes(query) ||
      r.service?.toLowerCase().includes(query) ||
      r.customer?.name?.toLowerCase().includes(query) ||
      r.provider?.name?.toLowerCase().includes(query) ||
      r.location?.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesRole = ticketRoleFilter === "all" || t.role === ticketRoleFilter;
    const matchesStatus = ticketStatusFilter === "all" || t.status === ticketStatusFilter;
    const query = ticketSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      t.category?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.user?.name?.toLowerCase().includes(query) ||
      t.user?.email?.toLowerCase().includes(query);

    return matchesRole && matchesStatus && matchesSearch;
  });

  // KPI Calculations
  const totalRequests = requests.length;
  const activeJobs = requests.filter((r) => ["Accepted", "On the Way", "In Progress"].includes(r.status)).length;
  const totalProviders = providers.length;
  const pendingProviders = providers.filter((p) => (p.verificationStatus || "Pending") === "Pending").length;
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Review").length;

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      {/* ── TOP NAV BAR ────────────────────────────────────────────── */}
      <nav className="navbar navbar-dark bg-dark px-4 py-3 shadow-sm sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span className="fs-4 fw-bold text-white">
              <span className="text-primary">Local</span>Fix
            </span>
            <Badge bg="danger" className="px-3 py-2 text-uppercase fs-8 fw-bold">
              <i className="bi bi-shield-lock-fill me-1"></i> Admin Portal
            </Badge>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Real-time Notification Bell */}
            <NotificationDropdown align="end" />

            {/* Broadcast Tool Button */}
            <Button
              variant="primary"
              size="sm"
              className="fw-bold d-flex align-items-center gap-1 shadow-sm"
              onClick={() => setShowBroadcastModal(true)}
            >
              <i className="bi bi-megaphone-fill"></i>
              <span className="d-none d-sm-inline">Send Broadcast</span>
            </Button>

            <span className="text-light small d-none d-md-inline">
              <i className="bi bi-person-badge me-1 text-primary"></i>
              {user?.name || "Platform Super Admin"} ({user?.email})
            </span>

            <Button
              variant="outline-light"
              size="sm"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </Button>
          </div>
        </div>
      </nav>

      <Container fluid className="px-4 py-4">
        {/* Action Alerts */}
        {actionSuccess && (
          <Alert variant="success" dismissible onClose={() => setActionSuccess("")} className="shadow-sm">
            <i className="bi bi-check-circle-fill me-2"></i>
            {actionSuccess}
          </Alert>
        )}
        {actionError && (
          <Alert variant="danger" dismissible onClose={() => setActionError("")} className="shadow-sm">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {actionError}
          </Alert>
        )}

        {/* ── 1. PLATFORM OVERVIEW KPIS ──────────────────────────────── */}
        <Row className="g-3 mb-4">
          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Raised Problems / Issues</span>
                  <h3 className="fw-bold mb-0 text-danger mt-1">{openTickets}</h3>
                  <small className="text-muted">{totalTickets} Total Tickets</small>
                </div>
                <div className="rounded-circle p-3 bg-danger-subtle text-danger fs-4">
                  <i className="bi bi-flag-fill"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Pending Verifications</span>
                  <h3 className="fw-bold mb-0 text-warning mt-1">{pendingProviders}</h3>
                  <small className="text-muted">{totalProviders} Total Providers</small>
                </div>
                <div className="rounded-circle p-3 bg-warning-subtle text-warning fs-4">
                  <i className="bi bi-patch-exclamation-fill"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Active Jobs</span>
                  <h3 className="fw-bold mb-0 text-primary mt-1">{activeJobs}</h3>
                  <small className="text-muted">In Transit / Progress</small>
                </div>
                <div className="rounded-circle p-3 bg-primary-subtle text-primary fs-4">
                  <i className="bi bi-arrow-repeat"></i>
                </div>
              </div>
            </Card>
          </Col>

          <Col md={6} lg={3}>
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">Total Bookings</span>
                  <h3 className="fw-bold mb-0 text-dark mt-1">{totalRequests}</h3>
                  <small className="text-muted">Platform Services</small>
                </div>
                <div className="rounded-circle p-3 bg-info-subtle text-info fs-4">
                  <i className="bi bi-kanban"></i>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ── 2. MAIN ADMIN TABS ─────────────────────────────────────── */}
        <Card className="border-0 shadow-sm rounded-4 bg-white">
          <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="border-bottom"
            >
              <Tab
                eventKey="issues"
                title={
                  <span className="fw-semibold px-2 py-1">
                    <i className="bi bi-flag-fill me-2 text-danger"></i>
                    Problems &amp; Issues Raised ({totalTickets})
                    {openTickets > 0 && (
                      <Badge bg="danger" className="ms-2 rounded-pill">
                        {openTickets} Open
                      </Badge>
                    )}
                  </span>
                }
              />
              <Tab
                eventKey="providers"
                title={
                  <span className="fw-semibold px-2 py-1">
                    <i className="bi bi-patch-check-fill me-2 text-primary"></i>
                    Provider Verifications ({totalProviders})
                    {pendingProviders > 0 && (
                      <Badge bg="warning" text="dark" className="ms-2 rounded-pill">
                        {pendingProviders} Pending
                      </Badge>
                    )}
                  </span>
                }
              />
              <Tab
                eventKey="work"
                title={
                  <span className="fw-semibold px-2 py-1">
                    <i className="bi bi-kanban me-2 text-primary"></i>
                    Work &amp; Task Management ({totalRequests})
                  </span>
                }
              />
            </Tabs>
          </Card.Header>

          <Card.Body className="p-4">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2 small">Loading platform data...</p>
              </div>
            ) : activeTab === "issues" ? (
              /* ── TAB 1: PROBLEMS & ISSUES RAISED (CUSTOMER & PROVIDER) ─── */
              <div>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                  {/* Filters: Role & Status */}
                  <div className="d-flex gap-2 flex-wrap">
                    {/* Role Filter */}
                    <Button
                      variant={ticketRoleFilter === "all" ? "dark" : "outline-secondary"}
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setTicketRoleFilter("all")}
                    >
                      All Roles
                    </Button>
                    <Button
                      variant={ticketRoleFilter === "customer" ? "primary" : "outline-primary"}
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setTicketRoleFilter("customer")}
                    >
                      <i className="bi bi-person-fill me-1"></i> Customer Issues
                    </Button>
                    <Button
                      variant={ticketRoleFilter === "provider" ? "info" : "outline-info"}
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setTicketRoleFilter("provider")}
                    >
                      <i className="bi bi-tools me-1"></i> Provider Issues
                    </Button>

                    <div className="vr mx-1"></div>

                    {/* Status Filter */}
                    <Button
                      variant={ticketStatusFilter === "Open" ? "danger" : "outline-danger"}
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setTicketStatusFilter(ticketStatusFilter === "Open" ? "all" : "Open")}
                    >
                      Open Only
                    </Button>
                    <Button
                      variant={ticketStatusFilter === "Resolved" ? "success" : "outline-success"}
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setTicketStatusFilter(ticketStatusFilter === "Resolved" ? "all" : "Resolved")}
                    >
                      Resolved
                    </Button>
                  </div>

                  {/* Search Bar */}
                  <Form.Control
                    type="text"
                    placeholder="Search by submitter, category, description..."
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    style={{ maxWidth: "340px" }}
                    size="sm"
                    className="rounded-pill px-3"
                  />
                </div>

                {filteredTickets.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover align="middle" className="mb-0">
                      <thead className="table-light">
                        <tr className="small text-muted text-uppercase">
                          <th>Submitted By</th>
                          <th>Role</th>
                          <th>Problem Category</th>
                          <th>Description &amp; Details</th>
                          <th>Date Raised</th>
                          <th>Status</th>
                          <th className="text-end">Admin Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTickets.map((t) => {
                          const statusBg =
                            t.status === "Resolved"
                              ? "success"
                              : t.status === "In Review"
                              ? "info"
                              : "danger";

                          return (
                            <tr key={t._id}>
                              <td>
                                <div className="fw-bold text-dark">{t.user?.name || "Platform User"}</div>
                                <small className="text-muted d-block">{t.user?.email || "No email"}</small>
                                <small className="text-muted">{t.user?.phone || "No phone"}</small>
                              </td>

                              <td>
                                <Badge
                                  bg={t.role === "customer" ? "primary" : "info"}
                                  className="px-2 py-1 text-uppercase fs-8"
                                >
                                  {t.role}
                                </Badge>
                              </td>

                              <td>
                                <span className="badge bg-secondary-subtle text-dark border px-2 py-1 fw-semibold">
                                  {t.category}
                                </span>
                              </td>

                              <td style={{ maxWidth: "340px" }}>
                                <p className="mb-1 text-dark small">{t.description}</p>
                                {t.resolutionNote && (
                                  <small className="text-success d-block fw-semibold">
                                    <i className="bi bi-reply-fill me-1"></i> Admin: {t.resolutionNote}
                                  </small>
                                )}
                              </td>

                              <td>
                                <small className="text-muted">
                                  {new Date(t.createdAt).toLocaleDateString()} at {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </small>
                              </td>

                              <td>
                                <Badge bg={statusBg} className="px-3 py-2">
                                  {t.status}
                                </Badge>
                              </td>

                              <td className="text-end">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="px-3"
                                  onClick={() => {
                                    setSelectedTicket(t);
                                    setTicketResolutionNote(t.resolutionNote || "");
                                    setShowTicketModal(true);
                                  }}
                                >
                                  <i className="bi bi-pencil-square me-1"></i> Resolve
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-shield-check fs-1 d-block mb-2 text-success"></i>
                    <p className="mb-0">No problems or issues found matching the selected filters.</p>
                  </div>
                )}
              </div>
            ) : activeTab === "providers" ? (
              /* ── TAB 2: PROVIDER VERIFICATION CENTER ─────────────────────── */
              <div>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      variant={providerFilter === "Pending" ? "warning" : "outline-secondary"}
                      size="sm"
                      className="rounded-pill px-3 fw-semibold"
                      onClick={() => setProviderFilter("Pending")}
                    >
                      <i className="bi bi-clock-history me-1"></i> Pending Verification ({pendingProviders})
                    </Button>
                    <Button
                      variant={providerFilter === "Verified" ? "success" : "outline-secondary"}
                      size="sm"
                      className="rounded-pill px-3 fw-semibold"
                      onClick={() => setProviderFilter("Verified")}
                    >
                      <i className="bi bi-check-circle-fill me-1"></i> Verified
                    </Button>
                    <Button
                      variant={providerFilter === "Rejected" ? "danger" : "outline-secondary"}
                      size="sm"
                      className="rounded-pill px-3 fw-semibold"
                      onClick={() => setProviderFilter("Rejected")}
                    >
                      <i className="bi bi-x-circle-fill me-1"></i> Rejected
                    </Button>
                    <Button
                      variant={providerFilter === "all" ? "primary" : "outline-secondary"}
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setProviderFilter("all")}
                    >
                      All Providers
                    </Button>
                  </div>

                  <Form.Control
                    type="text"
                    placeholder="Search by provider name, skill, email, location..."
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    style={{ maxWidth: "340px" }}
                    size="sm"
                    className="rounded-pill px-3"
                  />
                </div>

                {filteredProviders.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover align="middle" className="mb-0">
                      <thead className="table-light">
                        <tr className="small text-muted text-uppercase">
                          <th>Provider &amp; Business Info</th>
                          <th>Primary Skill</th>
                          <th>Service Location</th>
                          <th>Availability</th>
                          <th>Verification Status</th>
                          <th className="text-end">Verification Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProviders.map((prov) => {
                          const vStatus = prov.verificationStatus || "Pending";
                          const badgeBg =
                            vStatus === "Verified" ? "success" : vStatus === "Rejected" ? "danger" : "warning";

                          return (
                            <tr key={prov._id}>
                              <td>
                                <div className="fw-bold text-dark fs-6">
                                  {prov.businessName || prov.user?.name || "Service Professional"}
                                </div>
                                <div className="small text-muted">
                                  <i className="bi bi-envelope me-1"></i>
                                  {prov.user?.email || "No email"}
                                </div>
                                <small className="text-muted">
                                  <i className="bi bi-telephone me-1"></i>
                                  {prov.phone || prov.user?.phone || "No phone"}
                                </small>
                              </td>

                              <td>
                                <Badge bg="primary" className="px-2 py-1 fs-8">
                                  {prov.service || prov.services?.[0] || "General"}
                                </Badge>
                                <small className="text-muted d-block mt-1">
                                  <i className="bi bi-award me-1"></i>
                                  {prov.experience || "5+ Years Exp"}
                                </small>
                              </td>

                              <td>
                                <div className="small fw-semibold text-dark">
                                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                  {prov.location || "Mumbai, India"}
                                </div>
                              </td>

                              <td>
                                <Badge bg={prov.availability ? "success" : "secondary"} className="px-2 py-1">
                                  {prov.availability ? "Online (Available)" : "Offline"}
                                </Badge>
                              </td>

                              <td>
                                <Badge
                                  bg={badgeBg}
                                  text={badgeBg === "warning" ? "dark" : "white"}
                                  className="px-3 py-2 fw-bold"
                                >
                                  {vStatus}
                                </Badge>
                              </td>

                              <td className="text-end">
                                <div className="d-flex gap-2 justify-content-end align-items-center">
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProvider(prov);
                                      setShowProviderModal(true);
                                    }}
                                  >
                                    <i className="bi bi-eye me-1"></i> Inspect
                                  </Button>

                                  {vStatus !== "Verified" && (
                                    <Button
                                      variant="success"
                                      size="sm"
                                      className="px-3 fw-bold"
                                      onClick={() => handleVerifyProvider(prov._id, "Verified")}
                                    >
                                      <i className="bi bi-check-lg me-1"></i> Verify
                                    </Button>
                                  )}

                                  {vStatus !== "Rejected" && (
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      className="px-2"
                                      onClick={() => handleVerifyProvider(prov._id, "Rejected")}
                                      title="Reject Provider"
                                    >
                                      <i className="bi bi-x-lg"></i>
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <p className="mb-0">No providers found in this category.</p>
                  </div>
                )}
              </div>
            ) : (
              /* ── TAB 3: WORK & TASK MANAGEMENT ──────────────────────────── */
              <div>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                  <div className="d-flex gap-2 flex-wrap">
                    {["all", "Pending", "Accepted", "On the Way", "In Progress", "Completed", "Cancelled"].map(
                      (st) => (
                        <Button
                          key={st}
                          variant={requestStatusFilter === st ? "primary" : "outline-secondary"}
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => setRequestStatusFilter(st)}
                        >
                          {st === "all" ? "All Work" : st}
                        </Button>
                      )
                    )}
                  </div>

                  <Form.Control
                    type="text"
                    placeholder="Search by customer, provider, title, location..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    style={{ maxWidth: "340px" }}
                    size="sm"
                    className="rounded-pill px-3"
                  />
                </div>

                {filteredRequests.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover align="middle" className="mb-0">
                      <thead className="table-light">
                        <tr className="small text-muted text-uppercase">
                          <th>Service Request</th>
                          <th>Customer</th>
                          <th>Assigned Provider</th>
                          <th>Location / Scheduled</th>
                          <th>Status</th>
                          <th className="text-end">Manage Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((req) => {
                          const statusBg =
                            req.status === "Completed"
                              ? "success"
                              : req.status === "In Progress" || req.status === "On the Way"
                              ? "primary"
                              : req.status === "Accepted"
                              ? "info"
                              : req.status === "Cancelled"
                              ? "danger"
                              : "warning";

                          return (
                            <tr key={req._id}>
                              <td>
                                <div className="fw-bold text-dark">{req.title}</div>
                                <div className="small text-muted mb-1">
                                  <span className="badge bg-light text-primary border me-1">
                                    {req.service}
                                  </span>
                                  {req.aiCategory && (
                                    <span className="badge bg-info-subtle text-info border">
                                      AI: {req.aiCategory}
                                    </span>
                                  )}
                                </div>
                                <small className="text-muted text-truncate d-block" style={{ maxWidth: "260px" }}>
                                  {req.description}
                                </small>
                              </td>

                              <td>
                                <div className="fw-semibold text-dark">{req.customer?.name || "Customer"}</div>
                                <small className="text-muted">{req.customer?.phone || req.customer?.email}</small>
                              </td>

                              <td>
                                {req.provider ? (
                                  <div>
                                    <div className="fw-semibold text-primary">
                                      <i className="bi bi-person-badge-fill me-1"></i>
                                      {req.provider.name}
                                    </div>
                                    <small className="text-muted">{req.provider.phone}</small>
                                  </div>
                                ) : (
                                  <Badge bg="light" text="muted" className="border">
                                    Unassigned
                                  </Badge>
                                )}
                              </td>

                              <td>
                                <div className="small fw-semibold text-dark">
                                  <i className="bi bi-calendar3 me-1 text-primary"></i>
                                  {req.preferredDate || "Flexible"} {req.preferredTime && `at ${req.preferredTime}`}
                                </div>
                                <small className="text-muted d-block text-truncate" style={{ maxWidth: "200px" }}>
                                  <i className="bi bi-geo-alt me-1 text-danger"></i>
                                  {req.location}
                                </small>
                              </td>

                              <td>
                                <Badge bg={statusBg} text={statusBg === "warning" ? "dark" : "white"} className="px-3 py-2">
                                  {req.status}
                                </Badge>
                              </td>

                              <td className="text-end">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setShowHistoryModal(true);
                                  }}
                                >
                                  <i className="bi bi-sliders me-1"></i> Manage
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <p className="mb-0">No service requests match the current filters.</p>
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* ── RESOLVE SUPPORT TICKET MODAL ──────────────────────────── */}
      {selectedTicket && (
        <Modal show={showTicketModal} onHide={() => setShowTicketModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold">
              <i className="bi bi-flag-fill me-2 text-danger"></i>
              Manage Support Problem #{selectedTicket._id?.substring(selectedTicket._id.length - 6).toUpperCase()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 me-2">
                  {selectedTicket.category}
                </span>
                <Badge bg={selectedTicket.role === "customer" ? "primary" : "info"} className="text-uppercase">
                  Raised by {selectedTicket.role}
                </Badge>
              </div>
              <Badge
                bg={selectedTicket.status === "Resolved" ? "success" : selectedTicket.status === "In Review" ? "info" : "warning"}
                text={selectedTicket.status === "Open" ? "dark" : "white"}
                className="px-3 py-2"
              >
                Status: {selectedTicket.status}
              </Badge>
            </div>

            <div className="p-3 bg-light rounded-3 mb-3 border">
              <label className="text-muted small text-uppercase fw-bold d-block mb-1">
                Problem Description from User
              </label>
              <p className="mb-0 text-dark small">{selectedTicket.description}</p>
            </div>

            <div className="row g-2 small mb-3">
              <div className="col-sm-6">
                <span className="text-muted">User Name:</span>{" "}
                <strong className="text-dark">{selectedTicket.user?.name || "Platform User"}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Email:</span>{" "}
                <strong className="text-dark">{selectedTicket.user?.email || "N/A"}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Phone:</span>{" "}
                <strong className="text-dark">{selectedTicket.user?.phone || "N/A"}</strong>
              </div>
              <div className="col-sm-6">
                <span className="text-muted">Date Submitted:</span>{" "}
                <strong className="text-dark">{new Date(selectedTicket.createdAt).toLocaleString()}</strong>
              </div>
            </div>

            <hr />

            <Form.Group className="mb-3" controlId="resolutionNote">
              <Form.Label className="small fw-bold text-dark">
                Admin Response / Resolution Note
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write resolution steps, refund notes, or response message to user..."
                value={ticketResolutionNote}
                onChange={(e) => setTicketResolutionNote(e.target.value)}
                className="lf-form-textarea"
              />
            </Form.Group>

            <h6 className="fw-bold small text-uppercase text-muted mb-2">Update Problem Status</h6>
            <div className="d-flex gap-2 flex-wrap">
              <Button
                variant="success"
                className="fw-bold px-3"
                onClick={() => handleUpdateTicket(selectedTicket._id, "Resolved")}
              >
                <i className="bi bi-check-circle-fill me-1"></i> Mark as Resolved
              </Button>
              <Button
                variant="info"
                className="text-white px-3"
                onClick={() => handleUpdateTicket(selectedTicket._id, "In Review")}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Mark In Review
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleUpdateTicket(selectedTicket._id, "Open")}
              >
                Reset to Open
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowTicketModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* ── INSPECT PROVIDER MODAL ─────────────────────────────────── */}
      {selectedProvider && (
        <Modal show={showProviderModal} onHide={() => setShowProviderModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold">
              <i className="bi bi-shield-check me-2 text-primary"></i>
              Provider Profile &amp; Verification Inspection
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="fw-bold mb-1">
                  {selectedProvider.businessName || selectedProvider.user?.name}
                </h4>
                <div className="d-flex gap-2 align-items-center">
                  <Badge bg="primary">{selectedProvider.service || "General"}</Badge>
                  <Badge bg={selectedProvider.availability ? "success" : "secondary"}>
                    {selectedProvider.availability ? "Available" : "Offline"}
                  </Badge>
                </div>
              </div>
              <Badge
                bg={
                  selectedProvider.verificationStatus === "Verified"
                    ? "success"
                    : selectedProvider.verificationStatus === "Rejected"
                    ? "danger"
                    : "warning"
                }
                text={selectedProvider.verificationStatus === "Pending" ? "dark" : "white"}
                className="fs-7 px-3 py-2"
              >
                Status: {selectedProvider.verificationStatus || "Pending"}
              </Badge>
            </div>

            <div className="p-3 bg-light rounded-3 mb-3">
              <label className="text-muted small text-uppercase fw-bold d-block mb-1">
                Professional Bio &amp; Scope
              </label>
              <p className="mb-0 text-dark small">{selectedProvider.description || selectedProvider.bio || "No bio provided."}</p>
            </div>

            <div className="row g-3 small">
              <div className="col-md-6">
                <span className="text-muted">Account Email:</span>
                <div className="fw-bold text-dark">{selectedProvider.user?.email || "N/A"}</div>
              </div>
              <div className="col-md-6">
                <span className="text-muted">Contact Phone:</span>
                <div className="fw-bold text-dark">{selectedProvider.phone || selectedProvider.user?.phone || "N/A"}</div>
              </div>
              <div className="col-md-6">
                <span className="text-muted">Service Coverage Location:</span>
                <div className="fw-bold text-dark">{selectedProvider.location || "Mumbai"}</div>
              </div>
              <div className="col-md-6">
                <span className="text-muted">Experience Level:</span>
                <div className="fw-bold text-dark">{selectedProvider.experience || "5+ Years"}</div>
              </div>
            </div>

            <hr className="my-4" />

            <h6 className="fw-bold small text-uppercase text-muted mb-3">Admin Verification Decision</h6>
            <div className="d-flex gap-3">
              <Button
                variant="success"
                className="px-4 fw-bold"
                onClick={() => handleVerifyProvider(selectedProvider._id, "Verified")}
              >
                <i className="bi bi-check-circle-fill me-2"></i> Approve &amp; Verify Provider
              </Button>
              <Button
                variant="outline-danger"
                className="px-4"
                onClick={() => handleVerifyProvider(selectedProvider._id, "Rejected")}
              >
                <i className="bi bi-x-circle-fill me-2"></i> Reject Application
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleVerifyProvider(selectedProvider._id, "Pending")}
              >
                Set Pending
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowProviderModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* ── MANAGE REQUEST STATUS MODAL ────────────────────────────── */}
      {selectedRequest && (
        <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold">
              <i className="bi bi-clock-history me-2 text-primary"></i>
              Manage Service Request #{selectedRequest._id?.substring(selectedRequest._id.length - 6).toUpperCase()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="mb-3">
              <h5 className="fw-bold mb-1">{selectedRequest.title}</h5>
              <p className="text-muted small mb-2">{selectedRequest.description}</p>
              <div className="d-flex gap-2 align-items-center">
                <span className="text-muted small">Current Status:</span>
                <Badge bg="primary">{selectedRequest.status}</Badge>
              </div>
            </div>

            <hr />

            <h6 className="fw-bold small text-uppercase text-muted mb-3">Status Timeline Audit Trail</h6>
            <div className="d-flex flex-column gap-3 mb-4">
              {selectedRequest.statusHistory?.map((step, idx) => (
                <div key={idx} className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="badge bg-dark me-2">{step.status}</span>
                    <span className="text-dark small fw-semibold">{step.note || "Status updated"}</span>
                  </div>
                  <small className="text-muted">
                    {new Date(step.changedAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>

            <hr />

            <h6 className="fw-bold small text-uppercase text-muted mb-2">Admin Status Override</h6>
            <div className="d-flex gap-2 flex-wrap">
              {["Accepted", "On the Way", "In Progress", "Completed", "Cancelled"].map((st) => (
                <Button
                  key={st}
                  variant={selectedRequest.status === st ? "dark" : "outline-primary"}
                  size="sm"
                  disabled={selectedRequest.status === st}
                  onClick={() => handleUpdateStatus(selectedRequest._id, st)}
                >
                  Set {st}
                </Button>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowHistoryModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* ── SEND BROADCAST NOTIFICATION MODAL ───────────────────────── */}
      <Modal
        show={showBroadcastModal}
        onHide={() => setShowBroadcastModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-megaphone-fill me-2 text-primary"></i>
            Send System-Wide Broadcast Notification
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSendBroadcast}>
          <Modal.Body className="p-4">
            <p className="text-muted small mb-4">
              Broadcast announcements, platform updates, maintenance alerts, or emergency notices directly to user notification centers.
            </p>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="broadcastTarget">
                  <Form.Label className="fw-semibold text-dark small">
                    Target Audience <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    required
                  >
                    <option value="all">📢 Everyone (All Customers & Providers)</option>
                    <option value="customer">👤 Customers Only</option>
                    <option value="provider">🔧 Service Providers Only</option>
                    <option value="admin">🛡️ Platform Admins</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="broadcastPriority">
                  <Form.Label className="fw-semibold text-dark small">
                    Priority Level
                  </Form.Label>
                  <Form.Select
                    value={broadcastPriority}
                    onChange={(e) => setBroadcastPriority(e.target.value)}
                  >
                    <option value="low">Low (General Tip)</option>
                    <option value="medium">Medium (Standard Update)</option>
                    <option value="high">High (Important Notice)</option>
                    <option value="urgent">Urgent (Platform Alert)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="broadcastTitle">
                  <Form.Label className="fw-semibold text-dark small">
                    Notification Headline / Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Scheduled System Maintenance on Sunday 2 AM"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="broadcastMessage">
                  <Form.Label className="fw-semibold text-dark small">
                    Message Body <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Provide full announcement details here for users..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowBroadcastModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              size="sm"
              disabled={broadcasting}
              className="fw-bold px-3"
            >
              {broadcasting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  Broadcasting...
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill me-1"></i> Send Announcement
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
