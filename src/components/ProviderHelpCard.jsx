// ─────────────────────────────────────────────────────────────────────────────
// src/components/ProviderHelpCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the 3 Quick Help Cards on the Provider Help & Support page:
//     1. 💼 Jobs & Requests → Manage customer requests and active jobs
//     2. 👤 Profile         → Update professional information & service categories
//     3. 💬 Contact Support → Reach out to LocalFix support desk / Report problem
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function ProviderHelpCard({ onContactSupport }) {
  return (
    <div className="lf-quick-help-section mb-5">
      <Row className="g-4">
        {/* ── CARD 1: Jobs & Requests ──────────────────────────────────── */}
        <Col md={4}>
          <Card className="lf-help-quick-card h-100">
            <Card.Body className="d-flex flex-column text-center p-4">
              <div className="lf-help-icon-wrap bg-primary-subtle text-primary mx-auto mb-3">
                <i className="bi bi-briefcase-fill fs-3"></i>
              </div>
              <Card.Title as="h5" className="fw-bold mb-2">
                Jobs & Requests
              </Card.Title>
              <Card.Text className="text-muted small flex-grow-1 mb-3">
                Manage incoming customer requests, start jobs, and update service progress.
              </Card.Text>
              <Link to="/provider/jobs" className="btn btn-outline-primary lf-help-btn w-100">
                <span>View Jobs</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* ── CARD 2: Provider Profile ─────────────────────────────────── */}
        <Col md={4}>
          <Card className="lf-help-quick-card h-100">
            <Card.Body className="d-flex flex-column text-center p-4">
              <div className="lf-help-icon-wrap bg-info-subtle text-info mx-auto mb-3">
                <i className="bi bi-person-badge-fill fs-3"></i>
              </div>
              <Card.Title as="h5" className="fw-bold mb-2">
                Provider Profile
              </Card.Title>
              <Card.Text className="text-muted small flex-grow-1 mb-3">
                Update your professional credentials, experience, bio, and service locations.
              </Card.Text>
              <Link to="/provider/profile" className="btn btn-outline-info lf-help-btn w-100">
                <span>Edit Profile</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* ── CARD 3: Contact Support ──────────────────────────────────── */}
        <Col md={4}>
          <Card className="lf-help-quick-card h-100">
            <Card.Body className="d-flex flex-column text-center p-4">
              <div className="lf-help-icon-wrap bg-warning-subtle text-warning mx-auto mb-3">
                <i className="bi bi-headset fs-3 text-dark"></i>
              </div>
              <Card.Title as="h5" className="fw-bold mb-2">
                Contact Support
              </Card.Title>
              <Card.Text className="text-muted small flex-grow-1 mb-3">
                Need help with payments, account settings, or a customer dispute?
              </Card.Text>
              <Button
                variant="outline-dark"
                className="lf-help-btn w-100"
                onClick={onContactSupport}
              >
                <span>Report an Issue</span>
                <i className="bi bi-flag-fill ms-2"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ProviderHelpCard;
