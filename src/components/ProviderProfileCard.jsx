// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProviderProfileCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the Professional Information card on the Provider Profile page.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { providersAPI } from "../services/api";

function ProviderProfileCard({ initialProfile, user, onProfileUpdate }) {
  const [profileData, setProfileData] = useState({
    businessName: "Raj Plumbing Services",
    email: user?.email || "provider@example.com",
    phone: user?.phone || "+91 98765 43210",
    primaryService: "Plumbing",
    experience: "6+ Years",
    serviceArea: "Mumbai / Andheri / Bandra",
    bio: "Certified master technician with extensive experience in residential repairs, fittings, and troubleshooting.",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      const data = {
        businessName: initialProfile.businessName || initialProfile.name || "Service Pro",
        email: user?.email || initialProfile.email || "provider@example.com",
        phone: initialProfile.phone || user?.phone || "+91 98765 43210",
        primaryService: initialProfile.services?.[0] || initialProfile.service || "Plumbing",
        experience: initialProfile.experience || "5+ Years",
        serviceArea: initialProfile.location || initialProfile.serviceArea || "Mumbai",
        bio: initialProfile.bio || initialProfile.description || "Certified service professional.",
      };
      setProfileData(data);
      setFormData(data);
    }
  }, [initialProfile, user]);

  const handleEditClick = () => {
    setFormData({ ...profileData });
    setIsEditing(true);
    setSaveSuccess(false);
    setSaveError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const payload = {
        businessName: formData.businessName,
        phone: formData.phone,
        services: [formData.primaryService],
        experience: formData.experience,
        location: formData.serviceArea,
        bio: formData.bio,
      };

      let res;
      try {
        res = await providersAPI.updateProfile(payload);
      } catch (e) {
        res = await providersAPI.createProfile(payload);
      }

      if (res && res.success) {
        setProfileData({ ...formData });
        setIsEditing(false);
        setSaveSuccess(true);
        if (onProfileUpdate) {
          onProfileUpdate(formData.businessName);
        }
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      setSaveError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <Card className="lf-profile-card mb-4">
      <Card.Header className="lf-profile-card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <div className="lf-rd-card-header-icon">
            <i className="bi bi-person-lines-fill"></i>
          </div>
          <h5 className="lf-profile-card-title mb-0">Professional Information</h5>
        </div>

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

      <Card.Body className="p-4">
        {saveSuccess && (
          <Alert variant="success" dismissible onClose={() => setSaveSuccess(false)} className="lf-action-alert mb-4">
            <i className="bi bi-check-circle-fill me-2"></i>
            ✓ Provider profile updated successfully in MongoDB!
          </Alert>
        )}

        {saveError && (
          <Alert variant="danger" dismissible onClose={() => setSaveError("")} className="py-2 fs-7 mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {saveError}
          </Alert>
        )}

        {isEditing ? (
          <Form onSubmit={handleSave}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="provFullName">
                  <Form.Label className="lf-form-field-label">
                    Business / Provider Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="businessName"
                    className="lf-form-input"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="provEmail">
                  <Form.Label className="lf-form-field-label">
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className="lf-form-input"
                    value={formData.email}
                    disabled
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="provPhone">
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

              <Col md={6}>
                <Form.Group controlId="provPrimaryService">
                  <Form.Label className="lf-form-field-label">
                    Primary Service Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="primaryService"
                    className="lf-form-select"
                    value={formData.primaryService}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="AC Repair">AC Repair</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="provExp">
                  <Form.Label className="lf-form-field-label">
                    Experience Level
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="experience"
                    className="lf-form-input"
                    value={formData.experience}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="provArea">
                  <Form.Label className="lf-form-field-label">
                    Service Coverage Area <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="serviceArea"
                    className="lf-form-input"
                    value={formData.serviceArea}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="provBio">
                  <Form.Label className="lf-form-field-label">
                    About / Professional Bio <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    className="lf-form-textarea"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <Button
                variant="outline-secondary"
                size="sm"
                className="px-3"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="lf-action-btn-primary px-4"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        ) : (
          <div className="lf-profile-info-grid">
            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-person-fill me-1 text-primary"></i> Business / Provider Name
              </span>
              <p className="lf-profile-info-value">{profileData.businessName}</p>
            </div>

            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-envelope-fill me-1 text-primary"></i> Email Address
              </span>
              <p className="lf-profile-info-value">{profileData.email}</p>
            </div>

            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-telephone-fill me-1 text-primary"></i> Phone Number
              </span>
              <p className="lf-profile-info-value">{profileData.phone}</p>
            </div>

            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-tools me-1 text-primary"></i> Primary Service
              </span>
              <p className="lf-profile-info-value text-primary fw-bold">
                {profileData.primaryService}
              </p>
            </div>

            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-award-fill me-1 text-warning"></i> Experience
              </span>
              <p className="lf-profile-info-value">{profileData.experience}</p>
            </div>

            <div className="lf-profile-info-item">
              <span className="lf-profile-info-label">
                <i className="bi bi-geo-alt-fill me-1 text-danger"></i> Service Area
              </span>
              <p className="lf-profile-info-value">{profileData.serviceArea}</p>
            </div>

            <div className="lf-profile-info-item lf-profile-info-full">
              <span className="lf-profile-info-label">
                <i className="bi bi-file-text-fill me-1 text-primary"></i> Professional Bio &amp; Scope
              </span>
              <p className="lf-profile-info-value">{profileData.bio}</p>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProviderProfileCard;
