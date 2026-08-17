// ─────────────────────────────────────────────────────────────────────────────
// src/components/ServiceSearch.jsx
//
// WHAT IS THIS COMPONENT?
//   A reusable search bar component for the Find a Service page.
//
// WHAT ARE PROPS?
//   Props (short for properties) allow the parent component (FindService.jsx)
//   to pass data and functions down to this child component:
//     - searchQuery    → the current text in the search input (string)
//     - setSearchQuery → the state updater function to update the text
//
// CONTROLLED INPUT:
//   This is a "controlled component" in React because:
//     value={searchQuery}              → React controls what is displayed
//     onChange={(e) => setSearchQuery(e.target.value)} → React updates the state
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { InputGroup, Form, Button } from "react-bootstrap";

function ServiceSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="lf-service-search-wrapper">
      <InputGroup className="lf-dash-search-group lf-service-search-group">
        {/* Search Icon */}
        <InputGroup.Text className="lf-dash-search-icon">
          <i className="bi bi-search"></i>
        </InputGroup.Text>

        {/* Search Input Box */}
        <Form.Control
          className="lf-dash-search-input"
          type="text"
          placeholder="Search for a service (e.g., Plumbing, AC Repair, leaks, wiring)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Clear Button (Shown only when user has typed something) */}
        {searchQuery && (
          <Button
            variant="light"
            className="lf-search-clear-btn"
            onClick={() => setSearchQuery("")}
            title="Clear search"
          >
            <i className="bi bi-x-lg"></i>
          </Button>
        )}
      </InputGroup>
    </div>
  );
}

export default ServiceSearch;
