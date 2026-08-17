// ─────────────────────────────────────────────────────────────────────────────
// src/components/SecurityCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the Security & Password Management card on the Profile page.
//
// FUNCTIONALITY:
//   1. Displays current security status (Last Password Update date).
//   2. Provides a "Change Password" button that opens an interactive modal.
//   3. Supports UI-only password validation (minimum length & confirmation match).
//   4. Demonstrates React useState() for modal control and form input state.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Card, Button, Modal, Form, Alert } from "react-bootstrap";

function SecurityCard() {
  // Modal visibility state
  const [showModal, setShowModal] = useState(false);

  // Form input fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Feedback notifications state
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpenModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setShowModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic UI Validation
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    // Success (UI-only mock)
    setShowModal(false);
    setSuccessMsg("✓ Password updated successfully! (UI-only demo)");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <Card className="lf-profile-card mb-4">
      {/* ── CARD HEADER ─────────────────────────────────────────────────── */}
      <Card.Header className="lf-profile-card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="lf-rd-card-header-icon">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h5 className="lf-profile-card-title mb-0">Security & Login</h5>
        </div>
      </Card.Header>

      {/* ── CARD BODY ───────────────────────────────────────────────────── */}
      <Card.Body className="p-4">
        {successMsg && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setSuccessMsg("")}
            className="lf-action-alert mb-3"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMsg}
          </Alert>
        )}

        <div className="lf-security-row d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h6 className="lf-security-title mb-1">
              <i className="bi bi-key-fill me-2 text-primary"></i> Account Password
            </h6>
            <p className="lf-security-sub mb-0 text-muted">
              Last changed: <strong>May 15, 2026</strong> (3 months ago)
            </p>
          </div>

          <Button
            variant="outline-primary"
            size="sm"
            className="lf-btn-change-password"
            onClick={handleOpenModal}
          >
            <i className="bi bi-pencil me-1"></i> Change Password
          </Button>
        </div>

        <hr className="my-3" />

        {/* Security Recommendation Tip */}
        <div className="d-flex align-items-center gap-2 text-muted small">
          <i className="bi bi-info-circle-fill text-primary"></i>
          <span>Use a strong password with at least 8 characters, numbers, and symbols.</span>
        </div>
      </Card.Body>

      {/* ── CHANGE PASSWORD MODAL ─────────────────────────────────────── */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-shield-lock me-2 text-primary"></i> Change Account Password
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordSubmit}>
          <Modal.Body className="p-4">
            {errorMsg && (
              <Alert variant="danger" className="py-2 px-3 small mb-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errorMsg}
              </Alert>
            )}

            {/* Current Password */}
            <Form.Group className="mb-3" controlId="currentPwd">
              <Form.Label className="lf-form-field-label">Current Password</Form.Label>
              <Form.Control
                type="password"
                className="lf-form-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* New Password */}
            <Form.Group className="mb-3" controlId="newPwd">
              <Form.Label className="lf-form-field-label">New Password</Form.Label>
              <Form.Control
                type="password"
                className="lf-form-input"
                placeholder="Enter new password (min. 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* Confirm New Password */}
            <Form.Group className="mb-2" controlId="confirmPwd">
              <Form.Label className="lf-form-field-label">Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                className="lf-form-input"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="lf-action-btn-primary">
              Update Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );
}

export default SecurityCard;
