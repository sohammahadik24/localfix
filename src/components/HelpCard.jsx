// ─────────────────────────────────────────────────────────────────────────────
// src/components/HelpCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the 3 Quick Help Cards on the Help & Support page:
//     1. 📋 My Requests     → Track active & completed requests
//     2. 👨‍🔧 Contact Provider → Get help with an ongoing service
//     3. 💬 Contact Support  → Reach out to customer care / Report a Problem
//
// PROPS RECEIVED:
//   onContactSupport → Callback function to smoothly scroll to the Report a Problem form
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Row, Col, Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function HelpCard({ onContactSupport }) {
  const [showProviderModal, setShowProviderModal] = useState(false);

  return (
    <div className="lf-quick-help-section mb-5">
      <Row className="g-4">
        {/* ── CARD 1: My Requests ──────────────────────────────────────── */}
        <Col md={4}>
          <Card className="lf-help-quick-card h-100">
            <Card.Body className="d-flex flex-column text-center p-4">
              <div className="lf-help-icon-wrap bg-primary-subtle text-primary mx-auto mb-3">
                <i className="bi bi-clipboard-check-fill fs-3"></i>
              </div>
              <Card.Title as="h5" className="fw-bold mb-2">
                My Requests
              </Card.Title>
              <Card.Text className="text-muted small flex-grow-1 mb-3">
                Track your active, pending, and completed service requests in real time.
              </Card.Text>
              <Link to="/requests" className="btn btn-outline-primary lf-help-btn w-100">
                <span>View My Requests</span>
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        {/* ── CARD 2: Contact Provider ─────────────────────────────────── */}
        <Col md={4}>
          <Card className="lf-help-quick-card h-100">
            <Card.Body className="d-flex flex-column text-center p-4">
              <div className="lf-help-icon-wrap bg-success-subtle text-success mx-auto mb-3">
                <i className="bi bi-person-badge-fill fs-3"></i>
              </div>
              <Card.Title as="h5" className="fw-bold mb-2">
                Contact Provider
              </Card.Title>
              <Card.Text className="text-muted small flex-grow-1 mb-3">
                Need to reach your assigned professional about arrival time or details?
              </Card.Text>
              <Button
                variant="outline-success"
                className="lf-help-btn w-100"
                onClick={() => setShowProviderModal(true)}
              >
                <span>Provider Assistance</span>
                <i className="bi bi-telephone-fill ms-2"></i>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* ── CARD 3: Contact Support ──────────────────────────────────── */}
        <Col md={4}>
          <Card className="lf-help-quick-card h-100">
            <Card.Body className="d-flex flex-column text-center p-4">
              <div className="lf-help-icon-wrap bg-warning-subtle text-warning mx-auto mb-3">
                <i className="bi bi-chat-dots-fill fs-3 text-dark"></i>
              </div>
              <Card.Title as="h5" className="fw-bold mb-2">
                Contact Support
              </Card.Title>
              <Card.Text className="text-muted small flex-grow-1 mb-3">
                Need additional help? Report an issue directly to the LocalFix team.
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

      {/* ── PROVIDER ASSISTANCE MODAL ─────────────────────────────────── */}
      <Modal show={showProviderModal} onHide={() => setShowProviderModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">
            <i className="bi bi-person-badge me-2 text-success"></i> Contact Your Provider
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-muted small mb-3">
            To call or message your assigned provider, please open the specific active booking from your requests list:
          </p>
          <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mb-3">
            <div>
              <strong className="d-block text-dark">Active Bookings</strong>
              <small className="text-muted">Direct phone numbers are visible on Accepted requests</small>
            </div>
            <Link to="/requests" className="btn btn-sm btn-primary">
              Go to Requests
            </Link>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowProviderModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HelpCard;
