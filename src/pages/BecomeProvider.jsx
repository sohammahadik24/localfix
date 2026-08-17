// ─────────────────────────────────────────────────────────────────────────────
// src/pages/BecomeProvider.jsx
//
// Dedicated "Become a Provider" landing page explaining provider benefits,
// earnings potential, trade requirements, and direct registration CTAs.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppNavbar from "../components/Navbar";
import Footer from "../components/Footer";

function BecomeProvider() {
  const [selectedTrade, setSelectedTrade] = useState("plumbing");

  const tradeEarnings = {
    plumbing: {
      title: "Plumber",
      avgMonthly: "₹35,000 - ₹65,000",
      jobsPerWeek: "15 - 25 jobs",
      avgJobRate: "₹500 - ₹2,500",
      icon: "bi-droplet-fill",
      color: "#2563EB",
    },
    electrical: {
      title: "Electrician",
      avgMonthly: "₹30,000 - ₹60,000",
      jobsPerWeek: "12 - 20 jobs",
      avgJobRate: "₹450 - ₹2,000",
      icon: "bi-lightning-charge-fill",
      color: "#D97706",
    },
    acrepair: {
      title: "HVAC & AC Technician",
      avgMonthly: "₹40,000 - ₹85,000",
      jobsPerWeek: "15 - 30 jobs",
      avgJobRate: "₹800 - ₹3,500",
      icon: "bi-snow",
      color: "#059669",
    },
    cleaning: {
      title: "Home Cleaning Specialist",
      avgMonthly: "₹25,000 - ₹50,000",
      jobsPerWeek: "10 - 18 jobs",
      avgJobRate: "₹1,000 - ₹3,000",
      icon: "bi-stars",
      color: "#7C3AED",
    },
    carpentry: {
      title: "Carpenter & Woodworker",
      avgMonthly: "₹32,000 - ₹60,000",
      jobsPerWeek: "8 - 15 jobs",
      avgJobRate: "₹600 - ₹3,000",
      icon: "bi-hammer",
      color: "#DC2626",
    },
  };

  const benefits = [
    {
      icon: "bi-cash-coin",
      title: "0% Commission on Initial Jobs",
      desc: "Keep 100% of your earnings for your first 10 completed jobs. Transparent platform fees thereafter.",
      color: "#059669",
    },
    {
      icon: "bi-geo-alt",
      title: "Work in Your Preferred Area",
      desc: "Set your own service radius. Accept requests only in neighborhoods you want to travel to.",
      color: "#2563EB",
    },
    {
      icon: "bi-calendar-check",
      title: "Complete Schedule Flexibility",
      desc: "Turn your availability On/Off with a single click. Work full-time or pick up extra jobs on weekends.",
      color: "#D97706",
    },
    {
      icon: "bi-bank",
      title: "Direct Weekly Bank Payouts",
      desc: "Fast, reliable payments sent directly to your registered bank account every single week.",
      color: "#7C3AED",
    },
    {
      icon: "bi-shield-check",
      title: "Verified Pro Badge",
      desc: "Build trust instantly with customers through our verified background check checkmark on your profile.",
      color: "#2563EB",
    },
    {
      icon: "bi-chat-dots-fill",
      title: "Direct Customer Communication",
      desc: "Call or message clients directly via the app to clarify details before heading to the job location.",
      color: "#059669",
    },
  ];

  const onboardingSteps = [
    {
      step: "1",
      title: "Create Account",
      desc: "Sign up with your basic contact info, service trade, and years of experience.",
    },
    {
      step: "2",
      title: "Upload Documents",
      desc: "Provide government ID proof and optional trade certification for verification.",
    },
    {
      step: "3",
      title: "Set Your Rates & Radius",
      desc: "Define your base visit charges, skills list, and the areas you serve.",
    },
    {
      step: "4",
      title: "Start Receiving Jobs",
      desc: "Get notified when nearby customers request repairs and start earning immediately!",
    },
  ];

  const currentTrade = tradeEarnings[selectedTrade];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AppNavbar />

      {/* ── HERO BANNER ────────────────────────────────────────────── */}
      <section className="bg-white py-5 border-bottom">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-3">
                JOIN OVER 1,000+ SERVICE PARTNERS
              </span>
              <h1 className="display-5 fw-bold text-dark mb-3">
                Grow Your Business & Earn On Your Own Terms
              </h1>
              <p className="lead text-muted mb-4">
                Connect with thousands of local homeowners seeking reliable repair and maintenance professionals.
                No subscription fees, instant job leads, and weekly direct deposits.
              </p>
              <div className="d-flex gap-3 flex-wrap align-items-center">
                <Button
                  as={Link}
                  to="/provider/register"
                  className="btn-getstarted px-4 py-3 fs-6 shadow-sm fw-bold"
                >
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Register as a Provider Now
                </Button>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-secondary"
                  className="px-4 py-3 fs-6 fw-semibold"
                >
                  Already a Partner? Sign In
                </Button>
              </div>
              <div className="d-flex align-items-center gap-4 mt-4 text-muted small">
                <span><i className="bi bi-check-circle-fill text-success me-1"></i> Free Registration</span>
                <span><i className="bi bi-check-circle-fill text-success me-1"></i> Instant Onboarding</span>
                <span><i className="bi bi-check-circle-fill text-success me-1"></i> Weekly Payouts</span>
              </div>
            </Col>

            <Col lg={5}>
              <Card className="border-0 shadow-lg rounded-4 p-4 bg-primary text-white position-relative overflow-hidden">
                <div className="position-absolute top-0 end-0 p-3 opacity-10">
                  <i className="bi bi-trophy-fill" style={{ fontSize: "12rem" }}></i>
                </div>
                <div className="position-relative z-1">
                  <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2 fw-bold mb-3">
                    EARNINGS ESTIMATOR
                  </Badge>
                  <h4 className="fw-bold mb-3">See Your Potential Earnings</h4>

                  <p className="text-white-50 small mb-3">Select your specialty:</p>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {Object.keys(tradeEarnings).map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                          selectedTrade === key
                            ? "btn-light text-primary fw-bold"
                            : "btn-outline-light"
                        }`}
                        onClick={() => setSelectedTrade(key)}
                      >
                        {tradeEarnings[key].title.split(" ")[0]}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white bg-opacity-10 rounded-4 p-3 mb-3 border border-white border-opacity-25">
                    <small className="text-white-50 text-uppercase fw-semibold">Estimated Monthly Income</small>
                    <div className="display-6 fw-bold text-warning">{currentTrade.avgMonthly}</div>
                  </div>

                  <Row className="g-2 text-center small">
                    <Col xs={6}>
                      <div className="bg-white bg-opacity-10 rounded-3 p-2 border border-white border-opacity-10">
                        <div className="text-white-50">Avg. Jobs / Week</div>
                        <strong className="text-white">{currentTrade.jobsPerWeek}</strong>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="bg-white bg-opacity-10 rounded-3 p-2 border border-white border-opacity-10">
                        <div className="text-white-50">Rate / Job</div>
                        <strong className="text-white">{currentTrade.avgJobRate}</strong>
                      </div>
                    </Col>
                  </Row>

                  <Button
                    as={Link}
                    to="/provider/register"
                    variant="light"
                    className="w-100 mt-4 fw-bold py-2 text-primary shadow"
                  >
                    Start Earning as a {currentTrade.title} →
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ── BENEFITS SECTION ───────────────────────────────────────── */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-2">
              WHY PARTNER WITH US
            </span>
            <h2 className="fw-bold text-dark">Built for Service Professionals</h2>
            <p className="text-muted">Everything you need to focus on what you do best.</p>
          </div>

          <Row className="g-4">
            {benefits.map((b, idx) => (
              <Col key={idx} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm rounded-4 p-4 hover-lift">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                    style={{
                      width: "52px",
                      height: "52px",
                      backgroundColor: `${b.color}15`,
                      color: b.color,
                      fontSize: "1.4rem",
                    }}
                  >
                    <i className={`bi ${b.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{b.title}</h5>
                  <p className="text-muted small mb-0">{b.desc}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ── 4-STEP ONBOARDING ──────────────────────────────────────── */}
      <section className="bg-white py-5 border-top border-bottom">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">How to Get Started</h2>
            <p className="text-muted">Four simple steps from sign-up to your first payout.</p>
          </div>

          <Row className="g-4">
            {onboardingSteps.map((step, idx) => (
              <Col key={idx} md={6} lg={3}>
                <div className="p-4 bg-light rounded-4 h-100 text-center border position-relative">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-bold mb-3 shadow-sm"
                    style={{ width: "44px", height: "44px", fontSize: "1.2rem" }}
                  >
                    {step.step}
                  </div>
                  <h5 className="fw-bold text-dark mb-2">{step.title}</h5>
                  <p className="text-muted small mb-0">{step.desc}</p>
                </div>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5">
            <Button
              as={Link}
              to="/provider/register"
              className="btn-getstarted px-5 py-3 fs-6 fw-bold shadow"
            >
              Join LocalFix Today →
            </Button>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default BecomeProvider;
