// ─────────────────────────────────────────────────────────────────────────────
// src/components/ServiceCards.jsx
//
// WHAT IS THIS COMPONENT?
//   Renders the "Popular Services" section of the dashboard.
//   It displays 6 clickable service cards in a grid.
//
// HOW DATA FLOWS INTO THIS COMPONENT:
//
//   CustomerDashboard.jsx (PARENT)
//         ↓ imports services array from data/services.js
//         ↓ passes it to <ServiceCards> via a prop named "services"
//
//   ServiceCards.jsx (THIS COMPONENT / CHILD)
//         ↓ receives "services" prop
//         ↓ uses services.map() to render one card per service
//
//   This is the PROP PATTERN in React:
//     Parent has data → passes via props → Child renders it
//
// WHY DOES THE PARENT PASS THE DATA?
//   Because the parent (CustomerDashboard) controls the page.
//   The child (ServiceCards) is only responsible for DISPLAYING the data.
//   This separation keeps each component focused on one job.
//
// BOOTSTRAP GRID USED:
//   <Row> → creates a horizontal row
//   <Col xs={6} md={4} lg={2}> → each card takes up:
//     xs=6  → on very small screens: 6/12 = half width (2 per row)
//     md=4  → on medium screens: 4/12 = one-third width (3 per row)
//     lg=2  → on large screens: 2/12 = one-sixth width (6 per row)
//
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// ── The ServiceCards Component ────────────────────────────────────────────
//
// { services } is the PROP this component receives from its parent.
// It is the array of service objects from data/services.js.
//
function ServiceCards({ services }) {
  // useNavigate gives us a function to programmatically change the page
  const navigate = useNavigate();

  return (
    <div>
      {/*
        HOW .map() CREATES MULTIPLE CARDS:

        Imagine services = [
          { id:1, name:"Plumbing", icon:"bi bi-droplet-fill", color:"#2563EB" },
          { id:2, name:"Electrical", ... },
          ...
        ]

        services.map(service => <Col>...</Col>)
        
        This is like saying:
        "For EACH item in the services array, give me back a <Col> element."

        React collects all the returned <Col> elements and renders them together.

        The "key" prop (key={service.id}) is REQUIRED by React.
        React uses it internally to track which item is which, especially when
        the list updates (items add/remove/reorder).
        key must be UNIQUE within the list.
      */}
      <Row className="g-3">
        {services.map((service) => (
          <Col key={service.id} xs={6} sm={4} md={4} lg={4} xl={2}>
            <div
              className="lf-service-pill"
              onClick={() => navigate("/services")}
              title={`Browse ${service.name} professionals`}
            >
              {/* Icon circle with the service's unique color */}
              <div
                className="lf-service-pill-icon"
                style={{ backgroundColor: service.color + "1A", color: service.color }}
              >
                <i className={service.icon}></i>
              </div>
              {/* Service name */}
              <span className="lf-service-pill-name">{service.name}</span>
              {/* Professional count subtitle */}
              <span className="lf-service-pill-sub">{service.professionals}</span>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ServiceCards;
