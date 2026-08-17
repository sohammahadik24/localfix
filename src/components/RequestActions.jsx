// ─────────────────────────────────────────────────────────────────────────────
// src/components/RequestActions.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders contextual action buttons on the Request Details / Tracking page
//   based on the current request status.
//
// ACTIONS MAPPING:
//   - Pending     → "Cancel Request"
//   - Accepted    → "Contact Provider"
//   - In Progress → "Track Service"
//   - Completed   → "Give Review"
//   - Cancelled   → "Book Again" / "View Other Services"
//
// INTERACTIVITY:
//   Includes rich interactive feedback modals for review submission,
//   cancellation confirmation, live service tracking radar, and provider contact.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function RequestActions({ request }) {
  // Modal state
  const [activeModal, setActiveModal] = useState(null); // "cancel" | "contact" | "track" | "review" | null
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  // Review Form State
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Cancellation Form State
  const [cancelReason, setCancelReason] = useState("Found another solution");

  if (!request) return null;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setActionSuccessMsg("Thank you! Your 5-star review has been submitted.");
    setActiveModal(null);
  };

  const handleCancelConfirm = () => {
    setActionSuccessMsg("Request has been marked as cancelled.");
    setActiveModal(null);
  };

  return (
    <div className="lf-rd-card lf-actions-card">
      {/* ── CARD HEADER ───────────────────────────────────────────────── */}
      <div className="lf-rd-card-header">
        <div className="d-flex align-items-center gap-2">
          <div className="lf-rd-card-header-icon">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
          <h5 className="lf-rd-card-title">Quick Actions</h5>
        </div>
        <span className="lf-rd-status-label">
          Status: <strong>{request.status}</strong>
        </span>
      </div>

      {/* ── CARD BODY ─────────────────────────────────────────────────── */}
      <div className="lf-rd-card-body">
        {actionSuccessMsg && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setActionSuccessMsg("")}
            className="lf-action-alert mb-3"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {actionSuccessMsg}
          </Alert>
        )}

        <div className="lf-actions-button-group">
          {/* ── 1. STATUS: PENDING ─────────────────────────────────────── */}
          {request.status === "Pending" && (
            <div className="d-flex flex-column gap-2 w-100">
              <Button
                variant="outline-danger"
                className="lf-action-btn-danger"
                onClick={() => setActiveModal("cancel")}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel Request
              </Button>
              <Link to="/request" className="btn btn-outline-secondary lf-action-btn-sub">
                <i className="bi bi-pencil-square me-2"></i>
                Modify Request Details
              </Link>
            </div>
          )}

          {/* ── 2. STATUS: ACCEPTED ────────────────────────────────────── */}
          {request.status === "Accepted" && (
            <div className="d-flex flex-column gap-2 w-100">
              <Button
                variant="primary"
                className="lf-action-btn-primary"
                onClick={() => setActiveModal("contact")}
              >
                <i className="bi bi-telephone-fill me-2"></i>
                Contact Provider
              </Button>
              <Button
                variant="outline-secondary"
                className="lf-action-btn-sub"
                onClick={() => setActiveModal("track")}
              >
                <i className="bi bi-geo-fill me-2"></i>
                View Provider Location
              </Button>
            </div>
          )}

          {/* ── 3. STATUS: IN PROGRESS ─────────────────────────────────── */}
          {request.status === "In Progress" && (
            <div className="d-flex flex-column gap-2 w-100">
              <Button
                variant="primary"
                className="lf-action-btn-primary"
                onClick={() => setActiveModal("track")}
              >
                <i className="bi bi-broadcast-pin me-2"></i>
                Track Service
              </Button>
              <Button
                variant="outline-secondary"
                className="lf-action-btn-sub"
                onClick={() => setActiveModal("contact")}
              >
                <i className="bi bi-chat-dots-fill me-2"></i>
                Message Technician
              </Button>
            </div>
          )}

          {/* ── 4. STATUS: COMPLETED ───────────────────────────────────── */}
          {request.status === "Completed" && (
            <div className="d-flex flex-column gap-2 w-100">
              <Button
                variant="primary"
                className="lf-action-btn-success"
                onClick={() => setActiveModal("review")}
              >
                <i className="bi bi-star-fill me-2"></i>
                Give Review
              </Button>
              <Link to="/request" className="btn btn-outline-secondary lf-action-btn-sub">
                <i className="bi bi-arrow-repeat me-2"></i>
                Book This Service Again
              </Link>
            </div>
          )}

          {/* ── 5. STATUS: CANCELLED ───────────────────────────────────── */}
          {request.status === "Cancelled" && (
            <div className="d-flex flex-column gap-2 w-100">
              <Link to="/request" className="btn btn-primary lf-action-btn-primary">
                <i className="bi bi-plus-circle-fill me-2"></i>
                Create New Request
              </Link>
              <Link to="/services" className="btn btn-outline-secondary lf-action-btn-sub">
                <i className="bi bi-search me-2"></i>
                Browse All Services
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL 1: CANCEL REQUEST ──────────────────────────────────── */}
      <Modal
        show={activeModal === "cancel"}
        onHide={() => setActiveModal(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Cancel Service Request
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-dark fw-semibold mb-2">
            Are you sure you want to cancel this request?
          </p>
          <p className="text-muted small mb-3">
            Since your request is still <strong>Pending</strong>, you can cancel it with no fee.
          </p>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Reason for cancellation</Form.Label>
            <Form.Select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="form-select-sm"
            >
              <option>Found another solution</option>
              <option>Schedule conflict / Need different time</option>
              <option>Created request by mistake</option>
              <option>Other reason</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>
            Keep Request
          </Button>
          <Button variant="danger" size="sm" onClick={handleCancelConfirm}>
            Yes, Cancel Request
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── MODAL 2: CONTACT PROVIDER ────────────────────────────────── */}
      <Modal
        show={activeModal === "contact"}
        onHide={() => setActiveModal(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-telephone-fill me-2 text-primary"></i>
            Contact Service Provider
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="mb-3">
            <i className="bi bi-person-circle fs-1 text-primary"></i>
          </div>
          <h5 className="fw-bold mb-1">{request.provider || "Assigned Provider"}</h5>
          <p className="text-muted small mb-4">{request.service} Professional</p>

          <div className="d-flex flex-column gap-3 text-start">
            <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted d-block">Direct Phone</small>
                <strong>{request.providerDetails?.phone || "+91 98201 45678"}</strong>
              </div>
              <a
                href={`tel:${request.providerDetails?.phone || "+919820145678"}`}
                className="btn btn-sm btn-primary"
              >
                <i className="bi bi-telephone-outbound-fill me-1"></i> Call
              </a>
            </div>
            <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
              <div>
                <small className="text-muted d-block">In-App Chat</small>
                <span className="text-success small fw-semibold">
                  <i className="bi bi-circle-fill me-1" style={{ fontSize: "0.55rem" }}></i> Online Now
                </span>
              </div>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  setActionSuccessMsg("Chat connected with technician.");
                  setActiveModal(null);
                }}
              >
                <i className="bi bi-chat-dots-fill me-1"></i> Start Chat
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── MODAL 3: TRACK SERVICE ───────────────────────────────────── */}
      <Modal
        show={activeModal === "track"}
        onHide={() => setActiveModal(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-broadcast-pin me-2 text-primary"></i>
            Live Service Tracking
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="lf-track-radar-card text-center p-4 mb-3">
            <div className="lf-track-radar-anim mx-auto mb-3">
              <i className="bi bi-geo-alt-fill text-primary fs-2"></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">Technician On Site / En Route</h6>
            <p className="text-muted small mb-0">
              Estimated completion: <strong>45 mins</strong>
            </p>
          </div>

          <div className="p-3 bg-light rounded-3">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>Service Location:</span>
              <strong className="text-dark text-end" style={{ maxWidth: "240px" }}>
                {request.location}
              </strong>
            </div>
            <div className="d-flex justify-content-between small text-muted">
              <span>Scheduled Time:</span>
              <strong className="text-dark">{request.date} at {request.time}</strong>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── MODAL 4: GIVE REVIEW ─────────────────────────────────────── */}
      <Modal
        show={activeModal === "review"}
        onHide={() => setActiveModal(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-star-fill me-2 text-warning"></i>
            Rate & Review Service
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleReviewSubmit}>
          <Modal.Body className="p-4">
            <div className="text-center mb-4">
              <p className="small text-muted mb-2">How was your experience with</p>
              <h6 className="fw-bold text-dark">{request.provider || request.title}?</h6>
              {/* Star Rating Select */}
              <div className="d-flex justify-content-center gap-2 my-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="btn p-0 border-0 fs-3"
                    style={{ color: star <= rating ? "#F59E0B" : "#CBD5E1" }}
                    onClick={() => setRating(star)}
                  >
                    <i className="bi bi-star-fill"></i>
                  </button>
                ))}
              </div>
              <span className="badge bg-light text-dark border">
                {rating === 5 && "⭐ Excellent"}
                {rating === 4 && "⭐ Good"}
                {rating === 3 && "⭐ Average"}
                {rating === 2 && "⭐ Poor"}
                {rating === 1 && "⭐ Terrible"}
              </span>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Feedback / Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your experience with the technician and service quality..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Review
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default RequestActions;
