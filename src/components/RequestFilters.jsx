// ─────────────────────────────────────────────────────────────────────────────
// src/components/RequestFilters.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the horizontal row of status filter buttons on the My Requests page:
//   [ All ] [ Pending ] [ Accepted ] [ In Progress ] [ Completed ] [ Cancelled ]
//
// HOW DATA FLOWS (Props):
//
//   MyRequests.jsx (PARENT)
//         │
//         │ activeFilter, setActiveFilter (passed as props)
//         ▼
//   RequestFilters.jsx (CHILD)
//
//   1. activeFilter    → string representing the currently selected filter ("All", "Pending", etc.)
//   2. setActiveFilter → updater function to change the selected filter in the parent
//   3. counts          → optional object showing how many requests belong to each status
//
// HOW .map() WORKS HERE:
//   Instead of hardcoding 6 separate <button> elements in JSX,
//   we define a simple array: ["All", "Pending", "Accepted", "In Progress", "Completed", "Cancelled"]
//   and use .map() to loop through the array and render each button automatically.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

// List of all filter options
const filterOptions = [
  "All",
  "Pending",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
];

function RequestFilters({ activeFilter, setActiveFilter, counts }) {
  return (
    <div className="lf-filter-bar">
      {/*
        filterOptions.map(filter => ...)
        Loops through each filter string and returns a button element.
      */}
      {filterOptions.map((filter) => {
        // Check if this button is currently active
        const isActive = activeFilter === filter;

        // Get the count for this specific filter (if counts object is provided)
        const count = counts ? counts[filter] : null;

        return (
          <button
            key={filter}
            type="button"
            className={`lf-filter-btn ${isActive ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            <span>{filter}</span>
            {count !== null && count !== undefined && (
              <span className={`lf-filter-count-badge ${isActive ? "active" : ""}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default RequestFilters;
