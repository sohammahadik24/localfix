// ─────────────────────────────────────────────────────────────────────────────
// src/components/WhyChooseAndCTA.jsx
//
// WHY ONE FILE FOR TWO SECTIONS?
//   "Why Choose LocalFix" and the "CTA" (Call to Action) are both persuasion
//   sections. They appear back-to-back on the homepage. Grouping them keeps
//   Home.jsx clean.
//
// WHAT IS A CTA?
//   CTA = Call To Action. A section specifically designed to get the user
//   to DO something — in our case, click "Create a Request".
//
// REACT-BOOTSTRAP COMPONENTS:
//   Container, Row, Col, Button
//
// REACT ROUTER:
//   useNavigate  - programmatically navigate to another route
//   OR we can use <Link> directly inside the Button using "as={Link}"
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

// ─── Features data ───────────────────────────────────────────────────────────
// Each feature has an icon, title, and short description.
// We define this data here (not in a separate file) because it's only used
// in this one component.
const features = [
  {
    id: 1,
    icon: "bi bi-shield-fill-check",
    title: "Verified Providers",
    desc: "All professionals are background-checked and verified before joining.",
  },
  {
    id: 2,
    icon: "bi bi-calendar-check-fill",
    title: "Easy Booking",
    desc: "Book services in just a few clicks — no phone calls needed.",
  },
  {
    id: 3,
    icon: "bi bi-geo-alt-fill",
    title: "Local Professionals",
    desc: "Experts from your neighbourhood who know your area.",
  },
  {
    id: 4,
    icon: "bi bi-star-fill",
    title: "Customer Reviews",
    desc: "Real reviews from real customers to help you choose confidently.",
  },
  {
    id: 5,
    icon: "bi bi-activity",
    title: "Request Tracking",
    desc: "Stay updated on your service request from start to finish.",
  },
  {
    id: 6,
    icon: "bi bi-lock-fill",
    title: "Secure Platform",
    desc: "Your data and privacy are always protected on LocalFix.",
  },
];

function WhyChooseAndCTA() {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — WHY CHOOSE LOCALFIX
      ════════════════════════════════════════════════════════════════════ */}
      <section className="lf-why section-pad">
        <Container>

          <div className="text-center mb-5">
            <h2 className="lf-section-heading">Why people choose LocalFix</h2>
            <p className="lf-section-sub">
              We've built LocalFix around what customers actually care about
            </p>
          </div>

          {/*
            Row with g-4: 6 feature cards in a 3-column grid on desktop,
            2-column on tablet, 1-column on mobile.
            
            Col xs={12} md={6} lg={4}:
            - xs={12} = mobile: full width (1 card per row)
            - md={6}  = tablet: half width (2 cards per row)
            - lg={4}  = desktop: one-third width (3 cards per row)
          */}
          <Row className="g-4">
            {features.map((feature) => (
              <Col key={feature.id} xs={12} md={6} lg={4}>
                <div className="lf-feature-card">

                  {/* Icon square with blue background */}
                  <div className="lf-feature-icon">
                    <i className={feature.icon}></i>
                  </div>

                  <h6>{feature.title}</h6>
                  <p>{feature.desc}</p>

                </div>
              </Col>
            ))}
          </Row>

        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — CTA (Call To Action)
      ════════════════════════════════════════════════════════════════════ */}
      <section className="lf-cta">
        <Container>
          {/*
            text-center = center all text
            We use a simple centered layout: heading, subtext, button.
          */}
          <div className="text-center">

            <h2>Something needs fixing?</h2>
            <p>Find the right local professional today.</p>

            {/*
              Button with as={Link} to="/request":
              This makes the button act as a React Router Link.
              Clicking it navigates to /request without a page reload.
              We haven't built that page yet, but the route is wired up.
            */}
            <Button
              className="btn-cta"
              as={Link}
              to="/request"
              id="cta-request-btn"
            >
              Create a Request →
            </Button>

          </div>
        </Container>
      </section>
    </>
  );
}

export default WhyChooseAndCTA;
