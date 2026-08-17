// ─────────────────────────────────────────────────────────────────────────────
// src/pages/CreateRequest.jsx
//
// WHAT IS THIS FILE?
//   The main page for "Create Service Request".
//   It is the PARENT that owns all shared state and orchestrates the layout.
//
// WHY DOES THIS COMPONENT OWN THE STATE?
//   Both RequestForm and RequestSummary need access to the SAME formData.
//   - RequestForm needs to READ it (to show current values) and WRITE to it
//     (when the user types something).
//   - RequestSummary needs to READ it (to display the live preview).
//
//   If we put state inside RequestForm, RequestSummary wouldn't know about it.
//   If we put state inside RequestSummary, RequestForm wouldn't know about it.
//
//   The solution: LIFT STATE UP to the closest common parent — CreateRequest.
//   Then pass it down to both children as props. Both see the same data.
//
//   This is called "Lifting State Up" — a fundamental React pattern.
//
// COMPONENT TREE:
//   CreateRequest (parent — owns state)
//     ├── DashboardSidebar
//     ├── DashboardNavbar
//     ├── RequestForm    ← receives formData, setFormData, image, setImage, errors, onSubmit
//     └── RequestSummary ← receives formData, image (READ ONLY)
//
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { requestsAPI } from "../services/api";

// Import the shared dashboard layout components
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar  from "../components/DashboardNavbar";

// Import the two children for this page
import RequestForm    from "../components/RequestForm";
import RequestSummary from "../components/RequestSummary";

