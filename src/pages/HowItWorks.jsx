// ─────────────────────────────────────────────────────────────────────────────
// src/pages/HowItWorks.jsx
//
// Dedicated "How It Works" page showcasing step-by-step journeys for both
// Customers and Service Providers, trust guarantees, FAQs, and quick CTAs.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Accordion, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";

function HowItWorks() {
  const [activeTab, setActiveTab] = useState("customer");

  const customerSteps = [
    {
      num: "01",
      icon: "bi-search",
      title: "Choose Your Service & Describe the Issue",
      desc: "Browse our verified categories (Plumbing, Electrical, AC Repair, Cleaning, etc.). Specify the problem, preferred time, and location.",
      badge: "Quick Booking",
      color: "#2563EB",
    },
    {
      num: "02",
      icon: "bi-person-check-fill",
      title: "Get Matched with a Verified Professional",
      desc: "Our automated matchmaking connects you with top-rated local experts who are available in your area with transparent upfront rates.",
      badge: "Vetted Pros",
      color: "#059669",
    },
    {
      num: "03",
      icon: "bi-geo-alt-fill",
      title: "Real-Time Tracking & Live Status",
      desc: "Track your technician's arrival, communicate directly via phone or in-app notes, and monitor each milestone in real time.",
      badge: "Live Updates",
      color: "#D97706",
    },
    {
      num: "04",
      icon: "bi-shield-fill-check",
      title: "Job Done & Guaranteed Satisfaction",
      desc: "Review the completed work, confirm satisfaction, and pay securely. Rate and review your professional to help the community.",
      badge: "Quality Guarantee",
      color: "#7C3AED",
    },
  ];

  const providerSteps = [
    {
      num: "01",
      icon: "bi-person-plus-fill",
      title: "Register & Submit Credentials",
      desc: "Sign up in minutes. Complete our simple identity and trade verification process to unlock access to real customer leads.",
      badge: "Free Registration",
      color: "#2563EB",
    },
    {
      num: "02",
      icon: "bi-bell-fill",
      title: "Receive Targeted Job Requests",
      desc: "Get instant notifications for jobs in your service radius matching your skills and schedule availability.",
      badge: "Zero Lead Fees",
      color: "#059669",
    },
    {
      num: "03",
      icon: "bi-tools",
      title: "Deliver Quality Work & Update Status",
      desc: "Perform repairs professionally, update job progress stages on your dashboard, and build a stellar 5-star reputation.",
      badge: "Flexible Schedule",
      color: "#D97706",
    },
    {
      num: "04",
      icon: "bi-cash-stack",
      title: "Receive Prompt Direct Payouts",
      desc: "Enjoy hassle-free weekly payouts deposited directly into your bank account with transparent earnings reports.",
      badge: "Direct Deposits",
      color: "#7C3AED",
    },
  ];

  const trustGuarantees = [
    {
      icon: "bi-patch-check-fill",
      title: "100% Background Checked",
      desc: "Every service professional undergoes thorough ID and skills verification.",
      color: "#2563EB",
    },
    {
      icon: "bi-tag-fill",
      title: "Transparent & Upfront Pricing",
      desc: "No hidden charges or surprise invoices. Fair rates agreed before work starts.",
      color: "#059669",
    },
    {
      icon: "bi-shield-lock-fill",
      title: "Satisfaction Guarantee",
      desc: "If something isn't right, our support team steps in immediately to make it right.",
      color: "#D97706",
    },
    {
      icon: "bi-headset",
      title: "Dedicated Customer Support",
      desc: "24/7 assistance for emergency bookings, scheduling changes, and inquiries.",
      color: "#7C3AED",
    },
  ];

  const faqs = [
    {
      q: "How quickly can a service professional arrive?",
      a: "Depending on your location and urgency, providers are often available for same-day service within 1 to 2 hours of booking.",
    },
    {
      q: "Is there any upfront fee to book a service?",
      a: "No! Browsing services and requesting a pro is completely free. You only pay once the quote is accepted and work is completed.",
    },
    {
      q: "How are service providers vetted?",
      a: "Providers must submit government ID, proof of experience or trade licensing, and pass our platform safety review before accepting jobs.",
    },
    {
      q: "What if I need to reschedule or cancel?",
      a: "You can easily reschedule or cancel your request from your 'My Requests' dashboard before the technician is en route with no penalty.",
    },
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />

      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="bg-white py-5 border-bottom">
        <Container>
          <div className="text-center max-w-700 mx-auto">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-3">
              SIMPLE • TRANSPARENT • RELIABLE
            </span>
            <h1 className="display-5 fw-bold text-dark mb-3">
              How LocalFix Works
            </h1>
            <p className="lead text-muted mb-4">
              Whether you need a quick repair or want to grow your local service business,
              LocalFix makes the entire process effortless from start to finish.
            </p>

            {/* View Mode Switcher */}
            <div className="d-inline-flex p-1 bg-light rounded-pill border shadow-sm">
              <button
                type="button"
                className={`btn rounded-pill px-4 py-2 fw-semibold transition-all ${
                  activeTab === "customer"
                    ? "btn-primary shadow-sm"
                    : "btn-light text-muted border-0"
                }`}
                onClick={() => setActiveTab("customer")}
              >
                <i className="bi bi-person-fill me-2"></i> For Customers
              </button>
              <button
                type="button"
                className={`btn rounded-pill px-4 py-2 fw-semibold transition-all ${
                  activeTab === "provider"
                    ? "btn-primary shadow-sm"
                    : "btn-light text-muted border-0"
                }`}
                onClick={() => setActiveTab("provider")}
              >
                <i className="bi bi-tools me-2"></i> For Service Providers
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ── STEP-BY-STEP WORKFLOW ──────────────────────────────────── */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">
              {activeTab === "customer"
                ? "4 Easy Steps to Get Anything Fixed"
                : "4 Steps to Growing Your Service Business"}
            </h2>
            <p className="text-muted">
              {activeTab === "customer"
                ? "Experience hassle-free home maintenance in minutes"
                : "Join hundreds of professionals earning consistently on LocalFix"}
            </p>
          </div>

          <Row className="g-4">
            {(activeTab === "customer" ? customerSteps : providerSteps).map((step, idx) => (
              <Col key={idx} md={6} lg={3}>
                <Card className="h-100 border-0 shadow-sm rounded-4 p-3 position-relative hover-lift">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className="d-flex align-items-center justify-content-center rounded-3 fw-bold"
                      style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: `${step.color}15`,
                        color: step.color,
                        fontSize: "1.2rem",
                      }}
                    >
                      <i className={`bi ${step.icon}`}></i>
                    </span>
                    <Badge
                      bg="light"
                      className="text-muted border rounded-pill px-3 py-1 fw-bold font-monospace"
                    >
                      STEP {step.num}
                    </Badge>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{step.title}</h5>
                  <p className="text-muted small mb-3 flex-grow-1">{step.desc}</p>

                  <div className="mt-auto pt-2 border-top">
                    <span className="badge bg-light text-primary border rounded-pill">
                      {step.badge}
                    </span>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Quick CTA Box */}
          <div className="text-center mt-5">
            {activeTab === "customer" ? (
              <Button as={Link} to="/services" className="btn-getstarted px-4 py-2 fs-6 shadow">
                Browse Services & Book a Pro →
              </Button>
            ) : (
              <Button as={Link} to="/become-a-provider" className="btn-getstarted px-4 py-2 fs-6 shadow">
                Become a Partner & Start Earning →
              </Button>
            )}
          </div>
        </Container>
      </section>

      {/* ── TRUST & SAFETY GUARANTEES ──────────────────────────────── */}
      <section className="bg-white py-5 border-top border-bottom">
        <Container>
          <div className="text-center mb-5">
            <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill mb-2">
              PEACE OF MIND GUARANTEED
            </span>
            <h2 className="fw-bold text-dark">Why You Can Trust LocalFix</h2>
            <p className="text-muted">Built from the ground up for safety, reliability, and speed.</p>
          </div>

          <Row className="g-4">
            {trustGuarantees.map((item, idx) => (
              <Col key={idx} md={6} lg={3}>
                <div className="p-4 bg-light rounded-4 h-100 text-center border">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      fontSize: "1.5rem",
                    }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── FAQ ACCORDION ─────────────────────────────────────────── */}
      <section className="py-5">
        <Container style={{ maxWidth: "850px" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Frequently Asked Questions</h2>
            <p className="text-muted">Have questions? We've got answers.</p>
          </div>

          <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden">
            {faqs.map((faq, idx) => (
              <Accordion.Item eventKey={String(idx)} key={idx} className="border-0 border-bottom">
                <Accordion.Header className="fw-semibold text-dark">
                  {faq.q}
                </Accordion.Header>
                <Accordion.Body className="text-muted">
                  {faq.a}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <div className="text-center mt-4">
            <p className="text-muted small">
              Still have questions? Visit our{" "}
              <Link to="/help" className="text-primary fw-bold text-decoration-none">
                Help & Support Center →
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* ── BOTTOM CTA BANNER ──────────────────────────────────────── */}
      <section className="py-5 bg-primary text-white text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to Experience Easy Local Repairs?</h2>
          <p className="lead text-white-50 mb-4 max-w-600 mx-auto">
            Join thousands of happy homeowners and certified professionals across the city.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button as={Link} to="/services" variant="light" className="fw-bold px-4 py-2 text-primary shadow">
              Find a Service
            </Button>
            <Button as={Link} to="/provider/register" variant="outline-light" className="fw-bold px-4 py-2">
              Join as a Professional
            </Button>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default HowItWorks;
