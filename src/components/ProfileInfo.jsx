// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProfileInfo.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the "Personal Information" card on the Customer Profile page.
//
// FUNCTIONALITY:
//   1. Displays customer details (Full Name, Email, Phone Number, Address).
//   2. Includes an "Edit Profile" toggle button.
//   3. Uses React's useState() to switch between "View Mode" and "Edit Mode".
//   4. In Edit Mode, transforms text fields into controlled <Form.Control> inputs.
//   5. Clicking "Save Changes" validates, saves data in local state, and shows a
//      friendly success alert.
//   6. Clicking "Cancel" reverts changes back to previously saved state.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";

function ProfileInfo() {
  // ── 1. STATE FOR SAVED PROFILE DATA ─────────────────────────────────────
  const [profileData, setProfileData] = useState({
    fullName: "Soham Mahadik",
    email: "soham@example.com",
    phone: "+91 98765 43210",
    address: "Flat 402, Sunshine Heights, Link Road, Andheri West, Mumbai, Maharashtra 400053",
  });

  // ── 2. STATE FOR EDIT MODE TOGGLE ───────────────────────────────────────
  // isEditing is true when user is typing in inputs, false in read-only view
  const [isEditing, setIsEditing] = useState(false);

  // ── 3. TEMPORARY DRAFT STATE FOR EDITING FORM ───────────────────────────
  const [formData, setFormData] = useState({ ...profileData });

  // ── 4. SUCCESS ALERT NOTIFICATION STATE ──────────────────────────────────
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Enter edit mode
  const handleEditClick = () => {
    setFormData({ ...profileData }); // Copy current saved data into draft form
    setIsEditing(true);
    setSaveSuccess(false);
  };

  // Handle text input changes in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save changes
  const handleSave = (e) => {
    e.preventDefault();
    setProfileData({ ...formData }); // Commit draft data to main profile state
    setIsEditing(false);
    setSaveSuccess(true);

    // Auto-dismiss alert after 4 seconds
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  // Cancel edit mode and revert draft
  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <Card className="lf-profile-card mb-4">
      {/* ── CARD HEADER ─────────────────────────────────────────────────── */}
      <Card.Header className="lf-profile-card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="lf-rd-card-header-icon">
            <i className="bi bi-person-lines-fill"></i>
          </div>
          <h5 className="lf-profile-card-title mb-0">Personal Information</h5>
        </div>

        {/* Edit / View Toggle Button in Header */}
        {!isEditing && (
          <Button
            variant="outline-primary"
            size="sm"
            className="lf-btn-edit-toggle"
            onClick={handleEditClick}
          >
            <i className="bi bi-pencil-square me-1"></i> Edit Profile
          </Button>
        )}
      </Card.Header>

      {/* ── CARD BODY ───────────────────────────────────────────────────── */}
      <Card.Body className="p-4">
        {/* Success Alert Banner */}
        {saveSuccess && (
          <Alert
            variant="success"
            dismissible
            onClose={() => setSaveSuccess(false)}
            className="lf-action-alert mb-4"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            ✓ Profile updated successfully!
          </Alert>
        )}

        {isEditing ? (
          /* ── EDIT MODE FORM ──────────────────────────────────────────── */
          <Form onSubmit={handleSave}>
            <Row className="g-3">
              {/* Full Name */}
              <Col md={6}>
                <Form.Group controlId="editFullName">
                  <Form.Label className="lf-form-field-label">
                    Full Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    className="lf-form-input"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Email Address */}
              <Col md={6}>
                <Form.Group controlId="editEmail">
                  <Form.Label className="lf-form-field-label">
                    Email Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className="lf-form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Phone Number */}
              <Col md={6}>
                <Form.Group controlId="editPhone">
                  <Form.Label className="lf-form-field-label">
                    Phone Number <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    className="lf-form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Service Address */}
              <Col md={12}>
                <Form.Group controlId="editAddress">
                  <Form.Label className="lf-form-field-label">
                    Primary Service Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    className="lf-form-textarea"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Edit Action Buttons */}
            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button
                variant="outline-secondary"
                size="sm"
                className="px-3"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="lf-action-btn-primary px-4"
              >
                <i className="bi bi-check-lg me-1"></i> Save Changes
              </Button>
            </div>
          </Form>
        ) : (
          /* ── VIEW MODE DISPLAY ───────────────────────────────────────── */
          <div className="lf-profile-info-grid">
            {/* Full Name */}
            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-person-fill me-1 text-primary"></i> Full Name
              </span>
              <p className="lf-profile-info-value">{profileData.fullName}</p>
            </div>

            {/* Email Address */}
            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-envelope-fill me-1 text-primary"></i> Email Address
              </span>
              <p className="lf-profile-info-value">{profileData.email}</p>
            </div>

            {/* Phone Number */}
            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-telephone-fill me-1 text-primary"></i> Phone Number
              </span>
              <p className="lf-profile-info-value">{profileData.phone}</p>
            </div>

            {/* Primary Address */}
            <div className="lf-profile-info-item lf-profile-info-full">
              <span className="lf-profile-info-label">
                <i className="bi bi-geo-alt-fill me-1 text-danger"></i> Primary Service Address
              </span>
              <p className="lf-profile-info-value">{profileData.address}</p>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProfileInfo;
