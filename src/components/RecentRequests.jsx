// ─────────────────────────────────────────────────────────────────────────────
// src/components/RecentRequests.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the "Recent Requests" section of the customer dashboard.
//   Shows a list of service request cards with status badges.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const statusStyles = {
  Pending:     { bg: "warning",   text: "dark",  label: "Pending"     },
  Accepted:    { bg: "success",   text: "white",  label: "Accepted"    },
  "In Progress":{ bg: "primary",  text: "white",  label: "In Progress" },
  "On the Way": { bg: "info",     text: "white",  label: "On the Way"  },
  Completed:   { bg: "success",   text: "white",  label: "Completed"   },
  Cancelled:   { bg: "danger",    text: "white",  label: "Cancelled"   },
};

function getStatusStyle(status) {
  return statusStyles[status] || { bg: "secondary", text: "white", label: status };
}

function RecentRequests({ requests = [] }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-4 text-muted bg-white rounded-3 border">
        <i className="bi bi-inbox fs-3 d-block mb-2 text-primary"></i>
        <p className="mb-2 fw-semibold text-dark">No Service Requests Yet</p>
        <p className="small text-muted mb-3">Book your first home repair in less than a minute.</p>
        <Link to="/request" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-circle me-1"></i> Book a Service
        </Link>
      </div>
    );
  }

  return (
    <div className="lf-recent-requests">
      {requests.map((req) => {
        const reqId = req._id || req.id;
        const style = getStatusStyle(req.status);
        const providerName =
          typeof req.provider === "object" && req.provider !== null
            ? req.provider.name
            : req.provider;

        return (
          <div key={reqId} className="lf-request-card">
            {/* ── REQUEST CARD LAYOUT ─────────────────────────────────── */}
            <div className="lf-request-card-left">
              {/* Service icon circle */}
              <div
                className="lf-request-icon"
                style={{
                  backgroundColor: "#2563EB1A",
                  color: "#2563EB",
                }}
              >
                <i className={req.icon || "bi bi-tools"}></i>
              </div>

              {/* Request details */}
              <div className="lf-request-info">
                <div className="lf-request-title">{req.title}</div>
                <div className="lf-request-meta">
                  <span className="lf-request-category">
                    <i className="bi bi-tag-fill me-1"></i>
                    {req.service || req.category}
                  </span>
                  <span className="lf-request-dot">·</span>
                  <span className="lf-request-date">
                    <i className="bi bi-calendar3 me-1"></i>
                    {req.preferredDate || req.date || "Scheduled"}
                  </span>
                </div>

                {providerName && (
                  <div className="lf-request-provider">
                    <i className="bi bi-person-badge-fill me-1"></i>
                    {providerName}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT SIDE: STATUS + ACTION ─────────────────────────── */}
            <div className="lf-request-card-right">
              <Badge
                bg={style.bg}
                text={style.text}
                className="lf-status-badge"
              >
                {style.label}
              </Badge>

              <Link
                to={`/request/${reqId}`}
                className="lf-view-details-btn"
              >
                View Details <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RecentRequests;
