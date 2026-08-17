// ─────────────────────────────────────────────────────────────────────────────
// src/components/RequestInfoCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the "Request Information" card on the Request Details / Tracking page.
//
// PROPS RECEIVED:
//   request → The full request object matching the route ID:
//             {
//               id, title, service, category, description,
//               date, time, location, notes, image, imageName,
//               icon, iconColor, status
//             }
//
// WHAT IT DISPLAYS:
//   1. Problem description with readable typography
//   2. Service Category badge with category icon
//   3. Location / Address with a map-pin indicator
//   4. Preferred scheduled Date & Time
//   5. Additional customer notes / instructions (with custom styling)
//   6. Uploaded problem photo preview (with interactive full-screen modal)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function RequestInfoCard({ request }) {
  // State for image zoom modal preview
  const [showImageModal, setShowImageModal] = useState(false);

  if (!request) return null;

  return (
    <div className="lf-rd-card">
      {/* ── CARD HEADER ───────────────────────────────────────────────── */}
      <div className="lf-rd-card-header">
        <div className="d-flex align-items-center gap-2">
          <div className="lf-rd-card-header-icon">
            <i className="bi bi-file-earmark-text-fill"></i>
          </div>
          <h5 className="lf-rd-card-title">Request Information</h5>
        </div>
        <span className="lf-rd-card-badge">
          <i className="bi bi-hash"></i>REQ-000{request.id}
        </span>
      </div>

      {/* ── CARD BODY ─────────────────────────────────────────────────── */}
      <div className="lf-rd-card-body">
        {/* 1. Problem Description */}
        <div className="lf-rd-section">
          <label className="lf-rd-label">
            <i className="bi bi-card-text me-1"></i> Problem Description
          </label>
          <div className="lf-rd-desc-box">
            <p className="lf-rd-desc-text">{request.description}</p>
          </div>
        </div>

        {/* 2. Key Details Grid */}
        <div className="lf-rd-grid">
          {/* Service Category */}
          <div className="lf-rd-grid-item">
            <label className="lf-rd-label">
              <i className="bi bi-tag-fill me-1"></i> Service Category
            </label>
            <div className="lf-rd-category-pill">
              <span
                className="lf-rd-cat-icon-wrap"
                style={{
                  backgroundColor: (request.iconColor || "#2563EB") + "18",
                  color: request.iconColor || "#2563EB",
                }}
              >
                <i className={request.icon || "bi bi-tools"}></i>
              </span>
              <span className="lf-rd-cat-text">
                {request.service || request.category}
              </span>
            </div>
          </div>

          {/* Preferred Date & Time */}
          <div className="lf-rd-grid-item">
            <label className="lf-rd-label">
              <i className="bi bi-calendar-event me-1"></i> Preferred Schedule
            </label>
            <div className="lf-rd-value-block">
              <div className="lf-rd-date-time">
                <span className="lf-rd-date">
                  <i className="bi bi-calendar3 me-1 text-primary"></i>
                  {request.date}
                </span>
                <span className="lf-rd-time">
                  <i className="bi bi-clock me-1 text-primary"></i>
                  {request.time}
                </span>
              </div>
            </div>
          </div>

          {/* Service Location / Address (Full Width) */}
          <div className="lf-rd-grid-item lf-rd-grid-full">
            <label className="lf-rd-label">
              <i className="bi bi-geo-alt-fill me-1"></i> Service Location
            </label>
            <div className="lf-rd-location-box">
              <i className="bi bi-pin-map-fill lf-rd-location-icon"></i>
              <span className="lf-rd-location-text">{request.location}</span>
            </div>
          </div>

          {/* Additional Notes (if present) */}
          {request.notes && (
            <div className="lf-rd-grid-item lf-rd-grid-full">
              <label className="lf-rd-label">
                <i className="bi bi-chat-left-dots-fill me-1"></i> Additional Notes
              </label>
              <div className="lf-rd-notes-box">
                <i className="bi bi-info-circle-fill lf-rd-notes-icon"></i>
                <p className="lf-rd-notes-text">{request.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Uploaded Problem Image Preview (Conditional) */}
        {request.image ? (
          <div className="lf-rd-section mt-4">
            <label className="lf-rd-label">
              <i className="bi bi-image-fill me-1"></i> Attached Photo
            </label>
            <div className="lf-rd-image-container">
              <div
                className="lf-rd-image-preview-card"
                onClick={() => setShowImageModal(true)}
                title="Click to view full image"
              >
                <img
                  src={request.image}
                  alt={request.title}
                  className="lf-rd-attached-img"
                />
                <div className="lf-rd-image-overlay">
                  <i className="bi bi-arrows-fullscreen"></i>
                  <span>Click to expand</span>
                </div>
              </div>
              <div className="lf-rd-image-meta">
                <span className="lf-rd-image-name">
                  <i className="bi bi-file-earmark-image me-1"></i>
                  {request.imageName || "attachment_photo.jpg"}
                </span>
                <span className="lf-rd-image-status">
                  <i className="bi bi-check-circle-fill me-1 text-success"></i>
                  Uploaded with request
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lf-rd-no-image-box mt-3">
            <i className="bi bi-camera-slash me-2 text-muted"></i>
            <span className="text-muted">No photo attached to this request</span>
          </div>
        )}
      </div>

      {/* ── IMAGE ZOOM MODAL ─────────────────────────────────────────── */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
        contentClassName="lf-rd-image-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-image me-2 text-primary"></i>
            Attached Photo: {request.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 text-center bg-dark">
          {request.image && (
            <img
              src={request.image}
              alt={request.title}
              className="img-fluid"
              style={{ maxHeight: "70vh", objectFit: "contain" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="py-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowImageModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RequestInfoCard;
