// ─────────────────────────────────────────────────────────────────────────────
// src/components/ServiceTimeline.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the vertical step-by-step Service Status Timeline:
//
//     1. Request Created
//           ↓
//     2. Provider Accepted
//           ↓
//     3. Service In Progress
//           ↓
//     4. Service Completed
//
// PROPS RECEIVED:
//   status   → Current status string ("Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled")
//   timeline → Timeline timestamp details object from request data
//
// VISUAL STATES:
//   - "completed" → Solid green icon with checkmark, solid connector line
//   - "current"   → Glowing primary/pulsing icon, highlighted label, "In Progress" tag
//   - "upcoming"  → Muted grey icon and text, dashed connector line
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

function ServiceTimeline({ status, timeline, statusHistory = [] }) {
  // Step progression index mapping:
  // 0: Request Created
  // 1: Provider Accepted
  // 2: Provider On the Way
  // 3: Service In Progress
  // 4: Service Completed

  const getStepState = (stepIndex) => {
    if (status === "Cancelled") {
      if (stepIndex === 0) return "completed";
      return "inactive";
    }

    switch (status) {
      case "Pending":
        if (stepIndex === 0) return "completed";
        if (stepIndex === 1) return "current";
        return "upcoming";

      case "Accepted":
        if (stepIndex <= 1) return "completed";
        if (stepIndex === 2) return "current";
        return "upcoming";

      case "On the Way":
        if (stepIndex <= 2) return "completed";
        if (stepIndex === 3) return "current";
        return "upcoming";

      case "In Progress":
        if (stepIndex <= 3) return "completed";
        if (stepIndex === 4) return "current";
        return "upcoming";

      case "Completed":
        return "completed";

      default:
        return stepIndex === 0 ? "completed" : "upcoming";
    }
  };

  // Find timestamps from statusHistory array if present
  const findHistoryTime = (st) => {
    const item = statusHistory?.find((h) => h.status === st);
    if (!item) return null;
    const d = new Date(item.changedAt);
    return {
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const steps = [
    {
      id: "created",
      index: 0,
      title: "Request Created",
      subtitle: "Service request submitted and auto-classified.",
      icon: "bi bi-file-earmark-plus-fill",
      timeData: findHistoryTime("Pending") || timeline?.created || { date: "Submitted", time: "" },
    },
    {
      id: "accepted",
      index: 1,
      title: "Provider Accepted",
      subtitle: "A verified service professional accepted your booking.",
      icon: "bi bi-person-check-fill",
      timeData: findHistoryTime("Accepted") || timeline?.accepted,
    },
    {
      id: "onTheWay",
      index: 2,
      title: "Provider On the Way",
      subtitle: "Technician is travelling to your location.",
      icon: "bi bi-truck",
      timeData: findHistoryTime("On the Way") || timeline?.onTheWay,
    },
    {
      id: "inProgress",
      index: 3,
      title: "Service In Progress",
      subtitle: "Professional is actively performing the service.",
      icon: "bi bi-tools",
      timeData: findHistoryTime("In Progress") || timeline?.inProgress,
    },
    {
      id: "completed",
      index: 4,
      title: "Service Completed",
      subtitle: "Work inspected, verified, and service finished.",
      icon: "bi bi-patch-check-fill",
      timeData: findHistoryTime("Completed") || timeline?.completed,
    },
  ];

  return (
    <div className="lf-rd-card lf-timeline-card">
      {/* ── CARD HEADER ───────────────────────────────────────────────── */}
      <div className="lf-rd-card-header">
        <div className="d-flex align-items-center gap-2">
          <div className="lf-rd-card-header-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <h5 className="lf-rd-card-title">Service Status Timeline</h5>
        </div>
        <span className="lf-rd-live-indicator">
          <span className="lf-rd-live-dot"></span>
          Live Tracking
        </span>
      </div>

      {/* ── TIMELINE BODY ──────────────────────────────────────────────── */}
      <div className="lf-rd-card-body">
        {status === "Cancelled" && (
          <div className="lf-rd-cancelled-notice mb-3">
            <i className="bi bi-x-octagon-fill me-2 text-danger"></i>
            <span>This service request was cancelled on {timeline?.cancelled?.date || "recently"}.</span>
          </div>
        )}

        <div className="lf-timeline-list">
          {steps.map((step, idx) => {
            const stepState = getStepState(step.index);
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={step.id}
                className={`lf-timeline-step lf-step-${stepState}`}
              >
                {/* Left Node: Indicator Circle & Connector Line */}
                <div className="lf-timeline-node">
                  <div className={`lf-timeline-circle lf-circle-${stepState}`}>
                    {stepState === "completed" ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <i className={step.icon}></i>
                    )}
                  </div>
                  {!isLast && (
                    <div className={`lf-timeline-line lf-line-${stepState}`} />
                  )}
                </div>

                {/* Right Content: Title, Subtitle, and Timestamp */}
                <div className="lf-timeline-content">
                  <div className="lf-timeline-header-row">
                    <h6 className="lf-timeline-step-title">
                      {step.title}
                      {stepState === "current" && (
                        <span className="lf-step-active-tag">
                          {status === "Pending" ? "Awaiting Acceptance" : "Current Step"}
                        </span>
                      )}
                    </h6>
                    {step.timeData?.date && (
                      <span className="lf-timeline-time">
                        <i className="bi bi-calendar3 me-1"></i>
                        {step.timeData.date} {step.timeData.time && `• ${step.timeData.time}`}
                      </span>
                    )}
                  </div>
                  <p className="lf-timeline-step-desc">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ServiceTimeline;
