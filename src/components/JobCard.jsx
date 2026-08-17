// ─────────────────────────────────────────────────────────────────────────────
// src/components/JobCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders an individual job card on the "My Jobs" provider page.
//
// PROPS:
//   job            → The job data object from providerJobs
//   onUpdateStatus → Callback function passed from MyJobs.jsx to update the status in local state
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Card, Badge, Button, Modal, Form } from "react-bootstrap";

// Status configuration map for badges and styling
const statusConfig = {
  Accepted: {
    bg: "info",
    text: "dark",
    label: "Accepted",
    icon: "bi bi-check-circle-fill",
    nextStep: "On the Way",
    nextLabel: "Set 'On the Way'",
  },
  "On the Way": {
    bg: "info",
    text: "white",
    label: "On the Way",
    icon: "bi bi-truck",
    nextStep: "In Progress",
    nextLabel: "Start Work (In Progress)",
  },
  "In Progress": {
    bg: "primary",
    text: "white",
    label: "In Progress",
    icon: "bi bi-arrow-repeat",
    nextStep: "Completed",
    nextLabel: "Mark as Completed",
  },
  Completed: {
    bg: "success",
    text: "white",
    label: "Completed",
    icon: "bi bi-patch-check-fill",
    nextStep: null,
    nextLabel: null,
  },
  Cancelled: {
    bg: "danger",
    text: "white",
    label: "Cancelled",
    icon: "bi bi-x-circle-fill",
    nextStep: null,
    nextLabel: null,
  },
};

