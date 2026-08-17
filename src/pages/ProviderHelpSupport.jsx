// ─────────────────────────────────────────────────────────────────────────────
// src/pages/ProviderHelpSupport.jsx
//
// WHAT IS THIS PAGE?
//   The dedicated "Help & Support" page for LocalFix service providers.
//   Connected to Express & MongoDB backend to save all raised provider problems
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
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderNavbar  from "../components/ProviderNavbar";
import ProviderHelpCard from "../components/ProviderHelpCard";
import providerFaqData from "../data/providerFaqData";
import { supportAPI } from "../services/api";

function ProviderHelpSupport() {
  // Search query state
  const [faqSearch, setFaqSearch] = useState("");

  // Report Problem Form state
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // My Raised Tickets
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Form reference for smooth scrolling
  const reportFormRef = useRef(null);

  const scrollToReportForm = () => {
    if (reportFormRef.current) {
      reportFormRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const loadMyTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await supportAPI.getMyTickets();
      if (res.success && res.data) {
        setMyTickets(res.data);
      }
    } catch (err) {
      console.log("Error loading provider tickets:", err.message);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadMyTickets();
  }, []);

  // Filter provider FAQs dynamically
  const query = faqSearch.toLowerCase().trim();
  const filteredFaqs = providerFaqData.filter((faq) => {
    if (!query) return true;
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query)
    );
  });

  // Handle problem report submission (Saves directly to MongoDB & Admin)
  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!category) {
      setFormError("Please select a problem category.");
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setFormError("Please provide a description with at least 10 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await supportAPI.createTicket({
        category,
        description,
      });

      if (res.success) {
        setSubmitSuccess(true);
        setCategory("");
        setDescription("");
        loadMyTickets();
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      setFormError(err.message || "Failed to submit problem report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lf-dashboard-wrapper">
      <ProviderSidebar activeTab="help" />

      <div className="lf-dashboard-main">
        <ProviderNavbar pageTitle="Help & Support" />

        <div className="lf-dashboard-content">
          <Container fluid className="px-0">
            {/* ── 1. PAGE HEADER ─────────────────────────────────────────── */}
            <div className="lf-find-services-header text-center mb-4">
              <h2 className="lf-find-services-title">Provider Support Center</h2>
              <p className="lf-find-services-subtitle">
                Need help with customer bookings, payouts, or your provider account? Let our admin team know.
              </p>

              <div className="lf-help-search-box mx-auto mt-3">
                <InputGroup className="lf-dash-search-group">
                  <InputGroup.Text className="lf-dash-search-icon">
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search provider guides, payouts, safety..."
                    className="lf-dash-search-input"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                  />
                  {faqSearch && (
                    <Button
                      variant="link"
                      className="text-muted text-decoration-none"
                      onClick={() => setFaqSearch("")}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </Button>
                  )}
                </InputGroup>
              </div>
            </div>

            {/* ── 2. QUICK ACTION CARDS ───────────────────────────────────── */}
            <ProviderHelpCard onContactSupport={scrollToReportForm} />

            {/* ── 3. MY PREVIOUSLY RAISED ISSUES ───────────────────────────── */}
            {myTickets.length > 0 && (
              <div className="mb-5">
                <Card className="lf-profile-card">
                  <Card.Header className="lf-profile-card-header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="lf-profile-card-icon" style={{ backgroundColor: "#2563EB18", color: "#2563EB" }}>
                        <i className="bi bi-ticket-detailed-fill"></i>
                      </div>
                      <div>
                        <h5 className="lf-profile-card-title mb-0">My Reported Issues</h5>
                        <small className="text-muted">Track the status of problems you have reported to Admin.</small>
                      </div>
                    </div>
                    <Badge bg="primary" className="rounded-pill px-3 py-2">
                      {myTickets.length} Tickets Raised
                    </Badge>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="d-flex flex-column gap-3">
                      {myTickets.map((t) => (
                        <div key={t._id} className="p-3 bg-light rounded-3 border">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <span className="badge bg-secondary me-2">{t.category}</span>
                              <span className="text-muted small">
                                Raised on {new Date(t.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <Badge
                              bg={t.status === "Resolved" ? "success" : t.status === "In Review" ? "info" : "warning"}
                              text={t.status === "Open" ? "dark" : "white"}
                              className="px-3 py-2"
                            >
                              {t.status}
                            </Badge>
                          </div>
                          <p className="text-dark small mb-1">{t.description}</p>
                          {t.resolutionNote && (
                            <div className="mt-2 p-2 bg-white rounded border-start border-success border-3 small">
                              <strong className="text-success">Admin Response:</strong> {t.resolutionNote}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}

            {/* ── 4. PROVIDER FAQ ACCORDION ───────────────────────────────── */}
            <div className="mb-5">
              <Card className="lf-profile-card">
                <Card.Header className="lf-profile-card-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="lf-profile-card-icon" style={{ backgroundColor: "#2563EB18", color: "#2563EB" }}>
                      <i className="bi bi-question-circle-fill"></i>
                    </div>
                    <div>
                      <h5 className="lf-profile-card-title mb-0">Provider FAQ &amp; Guidelines</h5>
                      <small className="text-muted">Everything you need to know about providing services on LocalFix.</small>
                    </div>
                  </div>
                  {query && (
                    <span className="badge bg-light text-primary border">
                      {filteredFaqs.length} results
                    </span>
                  )}
                </Card.Header>
                <Card.Body className="p-4">
                  {filteredFaqs.length > 0 ? (
                    <Accordion defaultActiveKey="0" flush>
                      {filteredFaqs.map((faq, index) => (
                        <Accordion.Item eventKey={String(index)} key={faq.id} className="lf-faq-item">
                          <Accordion.Header className="lf-faq-header">
                            <span className="badge bg-light text-muted border me-2" style={{ fontSize: "0.75rem" }}>
                              {faq.category}
                            </span>
                            <span className="fw-semibold text-dark">{faq.question}</span>
                          </Accordion.Header>
                          <Accordion.Body className="lf-faq-body text-muted">
                            {faq.answer}
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <p className="mb-0">No questions matched your search query.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>

            {/* ── 5. REPORT A PROBLEM FORM ────────────────────────────────── */}
            <div ref={reportFormRef} id="report-form">
              <Card className="lf-profile-card">
                <Card.Header className="lf-profile-card-header d-flex align-items-center gap-3">
                  <div className="lf-profile-card-icon" style={{ backgroundColor: "#DC262618", color: "#DC2626" }}>
                    <i className="bi bi-flag-fill"></i>
                  </div>
                  <div>
                    <h5 className="lf-profile-card-title mb-0">Report a Problem / Dispute to Admin</h5>
                    <small className="text-muted">
                      Need help with a booking dispute, payment delay, or customer issue? Submit it directly to Admin.
                    </small>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  {submitSuccess && (
                    <Alert
                      variant="success"
                      dismissible
                      onClose={() => setSubmitSuccess(false)}
                      className="lf-action-alert mb-4"
                    >
                      <i className="bi bi-check-circle-fill me-2"></i>
                      ✓ Your issue has been submitted successfully to the Admin team!
                    </Alert>
                  )}

                  {formError && (
                    <Alert variant="danger" className="py-2 px-3 small mb-3">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {formError}
                    </Alert>
                  )}

                  <Form onSubmit={handleProblemSubmit}>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group controlId="problemCategory">
                          <Form.Label className="lf-form-field-label">
                            Problem Category <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Select
                            className="lf-form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                          >
                            <option value="">-- Select a Category --</option>
                            <option value="Customer Unreachable">Customer Unreachable or Wrong Address</option>
                            <option value="Customer Cancellation Dispute">Customer Cancellation / Delay Dispute</option>
                            <option value="Payment Dispute">Payment Dispute or Commission Query</option>
                            <option value="Scope Mismatch">Scope of Work Exceeded Description</option>
                            <option value="Safety Concern">Safety or Workplace Incident</option>
                            <option value="App / Technical Bug">App Bug or Technical Glitch</option>
                            <option value="Other">Other Inquiry</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group controlId="problemDescription">
                          <Form.Label className="lf-form-field-label">
                            Problem Description <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            className="lf-form-textarea"
                            placeholder="Please describe the exact issue you are facing so the platform administrator can take action..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                          <div className="lf-textarea-hint">
                            Minimum 10 characters. Include customer details or job IDs if applicable.
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={submitting}
                        className="lf-action-btn-primary px-4 fw-bold"
                      >
                        {submitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Submitting to Admin...
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

          </Container>
        </div>
      </div>
    </div>
  );
}

export default ProviderHelpSupport;
