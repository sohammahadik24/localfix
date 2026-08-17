// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProviderCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Displays the assigned service professional details on the Request Details page.
//
// PROPS RECEIVED:
//   providerDetails → Object with provider profile info (name, rating, experience, phone, avatar, etc.)
//   providerName    → Fallback string if providerDetails is partial
//   status          → Current status of the request ("Pending", "Accepted", etc.)
//
// CONDITIONAL RENDERING:
//   1. If status === "Pending" or provider is null:
//      → Renders the "Provider not assigned" state with matching radar animation & info.
//   2. If a provider is assigned (Accepted, In Progress, Completed):
//      → Renders the provider avatar, verified badge, rating, experience,
//        completed jobs, phone/email contact triggers, and a Contact Provider button.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";

function ProviderCard({ providerDetails, providerName, status }) {
  const [showContactModal, setShowContactModal] = useState(false);

  // Check if provider is currently unassigned or status is Pending
  const isPending = status === "Pending" || (!providerDetails && !providerName);

  // Fallback data if providerDetails is just a string provider name
  const provider = providerDetails || (providerName ? {
    name: providerName,
    businessName: providerName,
    avatar: providerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    avatarBg: "#2563EB",
    serviceType: "Verified Service Specialist",
    rating: 4.9,
    reviewsCount: 120,
    experience: "5+ years",
    phone: "+91 98200 12345",
    email: "contact@localfix.in",
    verified: true,
    completedJobs: 250,
  } : null);

  return (
    <div className="lf-rd-card lf-provider-card">
      {/* ── CARD HEADER ───────────────────────────────────────────────── */}
      <div className="lf-rd-card-header">
        <div className="d-flex align-items-center gap-2">
          <div className="lf-rd-card-header-icon">
            <i className="bi bi-person-badge-fill"></i>
          </div>
          <h5 className="lf-rd-card-title">Assigned Provider</h5>
        </div>
        {isPending ? (
          <Badge bg="warning" text="dark" className="lf-status-badge">
            <i className="bi bi-hourglass-split me-1"></i> Matching
          </Badge>
        ) : (
          <Badge bg="success" className="lf-status-badge">
            <i className="bi bi-check-circle-fill me-1"></i> Assigned
          </Badge>
        )}
      </div>

      {/* ── CARD BODY ─────────────────────────────────────────────────── */}
      <div className="lf-rd-card-body">
        {isPending ? (
          /* ── UNASSIGNED / PENDING STATE ────────────────────────────── */
          <div className="lf-provider-pending-state">
            <div className="lf-provider-radar-wrap">
              <div className="lf-provider-radar-ring"></div>
              <div className="lf-provider-radar-icon">
                <i className="bi bi-search"></i>
              </div>
            </div>
            <h6 className="lf-provider-pending-title">Provider not assigned</h6>
            <p className="lf-provider-pending-desc">
              We are currently broadcasting your request to verified, top-rated
              service professionals in your area. You will receive an instant
              notification once a provider accepts.
            </p>
            <div className="lf-provider-pending-estimate">
              <i className="bi bi-clock-history me-1 text-warning"></i>
              <span>Estimated acceptance: <strong>15–30 minutes</strong></span>
            </div>
          </div>
        ) : (
          /* ── ASSIGNED PROVIDER DETAILS ─────────────────────────────── */
          <div className="lf-provider-assigned-state">
            {/* Top Row: Avatar + Name + Specialty + Rating */}
            <div className="lf-provider-profile-row">
              <div
                className="lf-provider-avatar"
                style={{ backgroundColor: provider.avatarBg || "#2563EB" }}
              >
                {provider.avatar || "P"}
                {provider.verified && (
                  <span className="lf-provider-verified-check" title="Verified Professional">
                    <i className="bi bi-patch-check-fill"></i>
                  </span>
                )}
              </div>

              <div className="lf-provider-main-info">
                <div className="d-flex align-items-center gap-2">
                  <h6 className="lf-provider-name">{provider.name}</h6>
                  {provider.verified && (
                    <span className="lf-provider-verified-pill">
                      <i className="bi bi-shield-fill-check me-1"></i> Verified
                    </span>
                  )}
                </div>
                {provider.businessName && provider.businessName !== provider.name && (
                  <p className="lf-provider-business">{provider.businessName}</p>
                )}
                <p className="lf-provider-specialty">
                  <i className="bi bi-wrench-adjustable me-1 text-primary"></i>
                  {provider.serviceType || "Certified Professional"}
                </p>
              </div>
            </div>

            {/* Provider Quick Stats Grid */}
            <div className="lf-provider-stats-grid">
              {/* Rating */}
              <div className="lf-provider-stat-box">
                <div className="lf-provider-stat-value text-warning">
                  <i className="bi bi-star-fill me-1"></i>
                  {provider.rating || 4.9}
                </div>
                <div className="lf-provider-stat-label">
                  ({provider.reviewsCount || 100}+ reviews)
                </div>
              </div>

              {/* Experience */}
              <div className="lf-provider-stat-box">
                <div className="lf-provider-stat-value text-dark">
                  {provider.experience || "5+ yrs"}
                </div>
                <div className="lf-provider-stat-label">Experience</div>
              </div>

              {/* Completed Jobs */}
              <div className="lf-provider-stat-box">
                <div className="lf-provider-stat-value text-success">
                  {provider.completedJobs || 200}+
                </div>
                <div className="lf-provider-stat-label">Completed</div>
              </div>
            </div>

            {/* Direct Contact Action Button */}
            <button
              type="button"
              className="lf-provider-contact-btn"
              onClick={() => setShowContactModal(true)}
            >
              <i className="bi bi-telephone-fill me-2"></i>
              Contact Provider
            </button>
          </div>
        )}
      </div>

      {/* ── CONTACT MODAL ────────────────────────────────────────────── */}
      {provider && (
        <Modal
          show={showContactModal}
          onHide={() => setShowContactModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="fs-6 fw-bold">
              <i className="bi bi-person-lines-fill me-2 text-primary"></i>
              Contact Provider
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="text-center mb-4">
              <div
                className="lf-provider-avatar mx-auto mb-3"
                style={{
                  width: "60px",
                  height: "60px",
                  fontSize: "1.2rem",
                  backgroundColor: provider.avatarBg || "#2563EB",
                }}
              >
                {provider.avatar}
              </div>
              <h5 className="fw-bold mb-1">{provider.name}</h5>
              <p className="text-muted small mb-0">{provider.businessName || provider.serviceType}</p>
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted d-block">Phone Number</small>
                  <strong className="text-dark">{provider.phone || "+91 98201 45678"}</strong>
                </div>
                <a
                  href={`tel:${provider.phone || "+919820145678"}`}
                  className="btn btn-sm btn-primary"
                >
                  <i className="bi bi-telephone-fill me-1"></i> Call Now
                </a>
              </div>

              <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted d-block">Email Support</small>
                  <strong className="text-dark">{provider.email || "provider@localfix.in"}</strong>
                </div>
                <a
                  href={`mailto:${provider.email || "provider@localfix.in"}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  <i className="bi bi-envelope-fill me-1"></i> Email
                </a>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowContactModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default ProviderCard;
