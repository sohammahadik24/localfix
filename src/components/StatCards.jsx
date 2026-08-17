// ─────────────────────────────────────────────────────────────────────────────
// src/components/StatCards.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the "Overview" KPI (Key Performance Indicator) row.
//   Shows 4 summary cards: Active, Pending, Completed, Total.
//
// WHERE DOES THE DATA COME FROM?
//   The stats are stored INSIDE this file as a plain JavaScript array.
//   For now these numbers are STATIC (hardcoded).
//
//   In the future, when we connect the backend:
//     1. CustomerDashboard will fetch stats from the Express API.
//     2. It will pass the numbers down as PROPS to this component.
//     3. We'll update { stats } to receive props instead of using local data.
//
// WHY DEFINE stats AS AN ARRAY INSIDE THE COMPONENT?
//   For now, the data doesn't change, so it's fine to define it right here.
//   We still use .map() to render, which is the correct pattern for lists.
//
// HOW TO READ THE stats ARRAY:
//   Each object represents one KPI card:
//     {
//       id: 1,
//       label: "Active Requests",    ← big bold number label
//       count: 2,                     ← the number shown prominently
//       sub: "Currently Active",      ← subtitle below the number
//       icon: "bi bi-clock-fill",     ← Bootstrap Icon class
//       accent: "#2563EB",            ← color for the icon background
//       iconColor: "#2563EB",         ← color for the icon itself
//     }
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Row, Col } from "react-bootstrap";

// ── Static KPI Data (will later come from API) ─────────────────────────────
const stats = [
  {
    id: 1,
    label: "Active Requests",
    count: 2,
    sub: "Currently Active",
    icon: "bi bi-clock-fill",
    accent: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    id: 2,
    label: "Pending Requests",
    count: 1,
    sub: "Awaiting Provider",
    icon: "bi bi-hourglass-split",
    accent: "#FFFBEB",
    iconColor: "#D97706",
  },
  {
    id: 3,
    label: "Completed Jobs",
    count: 5,
    sub: "Successfully Done",
    icon: "bi bi-check-circle-fill",
    accent: "#F0FDF4",
    iconColor: "#16A34A",
  },
  {
    id: 4,
    label: "Total Requests",
    count: 8,
    sub: "All Time",
    icon: "bi bi-bar-chart-fill",
    accent: "#F5F3FF",
    iconColor: "#7C3AED",
  },
];

// ── The StatCards Component ───────────────────────────────────────────────
//
// This component takes NO PROPS for now. It uses the local stats array above.
// When we connect the backend, we will add: function StatCards({ stats }) { ... }
//
function StatCards() {
  return (
    /*
      BOOTSTRAP GRID EXPLAINED:

      <Row> creates a horizontal row. Bootstrap divides each row into 12 columns.

      <Col md={3}> means: take up 3 out of 12 columns on medium+ screens.
        3 × 4 columns = 12 total → exactly 4 cards fit in one row!

      xs={12} → on tiny mobile screens, each card takes the full width (stacked)
      sm={6}  → on small screens, 2 cards per row
      md={3}  → on medium+ screens, 4 cards per row

      g-3 → "gap-3" adds spacing between columns (Bootstrap gutter class)
    */
    <Row className="g-3">
      {stats.map((stat) => (
        <Col key={stat.id} xs={12} sm={6} md={3}>
          <div className="lf-stat-card">

            {/* Icon section */}
            <div
              className="lf-stat-icon-wrap"
              style={{ backgroundColor: stat.accent }}
            >
              <i
                className={stat.icon}
                style={{ color: stat.iconColor }}
              ></i>
            </div>

            {/* Number */}
            <div className="lf-stat-count">{stat.count}</div>

            {/* Label + sub */}
            <div className="lf-stat-label">{stat.label}</div>
            <div className="lf-stat-sub">{stat.sub}</div>

          </div>
        </Col>
      ))}
    </Row>
  );
}

export default StatCards;