function CreateRequest() {
  const navigate = useNavigate();

  // ── FORM STATE ─────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    service:  "",   // which service category was selected
    problem:  "",   // description of the issue
    location: "",   // where the service should happen
    date:     "",   // preferred date in YYYY-MM-DD format
    time:     "",   // preferred time in HH:MM format
    notes:    "",   // optional additional notes
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);
  const [aiClassification, setAiClassification] = useState(null);

  // ── FORM VALIDATION ────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!formData.service) {
      newErrors.service = "Please select a service category.";
    }
    if (!formData.problem.trim()) {
      newErrors.problem = "Please describe your problem.";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Please enter the service location.";
    }
    if (!formData.date) {
      newErrors.date = "Please select a preferred date.";
    }
    if (!formData.time) {
      newErrors.time = "Please select a preferred time.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── HANDLE FORM SUBMIT (Connected to Express & AI backend) ────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const isValid = validateForm();
    if (!isValid) return;

    setSubmitting(true);

    try {
      const payload = {
        title: `${formData.service} Service`,
        service: formData.service,
        description: formData.problem + (formData.notes ? ` (Notes: ${formData.notes})` : ""),
        location: formData.location,
        preferredDate: formData.date,
        preferredTime: formData.time,
      };

      const res = await requestsAPI.createRequest(payload);
      if (res.success && res.data) {
        setCreatedRequest(res.data);
        setAiClassification(res.aiClassification || null);
        setIsSubmitted(true);
      }
    } catch (err) {
      setServerError(err.message || "Failed to create service request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── RESET FORM (for "Create Another Request" button) ──────────────────
  const resetForm = () => {
    setFormData({ service: "", problem: "", location: "", date: "", time: "", notes: "" });
    setImage(null);
    setErrors({});
    setServerError("");
    setCreatedRequest(null);
    setAiClassification(null);
    setIsSubmitted(false);
  };

  // ── FORMAT DATE FOR SUCCESS CARD ──────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="lf-dashboard-wrapper">
      <DashboardSidebar activeTab="services" />

      <div className="lf-dashboard-main">
        <DashboardNavbar pageTitle="Create Service Request" />

        <div className="lf-dashboard-content">
          <Container fluid className="px-0">
            <Link to="/dashboard" className="lf-back-link">
              <i className="bi bi-arrow-left me-1"></i>
              Back to Dashboard
            </Link>

            <div className="lf-cr-page-header">
              <h2 className="lf-cr-page-title">Create a Service Request</h2>
              <p className="lf-cr-page-sub">
                Tell us what you need and our AI will assist in matching you with the right pro.
              </p>
            </div>

            {/* ══════════════════════════════════════════════════════════
                SUCCESS STATE
            ══════════════════════════════════════════════════════════ */}
            {isSubmitted ? (
              <div className="lf-success-card">
                <div className="lf-success-icon-wrap">
                  <div className="lf-success-icon">
                    <i className="bi bi-check-lg"></i>
                  </div>
                </div>

                <h4 className="lf-success-title">Service Request Booked!</h4>
                <p className="lf-success-sub">
                  Your request has been created and saved to MongoDB. It is now open for verified providers.
                </p>

                {/* AI Classification Callout Badge */}
                {aiClassification && (
                  <div className="alert alert-info py-2 px-3 mb-4 rounded-3 text-start d-flex align-items-center">
                    <i className="bi bi-robot fs-4 me-3 text-primary"></i>
                    <div>
                      <div className="fw-bold">
                        AI Classified Service: <span className="text-primary">{aiClassification.detectedCategory}</span>
                      </div>
                      <small className="text-muted">
                        Confidence: {(aiClassification.confidence * 100).toFixed(0)}% • {aiClassification.reasoning}
                      </small>
                    </div>
                  </div>
                )}

                {/* Request summary */}
                <div className="lf-success-details">
                  <div className="lf-success-row">
                    <span className="lf-success-label">Request ID</span>
                    <span className="lf-success-value fw-bold text-monospace">{createdRequest?._id}</span>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-label">Service</span>
                    <span className="lf-success-value">{formData.service}</span>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-label">Location</span>
                    <span className="lf-success-value">{formData.location}</span>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-label">Preferred Date</span>
                    <span className="lf-success-value">{formatDate(formData.date)}</span>
                  </div>
                  <div className="lf-success-row">
                    <span className="lf-success-label">Status</span>
                    <span className="lf-success-status badge bg-warning text-dark px-3 py-2">
                      {createdRequest?.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="lf-success-actions">
                  <button
                    className="lf-success-btn-primary"
                    onClick={() => navigate(`/request/${createdRequest?._id || ""}`)}
                  >
                    <i className="bi bi-eye me-2"></i>
                    View Request Details
                  </button>
                  <button
                    className="lf-success-btn-secondary"
                    onClick={() => navigate("/requests")}
                  >
                    <i className="bi bi-list-check me-2"></i>
                    View All Requests
                  </button>
                </div>
              </div>
            ) : (
              <Row className="g-4 align-items-start">
                <Col md={7}>
                  <div className="lf-form-card">
                    <div className="lf-form-card-header">
                      <h5 className="lf-form-card-title">
                        <i className="bi bi-pencil-square me-2"></i>
                        Request Details
                      </h5>
                    </div>

                    {serverError && (
                      <Alert variant="danger" className="py-2 fs-7 mb-3">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {serverError}
                      </Alert>
                    )}

                    {Object.keys(errors).length > 0 && (
                      <Alert variant="danger" className="lf-validation-alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Please fill in all required fields before submitting.
                      </Alert>
                    )}

                    <RequestForm
                      formData={formData}
                      setFormData={setFormData}
                      image={image}
                      setImage={setImage}
                      errors={errors}
                      onSubmit={handleSubmit}
                      submitting={submitting}
                    />
                  </div>
                </Col>

                <Col md={5}>
                  <RequestSummary formData={formData} image={image} />
                  <div className="lf-cr-help-tip">
                    <i className="bi bi-info-circle me-2"></i>
                    Your request will be classified by AI and sent to verified professionals in your area.
                  </div>
                </Col>
              </Row>
            )}

          </Container>
        </div>
      </div>
    </div>
  );
}

export default CreateRequest;
