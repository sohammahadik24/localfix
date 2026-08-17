// ─────────────────────────────────────────────────────────────────────────────
// src/components/RequestCard.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders a single service request card on the My Requests page.
//
// PROPS RECEIVED:
//   request → An individual request object from the requests array:
//             {
//               id: 1,
//               title: "Kitchen Tap Repair",
//               service: "Plumbing",
//               description: "Kitchen tap is leaking...",
//               date: "Aug 15, 2026",
//               time: "5:00 PM",
//               location: "Mumbai",
//               provider: "Raj Plumbing Services",
//               status: "Accepted",
//               icon: "bi bi-droplet-fill",
//               iconColor: "#2563EB"
//             }
//
// STATUS BADGES & STYLING:
//   Pending     → Orange/Yellow (Awaiting provider matching)
//   Accepted    → Green (Provider confirmed)
//   In Progress → Blue (Service currently being delivered)
//   Completed   → Teal/Green (Job finished)
//   Cancelled   → Red (Cancelled)
//
// ROUTING WITH TEMPLATE LITERALS:
//   <Link to={`/requests/${request.id}`}>
//   Backtick syntax `${...}` embeds the request ID into the URL path dynamically.
//   Example: If request.id is 1, this creates the link "/requests/1".
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

// ── Status Style Helper ───────────────────────────────────────────────────
// Maps status names to Bootstrap badge variants and icons
const statusConfig = {
  Pending: {
    bg: "warning",
    text: "dark",
    label: "Pending",
    icon: "bi bi-hourglass-split",
  },
  Accepted: {
    bg: "success",
    text: "white",
    label: "Accepted",
    icon: "bi bi-check-circle-fill",
  },
  "In Progress": {
    bg: "primary",
    text: "white",
    label: "In Progress",
    icon: "bi bi-arrow-repeat",
  },
  "On the Way": {
    bg: "info",
    text: "white",
    label: "On the Way",
    icon: "bi bi-truck",
  },
  Completed: {
    bg: "success",
    text: "white",
    label: "Completed",
    icon: "bi bi-patch-check-fill",
  },
  Cancelled: {
    bg: "danger",
    text: "white",
    label: "Cancelled",
    icon: "bi bi-x-circle-fill",
  },
};

function getStatusStyle(status) {
  return (
    statusConfig[status] || {
      bg: "secondary",
      text: "white",
      label: status,
      icon: "bi bi-info-circle",
    }
  );
}

function RequestCard({ request }) {
  const reqId = request._id || request.id;
  const statusInfo = getStatusStyle(request.status);
  const providerName =
    typeof request.provider === "object" && request.provider !== null
      ? request.provider.name
      : request.provider;

  // Icon calculation based on category if not explicitly set
  const getCategoryIcon = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("plumb")) return { icon: "bi bi-droplet-fill", color: "#2563EB" };
    if (cat.includes("electr")) return { icon: "bi bi-lightning-charge-fill", color: "#EAB308" };
    if (cat.includes("ac") || cat.includes("cool") || cat.includes("hvac")) return { icon: "bi bi-snow", color: "#06B6D4" };
    if (cat.includes("carpent") || cat.includes("wood")) return { icon: "bi bi-hammer", color: "#D97706" };
    if (cat.includes("clean")) return { icon: "bi bi-stars", color: "#10B981" };
    if (cat.includes("paint")) return { icon: "bi bi-palette-fill", color: "#EC4899" };
    if (cat.includes("appliance")) return { icon: "bi bi-tv-fill", color: "#8B5CF6" };
    return { icon: "bi bi-tools", color: "#6366F1" };
  };

  const iconInfo = request.icon
    ? { icon: request.icon, color: request.iconColor || "#2563EB" }
    : getCategoryIcon(request.service || request.category);

  return (
    <div className="lf-my-request-card">
      {/* ── CARD TOP ROW: Icon + Title + Category + Status Badge ───────── */}
      <div className="lf-my-request-top">
        <div className="lf-my-request-heading-wrap">
          {/* Service Icon */}
          <div
            className="lf-my-request-icon"
            style={{
              backgroundColor: iconInfo.color + "18",
              color: iconInfo.color,
            }}
          >
            <i className={iconInfo.icon}></i>
          </div>

          {/* Title & Service Category */}
          <div>
            <h6 className="lf-my-request-title">{request.title}</h6>
            <div className="d-flex align-items-center gap-2">
              <span className="lf-my-request-category">
                <i className="bi bi-tag-fill me-1"></i>
                {request.service || request.category}
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

        {/* Status Badge */}
        <Badge
          bg={statusInfo.bg}
          text={statusInfo.text}
          className="lf-my-request-status-badge"
        >
          <i className={`${statusInfo.icon} me-1`}></i>
          {statusInfo.label}
        </Badge>
      </div>

      {/* ── PROBLEM DESCRIPTION ────────────────────────────────────────── */}
      <p className="lf-my-request-desc">{request.description}</p>

      <div className="lf-my-request-divider"></div>

      {/* ── CARD BOTTOM ROW: Meta details (Date, Time, Location, Provider) + Action Button ── */}
      <div className="lf-my-request-bottom">
        <div className="lf-my-request-meta-grid">
          {/* Date & Time */}
          <div className="lf-my-request-meta-item">
            <i className="bi bi-calendar3 lf-my-request-meta-icon"></i>
            <span>
              <strong>{request.preferredDate || request.date || "Flexible"}</strong>
              {request.preferredTime || request.time ? ` at ${request.preferredTime || request.time}` : ""}
            </span>
          </div>

          {/* Location */}
          <div className="lf-my-request-meta-item">
            <i className="bi bi-geo-alt-fill lf-my-request-meta-icon"></i>
            <span className="lf-my-request-location-text" title={request.location}>
              {request.location}
            </span>
          </div>

          {/* Assigned Provider */}
          <div className="lf-my-request-meta-item">
            <i className="bi bi-person-badge-fill lf-my-request-meta-icon"></i>
            <span>
              Provider:{" "}
              {providerName ? (
                <strong className="text-dark">{providerName}</strong>
              ) : (
                <span className="text-muted fst-italic">Awaiting provider assignment</span>
              )}
            </span>
          </div>
        </div>

        {/* View Details Action Link */}
        <div className="lf-my-request-action-wrap">
          <Link
            to={`/request/${reqId}`}
            className="lf-my-request-details-btn"
          >
            View Details <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RequestCard;
