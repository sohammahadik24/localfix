// ─────────────────────────────────────────────────────────────────────────────
// src/components/RequestSummary.jsx
//
// WHAT IS THIS COMPONENT?
//   The right-side live preview card on the Create Request page.
//   It shows what the customer has typed so far — updating in real time
//   as they fill the form.
//
// WHY DOES THIS COMPONENT ONLY READ DATA, NOT OWN IT?
//   This component receives formData and image as PROPS from the parent.
//   It does NOT have its own useState for form data.
//
//   Why? Because the form data lives in CreateRequest.jsx (the parent).
//   When the user types something in RequestForm, setFormData updates the
//   parent's state. React then re-renders ALL children that received that
//   state as props — including THIS component.
//
//   That is how the live summary works:
//     1. User types in RequestForm
//     2. handleChange calls setFormData (in parent)
//     3. Parent's formData state changes
//     4. Parent re-renders
//     5. RequestSummary gets new formData props → shows updated summary
//
// PROPS RECEIVED:
//   formData → the current form values (service, problem, location, date, time, notes)
//   image    → the selected File object (or null)
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Badge } from "react-bootstrap";
import services from "../data/services";

// ── Helper: format date from YYYY-MM-DD to readable "14 August 2026" ────────
//
// The date input gives us "2026-08-14". We want to display "14 August 2026".
// new Date(dateStr) creates a Date object from that string.
// .toLocaleDateString("en-IN", options) formats it using Indian locale.
//
function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr + "T00:00:00"); // force local time (no timezone shift)
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Helper: format time from "17:00" to "5:00 PM" ───────────────────────────
function formatTime(timeStr) {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

// ── Helper: find icon color for selected service ─────────────────────────────
function getServiceStyle(serviceName) {
  const found = services.find((s) => s.name === serviceName);
  return found ? { icon: found.icon, color: found.color } : null;
}

// ── The RequestSummary Component ──────────────────────────────────────────
//
// This is a PURE DISPLAY component — it only shows data, never mutates it.
// All it does is render the formData props it receives.
//
function RequestSummary({ formData, image }) {
  const serviceStyle = getServiceStyle(formData.service);
  const hasAnyData =
    formData.service ||
    formData.problem ||
    formData.location ||
    formData.date ||
    formData.time;

  return (
    <div className="lf-summary-card">

      {/* ── CARD HEADER ─────────────────────────────────────────────── */}
      <div className="lf-summary-header">
        <div className="lf-summary-header-icon">
          <i className="bi bi-file-earmark-text-fill"></i>
        </div>
        <div>
          <h6 className="lf-summary-title">Your Request</h6>
          <p className="lf-summary-subtitle">Live preview</p>
        </div>
      </div>

      <div className="lf-summary-divider"></div>

      {/* ── EMPTY STATE: shown when nothing is filled yet ─────────────── */}
      {!hasAnyData && (
        <div className="lf-summary-empty">
          <i className="bi bi-pencil-square lf-summary-empty-icon"></i>
          <p>Start filling the form to see your request summary here.</p>
        </div>
      )}

      {/* ── SERVICE ─────────────────────────────────────────────────── */}
      {formData.service && (
        <div className="lf-summary-row">
          <div className="lf-summary-row-label">Service</div>
          <div className="lf-summary-row-value">
            {serviceStyle && (
              <span
                className="lf-summary-service-badge"
                style={{
                  backgroundColor: serviceStyle.color + "18",
                  color: serviceStyle.color,
                }}
              >
                <i className={`${serviceStyle.icon} me-1`}></i>
                {formData.service}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── PROBLEM ─────────────────────────────────────────────────── */}
      {formData.problem && (
        <div className="lf-summary-row">
          <div className="lf-summary-row-label">
            <i className="bi bi-chat-text me-1"></i>
            Problem
          </div>
          <div className="lf-summary-row-value lf-summary-problem">
            {formData.problem.length > 120
              ? formData.problem.substring(0, 120) + "..."
              : formData.problem}
          </div>
        </div>
      )}

      {/* ── LOCATION ────────────────────────────────────────────────── */}
      {formData.location && (
        <div className="lf-summary-row">
          <div className="lf-summary-row-label">
            <i className="bi bi-geo-alt me-1"></i>
            Location
          </div>
          <div className="lf-summary-row-value">{formData.location}</div>
        </div>
      )}

      {/* ── DATE ────────────────────────────────────────────────────── */}
      {formData.date && (
        <div className="lf-summary-row">
          <div className="lf-summary-row-label">
            <i className="bi bi-calendar3 me-1"></i>
            Date
          </div>
          <div className="lf-summary-row-value">{formatDate(formData.date)}</div>
        </div>
      )}

      {/* ── TIME ────────────────────────────────────────────────────── */}
      {formData.time && (
        <div className="lf-summary-row">
          <div className="lf-summary-row-label">
            <i className="bi bi-clock me-1"></i>
            Time
          </div>
          <div className="lf-summary-row-value">{formatTime(formData.time)}</div>
        </div>
      )}

      {/* ── ADDITIONAL NOTES ──────────────────────────────────────────── */}
      {formData.notes && (
        <div className="lf-summary-row">
          <div className="lf-summary-row-label">
            <i className="bi bi-sticky me-1"></i>
            Notes
          </div>
          <div className="lf-summary-row-value lf-summary-notes">
            {formData.notes}
          </div>
        </div>
      )}

      {/* ── IMAGE PREVIEW ─────────────────────────────────────────────── */}
      {(image || hasAnyData) && (
        <>
          <div className="lf-summary-divider"></div>
          <div className="lf-summary-row">
            <div className="lf-summary-row-label">
              <i className="bi bi-image me-1"></i>
              Image
            </div>
            <div className="lf-summary-row-value">
              {image ? (
                <div className="lf-summary-image-wrap">
                  {/*
                    Same URL.createObjectURL trick as in RequestForm.
                    Shows a small thumbnail of the selected image.
                    No upload — just a local browser preview.
                  */}
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Request preview"
                    className="lf-summary-image"
                  />
                  <span className="lf-summary-image-name">{image.name}</span>
                </div>
              ) : (
                <span className="lf-summary-no-image">No image selected</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── STATUS BADGE (always shown once form has content) ─────────── */}
      {hasAnyData && (
        <>
          <div className="lf-summary-divider"></div>
          <div className="lf-summary-status-row">
            <Badge bg="warning" text="dark" className="lf-summary-status-badge">
              <i className="bi bi-hourglass-split me-1"></i>
              Draft — Not Submitted
            </Badge>
          </div>
        </>
      )}

    </div>
  );
}

export default RequestSummary;
