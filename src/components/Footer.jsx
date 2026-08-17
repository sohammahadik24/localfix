// ─────────────────────────────────────────────────────────────────────────────
// src/components/Footer.jsx
//
// WHY A SEPARATE FILE?
//   Like the Navbar, the Footer will appear on every page. Keeping it separate
//   means one change updates it everywhere.
//
// REACT-BOOTSTRAP COMPONENTS:
//   Container  - centers content
//   Row        - horizontal layout
//   Col        - column within the row (for the 4 footer columns)
//
// REACT ROUTER:
//   Link - internal navigation without page reload
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="lf-footer">
      <Container>
        <Row className="g-4">

          {/* ── Column 1: Brand ─────────────────────────────────────────── */}
          {/*
            Col lg={3}: On large screens, this takes 3 of 12 columns (25% width).
            On small/medium screens, Bootstrap makes it 100% (stacks vertically).
          */}
          <Col xs={12} lg={3}>
            <p className="brand-name">
              <i className="bi bi-tools me-2"></i>
              LocalFix
            </p>
            <p className="brand-tagline">Local services, made simple.</p>
          </Col>

          {/* ── Column 2: Services ──────────────────────────────────────── */}
          <Col xs={6} lg={3}>
            {/* sm={6}: on small screens, two columns side by side (6/12 = 50%) */}
            <h6>Services</h6>
            <ul>
              {/*
                Each <Link> here is a React Router Link.
                For now they all go to /services (we'll add individual pages later).
                Using "to" instead of "href" is the React Router way.
              */}
              <li><Link to="/services">Plumbing</Link></li>
              <li><Link to="/services">Electrical</Link></li>
              <li><Link to="/services">AC Repair</Link></li>
              <li><Link to="/services">Cleaning</Link></li>
              <li><Link to="/services">Carpentry</Link></li>
              <li><Link to="/services">Appliance Repair</Link></li>
            </ul>
          </Col>

          {/* ── Column 3: Company ───────────────────────────────────────── */}
          <Col xs={6} lg={3}>
            <h6>Company</h6>
            <ul>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/become-a-provider">Become a Provider</Link></li>
              <li><Link to="/services">All Services</Link></li>
              <li><Link to="/help">Contact & Support</Link></li>
            </ul>
          </Col>

          {/* ── Column 4: Support ───────────────────────────────────────── */}
          <Col xs={6} lg={3}>
            <h6>Support</h6>
            <ul>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/help">Frequently Asked Questions</Link></li>
              <li><Link to="/help#report-form">Report an Issue</Link></li>
            </ul>
          </Col>

        </Row>

        {/* ── Bottom bar ──────────────────────────────────────────────────── */}
        {/*
          The bottom bar sits below all four columns.
          "text-center" centers the copyright text.
        */}
        <div className="lf-footer-bottom text-center">
          <p>© 2026 LocalFix. All rights reserved.</p>
        </div>

      </Container>
    </footer>
  );
}

export default Footer;
