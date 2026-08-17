// ─────────────────────────────────────────────────────────────────────────────
// src/pages/RequestDetails.jsx
//
// WHAT IS THIS FILE?
//   The "Request Details / Live Tracking" page for LocalFix customers.
//   Route: /request/:id or /requests/:id
//
// FEATURES:
//   - Fetches live request data from Express backend & MongoDB.
//   - Shows real-time status badge and step-by-step ServiceTimeline ("On the Way", "In Progress", etc.)
//   - Shows assigned provider information.
//   - Allows customer to cancel pending requests.
//   - Allows customer to submit a 1-5 Star Rating & Review once the request is "Completed".
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Spinner, Alert, Modal, Button, Form } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";

// ── Import Reusable Layout Shell ──────────────────────────────────────────
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar  from "../components/DashboardNavbar";

// ── Import Details Page Components ────────────────────────────────────────
import RequestInfoCard from "../components/RequestInfoCard";
import ProviderCard    from "../components/ProviderCard";
import ServiceTimeline from "../components/ServiceTimeline";

// ── Import API Services ───────────────────────────────────────────────────
import { requestsAPI, reviewsAPI } from "../services/api";

// ── Status Style Helper ───────────────────────────────────────────────────
const statusConfig = {
  Pending: {
    bg: "warning",
    text: "dark",
    label: "Pending",
    icon: "bi bi-hourglass-split",
  },
  Accepted: {
    bg: "success",
    text: "white",
    label: "Accepted",
    icon: "bi bi-check-circle-fill",
  },
  "In Progress": {
    bg: "primary",
    text: "white",
    label: "In Progress",
    icon: "bi bi-arrow-repeat",
  },
  "On the Way": {
    bg: "info",
    text: "white",
    label: "On the Way",
    icon: "bi bi-truck",
  },
  Completed: {
    bg: "success",
    text: "white",
    label: "Completed",
    icon: "bi bi-patch-check-fill",
  },
  Cancelled: {
    bg: "danger",
    text: "white",
    label: "Cancelled",
    icon: "bi bi-x-circle-fill",
  },
};

