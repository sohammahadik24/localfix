// ─────────────────────────────────────────────────────────────────────────────
// src/components/ServiceCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders an individual Service Category card in the "Find a Service" grid.
//
// PROPS RECEIVED:
//   service → A single service object from the services array:
//             {
//               id: 1,
//               name: "Plumbing",
//               description: "Fix leaks, taps, pipes and other plumbing problems.",
//               providers: 24,
//               professionals: "24+ Providers",
//               emoji: "🔧",
//               icon: "bi bi-droplet-fill",
//               color: "#2563EB"
//             }
//
// NAVIGATION:
//   Uses React Router's <Link to="/request"> so clicking "Request Service →"
//   smoothly takes the customer to the Create Service Request form without
//   reloading the web page.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

function ServiceCard({ service }) {
  return (
    <Card className="lf-find-service-card h-100">
      <Card.Body className="d-flex flex-column p-4">
        {/* ── CARD TOP ROW: Service Icon + Available Providers Badge ─────── */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          {/* Icon Circle */}
          <div
            className="lf-find-service-icon"
            style={{
              backgroundColor: service.color + "18",
              color: service.color,
            }}
          >
            {/* Display emoji or Bootstrap Icon */}
            <span className="lf-find-service-emoji me-1">{service.emoji}</span>
          </div>

          {/* Available Providers Badge */}
          <Badge bg="light" text="dark" className="lf-providers-badge">
            <i className="bi bi-people-fill me-1 text-primary"></i>
            {service.professionals || `${service.providers}+ Providers`}
          </Badge>
        </div>

        {/* ── SERVICE NAME ─────────────────────────────────────────────── */}
        <Card.Title as="h5" className="lf-find-service-title mb-2">
          {service.name}
        </Card.Title>

        {/* ── SERVICE SHORT DESCRIPTION ────────────────────────────────── */}
        <Card.Text className="lf-find-service-desc mb-4 flex-grow-1">
          {service.description}
        </Card.Text>

        {/* ── ACTION BUTTON: Navigate to /request ───────────────────────── */}
        <Link
          to="/request"
          className="btn lf-btn-request-service w-100"
          title={`Request ${service.name} service`}
        >
          <span>Request Service</span>
          <i className="bi bi-arrow-right ms-2"></i>
        </Link>
      </Card.Body>
    </Card>
  );
}

export default ServiceCard;
