// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProviderRequestCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders a single customer service request card for providers with
//   interactive Accept, Reject, and View Details actions.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Card, Badge, Button, Modal } from "react-bootstrap";

const statusStyleMap = {
  Pending: { bg: "warning", text: "dark", label: "Pending Response", icon: "bi bi-hourglass-split" },
  Accepted: { bg: "success", text: "white", label: "Accepted", icon: "bi bi-check-circle-fill" },
  Rejected: { bg: "danger", text: "white", label: "Rejected", icon: "bi bi-x-circle-fill" },
};

function ProviderRequestCard({ request, onAccept, onReject }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const reqId = request._id || request.id;
  const customerName =
    typeof request.customer === "object" && request.customer !== null
      ? request.customer.name
      : request.customer || "Local Customer";
  const customerPhone =
    typeof request.customer === "object" && request.customer !== null
      ? request.customer.phone
      : request.customerPhone || "Provided upon acceptance";

  const statusInfo = statusStyleMap[request.status] || {
    bg: "secondary",
    text: "white",
    label: request.status,
    icon: "bi bi-info-circle",
  };

  return (
    <>
      <Card className="lf-provider-req-card mb-3">
        <Card.Body className="p-4">
          {/* ── CARD TOP ROW: Service Icon + Title + Category + Status Badge ── */}
          <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
            <div className="d-flex align-items-center gap-3">
              <div
                className="lf-my-request-icon"
                style={{
                  backgroundColor: "#2563EB18",
                  color: "#2563EB",
                }}
              >
                <i className={request.icon || "bi bi-tools"}></i>
              </div>

              <div>
                <h5 className="lf-my-request-title mb-1">{request.title}</h5>
                <div className="d-flex align-items-center gap-2">
                  <span className="lf-my-request-category">
                    <i className="bi bi-tag-fill me-1"></i> {request.service}
                  </span>
                  {request.aiCategory && request.aiCategory !== request.service && (
                    <span className="badge bg-light text-primary border border-primary-subtle fs-8">
                      <i className="bi bi-robot me-1"></i>
                      AI: {request.aiCategory}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Payout & Status Badges */}
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success fs-6 fw-bold px-3 py-2 rounded-pill">
                {request.payout || "₹500 - ₹1,000"}
              </span>
              <Badge bg={statusInfo.bg} text={statusInfo.text} className="lf-my-request-status-badge">
                <i className={`${statusInfo.icon} me-1`}></i>
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* ── PROBLEM DESCRIPTION ──────────────────────────────────────── */}
          <p className="lf-my-request-desc text-dark mb-3">
            <strong>Problem:</strong> {request.description}
          </p>

          <hr className="my-3" />

          {/* ── META INFO: Customer, Location, Date & Time ────────────────── */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-4 flex-wrap small text-muted">
              {/* Customer Name */}
              <span>
                <i className="bi bi-person-fill text-primary me-1"></i>
                Customer: <strong className="text-dark">{customerName}</strong>
              </span>

              {/* Location */}
              <span>
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {request.location}
              </span>

              {/* Date & Time */}
              <span>
                <i className="bi bi-calendar3 text-primary me-1"></i>
                <strong>{request.preferredDate || request.date || "Today"}</strong> {request.preferredTime || request.time ? `at ${request.preferredTime || request.time}` : ""}
              </span>
            </div>

            {/* ── ACTION BUTTONS ─────────────────────────────────────────── */}
            <div className="d-flex gap-2 align-items-center flex-wrap">
              {request.hasScheduleConflict && (
                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fs-8">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> Slot Busy ({request.conflictJobTitle || "Active Job"})
                </span>
              )}

              <Button
                variant="outline-secondary"
                size="sm"
                className="px-3"
                onClick={() => setShowDetailsModal(true)}
              >
                <i className="bi bi-eye me-1"></i> View Details
              </Button>

              {request.status === "Pending" ? (
                <>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="px-3"
                    onClick={() => onReject(reqId, request.title)}
                  >
                    <i className="bi bi-x-lg me-1"></i> Decline
                  </Button>
                  <Button
                    variant={request.hasScheduleConflict ? "secondary" : "primary"}
                    size="sm"
                    disabled={request.hasScheduleConflict}
                    className={`px-3 ${!request.hasScheduleConflict ? "lf-action-btn-primary" : ""}`}
                    onClick={() => onAccept(reqId, request.title)}
                    title={request.hasScheduleConflict ? "You cannot take multiple jobs on the same date and time." : "Accept this booking"}
                  >
                    <i className="bi bi-check-lg me-1"></i> {request.hasScheduleConflict ? "Time Conflict" : "Accept Job"}
                  </Button>
                </>
              ) : request.status === "Accepted" ? (
                <span className="text-success small fw-bold d-inline-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-1"></i> Booking Accepted
                </span>
              ) : (
                <span className="text-danger small fw-bold d-inline-flex align-items-center">
                  <i className="bi bi-x-circle-fill me-1"></i> Request Declined
                </span>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* ── VIEW DETAILS MODAL ─────────────────────────────────────────── */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-clipboard-data me-2 text-primary"></i>
            Service Request #{reqId?.substring ? reqId.substring(reqId.length - 6).toUpperCase() : reqId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-3">
            <h5 className="fw-bold mb-1">{request.title}</h5>
            <span className="badge bg-light text-primary border">{request.service}</span>
          </div>

          <div className="p-3 bg-light rounded-3 mb-3">
            <label className="text-muted small text-uppercase fw-bold d-block mb-1">
              Customer Problem Description
            </label>
            <p className="mb-0 text-dark small">{request.description}</p>
          </div>

          <div className="d-flex flex-column gap-2 small mb-3">
            <div className="d-flex justify-content-between">
              <span className="text-muted">Customer Name:</span>
              <strong className="text-dark">{customerName}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Contact Phone:</span>
              <strong className="text-dark">{customerPhone}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Service Location:</span>
              <span className="text-dark text-end" style={{ maxWidth: "240px" }}>
                {request.location}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Preferred Time:</span>
              <strong className="text-dark">{request.preferredDate || request.date || "Flexible"} {request.preferredTime && `at ${request.preferredTime}`}</strong>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {request.status === "Pending" && (
            <Button
              variant="primary"
              size="sm"
              className="lf-action-btn-primary"
              onClick={() => {
                onAccept(reqId, request.title);
                setShowDetailsModal(false);
              }}
            >
              <i className="bi bi-check-lg me-1"></i> Accept This Job
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProviderRequestCard;