function getStatusStyle(status) {
  return (
    statusConfig[status] || {
      bg: "secondary",
      text: "white",
      label: status,
      icon: "bi bi-info-circle",
    }
  );
}

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Fetch Request Details from MongoDB
  const fetchRequestDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await requestsAPI.getRequestById(id);
      if (res.success && res.data) {
        setRequest(res.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load service request details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

  // Handle Cancel Request
  const handleCancelRequest = async () => {
    if (!window.confirm("Are you sure you want to cancel this service request?")) return;
    try {
      const res = await requestsAPI.cancelRequest(id);
      if (res.success) {
        setActionMessage("Service request cancelled successfully.");
        fetchRequestDetails();
      }
    } catch (err) {
      alert(err.message || "Failed to cancel service request.");
    }
  };

  // Handle Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setSubmittingReview(true);
    try {
      const res = await reviewsAPI.createReview({
        requestId: id,
        rating: Number(rating),
        comment,
      });
      if (res.success) {
        setReviewSuccess(true);
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess(false);
        }, 1500);
      }
    } catch (err) {
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const statusInfo = request ? getStatusStyle(request.status) : null;

  return (
    <div className="lf-dashboard-wrapper">
      <DashboardSidebar activeTab="requests" />

      <div className="lf-dashboard-main">
        <DashboardNavbar pageTitle="Request Details" />

        <div className="lf-dashboard-content">
          <Container fluid className="px-0">
            <div className="mb-3">
              <Link to="/requests" className="lf-back-link">
                <i className="bi bi-arrow-left me-2"></i>
                Back to My Requests
              </Link>
            </div>

            {actionMessage && (
              <Alert variant="info" dismissible onClose={() => setActionMessage("")} className="py-2 mb-3">
                <i className="bi bi-info-circle-fill me-2"></i>
                {actionMessage}
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="text-muted fs-7">Loading service request details...</p>
              </div>
            ) : error ? (
              <div className="lf-requests-empty-card">
                <div className="lf-requests-empty-icon-wrap">
                  <i className="bi bi-exclamation-triangle text-danger"></i>
                </div>
                <h4 className="lf-requests-empty-title">Request Not Found</h4>
                <p className="lf-requests-empty-desc">{error}</p>
                <div>
                  <Link to="/requests" className="btn lf-btn-create-request">
                    <i className="bi bi-arrow-left me-2"></i>
                    Return to My Requests
                  </Link>
                </div>
              </div>
            ) : request ? (
              <>
                {/* ── 2. REQUEST HEADER BANNER ────────────────────────────── */}
                <div className="lf-rd-header-card">
                  <div className="lf-rd-header-left">
                    <div
                      className="lf-rd-header-icon"
                      style={{
                        backgroundColor: "#2563EB18",
                        color: "#2563EB",
                      }}
                    >
                      <i className="bi bi-tools"></i>
                    </div>

                    <div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <span className="lf-rd-header-id">
                          Request #{request._id?.substring(request._id.length - 6).toUpperCase()}
                        </span>
                        <span className="lf-rd-header-service-tag">
                          <i className="bi bi-tag-fill me-1"></i>
                          {request.service}
                        </span>
                        {request.aiCategory && request.aiCategory !== request.service && (
                          <span className="badge bg-light text-primary border border-primary-subtle fs-8">
                            <i className="bi bi-robot me-1"></i>
                            AI: {request.aiCategory}
                          </span>
                        )}
                      </div>
                      <h2 className="lf-rd-header-title">{request.title}</h2>
                    </div>
                  </div>

                  <div className="lf-rd-header-right">
                    <Badge
                      bg={statusInfo.bg}
                      text={statusInfo.text}
                      className="lf-rd-header-status-badge px-3 py-2 fs-7"
                    >
                      <i className={`${statusInfo.icon} me-1`}></i>
                      {statusInfo.label}
                    </Badge>
                    <span className="lf-rd-header-date">
                      Preferred: <strong>{request.preferredDate || "Flexible"}</strong> {request.preferredTime && `at ${request.preferredTime}`}
                    </span>
                  </div>
                </div>

                {/* ── 3. TWO-COLUMN DETAILS GRID ──────────────────────────── */}
                <Row className="g-4 mt-1">
                  <Col lg={7}>
                    <RequestInfoCard
                      request={{
                        ...request,
                        date: request.preferredDate || "Flexible",
                        time: request.preferredTime || "Any time",
                      }}
                    />
                  </Col>

                  <Col lg={5} className="d-flex flex-column gap-4">
                    {/* Service Status Timeline */}
                    <ServiceTimeline
                      status={request.status}
                      statusHistory={request.statusHistory}
                    />

                    {/* Provider Card */}
                    <ProviderCard
                      providerDetails={
                        typeof request.provider === "object" && request.provider !== null
                          ? {
                              name: request.provider.name,
                              phone: request.provider.phone,
                              email: request.provider.email,
                              rating: 4.8,
                              completedJobs: 24,
                            }
                          : null
                      }
                      providerName={
                        typeof request.provider === "object" && request.provider !== null
                          ? request.provider.name
                          : request.provider
                      }
                      status={request.status}
                    />

                    {/* Contextual Action Buttons */}
                    <div className="lf-rd-card p-3 d-flex flex-column gap-2">
                      {request.status === "Pending" && (
                        <Button
                          variant="outline-danger"
                          className="w-100 fw-semibold"
                          onClick={handleCancelRequest}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel Service Request
                        </Button>
                      )}

                      {request.status === "Completed" && (
                        <Button
                          variant="primary"
                          className="w-100 fw-semibold"
                          onClick={() => setShowReviewModal(true)}
                        >
                          <i className="bi bi-star-fill me-2 text-warning"></i>
                          Rate &amp; Review Service Provider
                        </Button>
                      )}

                      <Link to="/help" className="btn btn-outline-secondary w-100 fs-7">
                        <i className="bi bi-question-circle me-2"></i>
                        Need Help with this Request?
                      </Link>
                    </div>
                  </Col>
                </Row>

                {/* ── RATING & REVIEW MODAL ──────────────────────────────── */}
                <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
                  <Modal.Header closeButton>
                    <Modal.Title className="fs-6 fw-bold">
                      ⭐ Rate &amp; Review Service
                    </Modal.Title>
                  </Modal.Header>
                  <Form onSubmit={handleSubmitReview}>
                    <Modal.Body>
                      {reviewSuccess ? (
                        <Alert variant="success" className="text-center py-3">
                          <i className="bi bi-check-circle-fill fs-3 d-block mb-2"></i>
                          Thank you! Your review has been recorded.
                        </Alert>
                      ) : (
                        <>
                          {reviewError && (
                            <Alert variant="danger" className="py-2 fs-7 mb-3">
                              <i className="bi bi-exclamation-triangle-fill me-2"></i>
                              {reviewError}
                            </Alert>
                          )}

                          <Form.Group className="mb-3 text-center">
                            <Form.Label className="fw-semibold d-block mb-2">How was your service experience?</Form.Label>
                            <div className="d-flex justify-content-center gap-2 fs-3 text-warning">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`bi ${star <= rating ? "bi-star-fill" : "bi-star"} cursor-pointer`}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => setRating(star)}
                                />
                              ))}
                            </div>
                            <small className="text-muted d-block mt-1">{rating} out of 5 stars</small>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold fs-7">Your Feedback &amp; Comments</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder="Write a brief review about the quality, timeliness, and professionalism..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </Form.Group>
                        </>
                      )}
                    </Modal.Body>
                    {!reviewSuccess && (
                      <Modal.Footer>
                        <Button variant="light" onClick={() => setShowReviewModal(false)}>
                          Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={submittingReview}>
                          {submittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </Modal.Footer>
                    )}
                  </Form>
                </Modal>
              </>
            ) : null}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;
