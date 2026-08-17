// ─────────────────────────────────────────────────────────────────────────────
// src/pages/HelpSupport.jsx
//
// WHAT IS THIS PAGE?
//   The "Help & Support" page for LocalFix customers.
//   Connected to Express & MongoDB backend to save all raised customer problems
//   directly to the Admin Portal!
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Accordion,
  Form,
  Button,
  Alert,
  InputGroup,
  Badge,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import HelpCard from "../components/HelpCard";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import faqData from "../data/faqData";
import { supportAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function HelpSupport() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Redirect provider to provider support if logged in
  useEffect(() => {
    if (isAuthenticated && role === "provider") {
      navigate("/provider/help", { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // FAQ Search
  const [faqSearch, setFaqSearch] = useState("");

  // Report Problem Form
  const [problemCategory, setProblemCategory] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // My Raised Tickets
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const reportFormRef = useRef(null);

  const scrollToReportForm = () => {
    if (reportFormRef.current) {
      reportFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadMyTickets = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingTickets(true);
      const res = await supportAPI.getMyTickets();
      if (res.success && res.data) {
        setMyTickets(res.data);
      }
    } catch (err) {
      console.log("Error loading tickets:", err.message);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMyTickets();
    }
  }, [isAuthenticated]);

  // Filter FAQ items
  const query = faqSearch.toLowerCase().trim();
  const filteredFaqs = faqData.filter((faq) => {
    if (!query) return true;
    const matchesQuestion = faq.question.toLowerCase().includes(query);
    const matchesAnswer = faq.answer.toLowerCase().includes(query);
    const matchesCategory = faq.category.toLowerCase().includes(query);
    return matchesQuestion || matchesAnswer || matchesCategory;
  });

  // Handle problem report submission (Saves to MongoDB)
  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!isAuthenticated) {
      setFormError("Please log in to submit an issue and track administrator responses.");
      return;
    }

    if (!problemCategory) {
      setFormError("Please select a problem category.");
      return;
    }

    if (!problemDescription.trim() || problemDescription.trim().length < 10) {
      setFormError("Please provide a description with at least 10 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await supportAPI.createTicket({
        category: problemCategory,
        description: problemDescription,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setProblemCategory("");
        setProblemDescription("");
        loadMyTickets();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      setFormError(err.message || "Failed to submit problem report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Main Inner Support Content (shared between dashboard and public view)
  const renderSupportContent = () => (
    <>
      {/* ── SEARCH & HERO BAR ────────────────────────────────────── */}
      <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-4 text-center">
        <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-3">
          24/7 DEDICATED ASSISTANCE
        </span>
        <h2 className="fw-bold text-dark mb-2">Help & Support Center</h2>
        <p className="text-muted mb-4 max-w-700 mx-auto">
          Find instant answers to common questions, explore platform guides, or report an issue directly to our admin team.
        </p>

        {/* Help Search Box */}
        <div className="mx-auto" style={{ maxWidth: "560px" }}>
          <InputGroup className="shadow-sm rounded-pill overflow-hidden border p-1 bg-white">
            <InputGroup.Text className="bg-white border-0 ps-3 text-muted">
              <i className="bi bi-search fs-5 text-primary"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search articles, bookings, refunds, provider issues..."
              className="border-0 shadow-none py-2"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
            />
            {faqSearch && (
              <Button
                variant="link"
                className="text-muted text-decoration-none border-0"
                onClick={() => setFaqSearch("")}
              >
                <i className="bi bi-x-circle-fill"></i>
              </Button>
            )}
            <Button className="btn-getstarted rounded-pill px-4 me-1 my-1">
              Search
            </Button>
          </InputGroup>
        </div>
      </div>

      {/* Quick Action Contact Cards */}
      <div className="mb-5">
        <HelpCard onContactSupport={scrollToReportForm} />
      </div>

      {/* ── LOGGED IN: MY PREVIOUSLY RAISED TICKETS ────────────── */}
      {isAuthenticated && myTickets.length > 0 && (
        <div className="mb-5">
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 fs-5"
                  style={{ width: "42px", height: "42px", backgroundColor: "#2563EB18", color: "#2563EB" }}
                >
                  <i className="bi bi-ticket-detailed-fill"></i>
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-0">My Reported Issues</h5>
                  <small className="text-muted">Track the status of problems submitted to Admin</small>
                </div>
              </div>
              <Badge bg="primary" className="rounded-pill px-3 py-2">
                {myTickets.length} {myTickets.length === 1 ? "Ticket" : "Tickets"}
              </Badge>
            </Card.Header>

            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Ticket ID</th>
                      <th>Category</th>
                      <th>Problem Description</th>
                      <th>Status</th>
                      <th>Resolution Note</th>
                      <th className="pe-4 text-end">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTickets.map((t) => {
                      const statusBadge =
                        t.status === "Resolved"
                          ? "success"
                          : t.status === "In Review"
                          ? "warning"
                          : t.status === "Closed"
                          ? "secondary"
                          : "primary";

                      return (
                        <tr key={t._id}>
                          <td className="ps-4 fw-bold font-monospace text-primary small">
                            #{t._id?.substring(t._id.length - 6).toUpperCase()}
                          </td>
                          <td>
                            <Badge bg="light" text="dark" className="border px-2 py-1">
                              {t.category}
                            </Badge>
                          </td>
                          <td className="max-w-300">
                            <span className="text-dark small fw-medium">{t.description}</span>
                          </td>
                          <td>
                            <Badge bg={statusBadge} className="px-2 py-1">
                              {t.status}
                            </Badge>
                          </td>
                          <td>
                            {t.resolutionNote ? (
                              <span className="small text-success fw-medium">
                                <i className="bi bi-check-circle-fill me-1"></i>
                                {t.resolutionNote}
                              </span>
                            ) : (
                              <span className="small text-muted fst-italic">Under Admin review</span>
                            )}
                          </td>
                          <td className="pe-4 text-end text-muted small">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* ── FAQ ACCORDION SECTION ──────────────────────────────── */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-dark mb-0">Frequently Asked Questions</h4>
          <span className="text-muted small">
            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {filteredFaqs.length > 0 ? (
          <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden border">
            {filteredFaqs.map((faq, index) => (
              <Accordion.Item eventKey={String(index)} key={faq.id || index}>
                <Accordion.Header>
                  <span className="fw-semibold text-dark me-2">{faq.question}</span>
                  {faq.category && (
                    <Badge bg="light" text="primary" className="border ms-auto me-3 small">
                      {faq.category}
                    </Badge>
                  )}
                </Accordion.Header>
                <Accordion.Body className="text-secondary leading-relaxed bg-white">
                  {faq.answer}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <i className="bi bi-search text-muted display-5 mb-3"></i>
            <h5 className="fw-bold text-dark">No FAQ articles found</h5>
            <p className="text-muted small mb-3">
              We couldn't find any questions matching "{faqSearch}". Try searching different keywords or submit an issue below.
            </p>
            <Button
              variant="outline-primary"
              size="sm"
              className="mx-auto"
              onClick={() => setFaqSearch("")}
            >
              Clear Search
            </Button>
          </Card>
        )}
      </div>

      {/* ── REPORT A PROBLEM / SUPPORT ISSUE FORM ──────────────── */}
      <div ref={reportFormRef} className="mb-5">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Header className="bg-white p-4 border-bottom">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 fs-5"
                style={{ width: "42px", height: "42px", backgroundColor: "#EF444415", color: "#DC2626" }}
              >
                <i className="bi bi-exclamation-octagon-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-0">Report a Problem / Submit Issue</h5>
                <small className="text-muted">
                  Your report will be forwarded directly to the Super Admin for prompt resolution.
                </small>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="p-4 p-md-5">
            {submitSuccess && (
              <Alert variant="success" className="rounded-3 mb-4">
                <i className="bi bi-check-circle-fill me-2"></i>
                Your issue has been recorded and submitted to the LocalFix Administrator. You can track progress in the 'My Reported Issues' table above.
              </Alert>
            )}

            {formError && (
              <Alert variant="danger" className="rounded-3 mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {formError}
              </Alert>
            )}

            {!isAuthenticated && (
              <Alert variant="info" className="rounded-3 mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-info-circle-fill me-2"></i>
                  <strong>Login Required:</strong> Please log in to your account to file a ticket and receive resolution updates.
                </div>
                <Button as={Link} to="/login" variant="primary" size="sm" className="fw-bold px-3">
                  Log in
                </Button>
              </Alert>
            )}

            <Form onSubmit={handleProblemSubmit}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group controlId="problemCategory">
                    <Form.Label className="fw-semibold text-dark small">
                      Problem Category <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={problemCategory}
                      onChange={(e) => setProblemCategory(e.target.value)}
                      required
                      className="form-select rounded-3 py-2"
                    >
                      <option value="">-- Select a Category --</option>
                      <option value="Booking & Scheduling Issue">Booking &amp; Scheduling Issue</option>
                      <option value="Provider Delay or No-Show">Provider Delay or No-Show</option>
                      <option value="Quality of Work / Unsatisfactory Job">Quality of Work / Unsatisfactory Job</option>
                      <option value="Billing, Invoicing & Pricing Dispute">Billing, Invoicing &amp; Pricing Dispute</option>
                      <option value="Account & Profile Access">Account &amp; Profile Access</option>
                      <option value="Safety or Behavior Complaint">Safety or Behavior Complaint</option>
                      <option value="Other Feedback or Inquiries">Other Feedback or Inquiries</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group controlId="problemDescription">
                    <Form.Label className="fw-semibold text-dark small">
                      Detailed Problem Description <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      className="form-control rounded-3"
                      placeholder="Please describe what happened in detail so the platform administrator can assist you..."
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      required
                    />
                    <small className="text-muted d-block mt-1">
                      Minimum 10 characters. Include any booking details or provider names.
                    </small>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  className="btn-getstarted px-4 py-2 fw-bold"
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i>
                      Submit Issue to Admin
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );

  // 1. If Logged in Customer: Render inside Customer Dashboard Shell
  if (isAuthenticated && role === "customer") {
    return (
      <div className="lf-dashboard-wrapper">
        <DashboardSidebar activeTab="help" />
        <div className="lf-dashboard-main">
          <DashboardNavbar pageTitle="Help & Support" />
          <div className="lf-dashboard-content">
            <Container fluid className="px-0 py-2">
              {renderSupportContent()}
            </Container>
          </div>
        </div>
      </div>
    );
  }

  // 2. If Public / Not Logged In: Render Public Navbar & Footer Shell
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />
      <div className="py-4 flex-grow-1">
        <Container style={{ maxWidth: "1000px" }}>
          {renderSupportContent()}
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default HelpSupport;