function JobCard({ job, onUpdateStatus }) {
  const jobId = job._id || job.id;
  const customerName =
    typeof job.customer === "object" && job.customer !== null
      ? job.customer.name
      : job.customer;
  const customerPhone =
    typeof job.customer === "object" && job.customer !== null
      ? job.customer.phone
      : job.customerPhone || "Provided on booking";

  // Modals state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState(job.status);

  const currentConfig = statusConfig[job.status] || {
    bg: "secondary",
    text: "white",
    label: job.status,
    icon: "bi bi-info-circle",
  };

  const handleSaveStatusModal = (e) => {
    e.preventDefault();
    onUpdateStatus(jobId, selectedNewStatus, job.title);
    setShowUpdateModal(false);
  };

  // Quick 1-click advance to next status step
  const handleQuickAdvance = () => {
    if (currentConfig.nextStep) {
      onUpdateStatus(jobId, currentConfig.nextStep, job.title);
    }
  };

  return (
    <>
      <Card className="lf-provider-req-card mb-3">
        <Card.Body className="p-4">
          {/* ── TOP ROW: Icon + Title + Category + Status Badge + Payout ─── */}
          <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
            <div className="d-flex align-items-center gap-3">
              {/* Category Icon */}
              <div
                className="lf-my-request-icon"
                style={{
                  backgroundColor: (job.color || "#2563EB") + "18",
                  color: job.color || "#2563EB",
                }}
              >
                <i className={job.icon || "bi bi-tools"}></i>
              </div>

              <div>
                <h5 className="lf-my-request-title mb-1">{job.title}</h5>
                <span className="lf-my-request-category">
                  <i className="bi bi-tag-fill me-1"></i> {job.service}
                </span>
              </div>
            </div>

            {/* Payout & Status Badges */}
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success fs-6 fw-bold px-3 py-2 rounded-pill">
                {job.payout || "₹500 - ₹1,200"}
              </span>
              <Badge bg={currentConfig.bg} text={currentConfig.text} className="lf-my-request-status-badge">
                <i className={`${currentConfig.icon} me-1`}></i>
                {currentConfig.label}
              </Badge>
            </div>
          </div>

          {/* ── JOB PROBLEM DESCRIPTION ──────────────────────────────────── */}
          <p className="lf-my-request-desc text-dark mb-3">
            <strong>Problem:</strong> {job.description}
          </p>

          <hr className="my-3" />

          {/* ── META INFO: Customer, Location, Date & Time ────────────────── */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-4 flex-wrap small text-muted">
              {/* Customer */}
              <span>
                <i className="bi bi-person-fill text-primary me-1"></i>
                Customer: <strong className="text-dark">{customerName}</strong>
              </span>

              {/* Location */}
              <span>
                <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                {job.location}
              </span>

              {/* Date & Time */}
              <span>
                <i className="bi bi-calendar3 text-primary me-1"></i>
                <strong>{job.preferredDate || job.date || "Today"}</strong> {job.preferredTime || job.time ? `at ${job.preferredTime || job.time}` : ""}
              </span>
            </div>

            {/* ── ACTION BUTTONS ─────────────────────────────────────────── */}
            <div className="d-flex gap-2 align-items-center">
              {/* View Details */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="px-3"
                onClick={() => setShowDetailsModal(true)}
              >
                <i className="bi bi-eye me-1"></i> View Details
              </Button>

              {/* Update Status Actions */}
              {job.status !== "Completed" && job.status !== "Cancelled" ? (
                <>
                  {/* Quick Advance Button */}
                  {currentConfig.nextStep && (
                    <Button
                      variant={job.status === "In Progress" ? "success" : "primary"}
                      size="sm"
                      className="px-3 fw-semibold"
                      onClick={handleQuickAdvance}
                    >
                      <i className="bi bi-arrow-right-circle me-1"></i>
                      {currentConfig.nextLabel}
                    </Button>
                  )}

                  {/* Change Status Dropdown/Modal Trigger */}
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="px-2"
                    onClick={() => {
                      setSelectedNewStatus(job.status);
                      setShowUpdateModal(true);
                    }}
                    title="Change to another status"
                  >
                    <i className="bi bi-gear-fill"></i>
                  </Button>
                </>
              ) : job.status === "Completed" ? (
                <span className="text-success small fw-bold d-inline-flex align-items-center">
                  <i className="bi bi-patch-check-fill me-1"></i> Job Completed
                </span>
              ) : (
                <span className="text-danger small fw-bold d-inline-flex align-items-center">
                  <i className="bi bi-x-circle-fill me-1"></i> Job Cancelled
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
            <i className="bi bi-clipboard2-check me-2 text-primary"></i>
            Job Details #{jobId?.substring ? jobId.substring(jobId.length - 6).toUpperCase() : jobId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="fw-bold mb-1">{job.title}</h5>
              <span className="badge bg-light text-primary border">{job.service}</span>
            </div>
            <Badge bg={currentConfig.bg} text={currentConfig.text}>
              {currentConfig.label}
            </Badge>
          </div>

          <div className="p-3 bg-light rounded-3 mb-3">
            <label className="text-muted small text-uppercase fw-bold d-block mb-1">
              Customer Problem &amp; Scope
            </label>
            <p className="mb-0 text-dark small">{job.description}</p>
          </div>

          <div className="d-flex flex-column gap-2 small">
            <div className="d-flex justify-content-between">
              <span className="text-muted">Customer Name:</span>
              <strong className="text-dark">{customerName}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Customer Phone:</span>
              <strong className="text-dark">{customerPhone}</strong>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Service Location:</span>
              <span className="text-dark text-end" style={{ maxWidth: "240px" }}>
                {job.location}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-muted">Scheduled Time:</span>
              <strong className="text-dark">{job.preferredDate || job.date || "Flexible"} {job.preferredTime && `at ${job.preferredTime}`}</strong>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
          {currentConfig.nextStep && (
            <Button
              variant={job.status === "In Progress" ? "success" : "primary"}
              size="sm"
              onClick={() => {
                handleQuickAdvance();
                setShowDetailsModal(false);
              }}
            >
              {currentConfig.nextLabel}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* ── UPDATE STATUS MODAL ────────────────────────────────────────── */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-arrow-repeat me-2 text-primary"></i>
            Update Job Status
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveStatusModal}>
          <Modal.Body className="p-3">
            <Form.Group controlId="statusSelect">
              <Form.Label className="small fw-semibold text-muted mb-2">
                Select New Status for "{job.title}"
              </Form.Label>
              <Form.Select
                value={selectedNewStatus}
                onChange={(e) => setSelectedNewStatus(e.target.value)}
                className="lf-form-select"
              >
                <option value="Accepted">Accepted</option>
                <option value="On the Way">On the Way</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="lf-action-btn-primary">
              Save Status
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default JobCard;
