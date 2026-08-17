// ─────────────────────────────────────────────────────────────────────────────
// src/components/Hero.jsx
//
// Animated Hero component:
// - Automatic image slideshow cycling every 3.5s with React useState + useEffect.
// - Dynamic verified provider card updating with each image.
// - Smooth fade-in/fade-out transitions & slide indicators.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const popularSearches = ["Plumbing", "AC Repair", "Electrician", "Cleaning"];

// Slideshow data array containing images and matching provider info
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    providerName: "Raj Sharma",
    specialty: "Plumbing Specialist",
    rating: "4.9",
    reviews: "320 reviews",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80",
    providerName: "Vikram Verma",
    specialty: "Electrician Expert",
    rating: "4.8",
    reviews: "245 reviews",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    providerName: "Ankit Patel",
    specialty: "AC Repair Specialist",
    rating: "4.9",
    reviews: "410 reviews",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    providerName: "Priya Sharma",
    specialty: "Home Cleaning Pro",
    rating: "4.8",
    reviews: "190 reviews",
  },
];

function Hero() {
  // State to track current active image index (0, 1, 2, 3)
  const [currentIndex, setCurrentIndex] = useState(0);

  // State to trigger smooth CSS fade animation
  const [fade, setFade] = useState(true);

  // useEffect runs when the component mounts to start the image rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      // Step 1: Start fade out
      setFade(false);

      // Step 2: Swap slide after 300ms, then fade back in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        setFade(true);
      }, 300);
    }, 3500); // rotates every 3.5 seconds

    // Clean up timer on unmount
    return () => clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[currentIndex];

  return (
    <section className="lf-hero">
      <Container>
        <Row className="align-items-center g-5">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <Col lg={6} md={12}>

            {/* Pill Badge */}
            <div className="lf-hero-badge mb-3">
              Trusted. Verified. Local.
            </div>

            {/* Main Headline */}
            <h1 className="lf-hero-title mb-3">
              Get local help.<br />
              Get it <span>fixed.</span>
            </h1>

            {/* Supporting Text */}
            <p className="lf-hero-sub mb-4">
              Find trusted professionals for repairs, maintenance,
              and everyday services near you.
            </p>

            {/* ── Wide Search Card ─────────────────────────────────────── */}
            <div className="lf-search-bar-card mb-4">
              <Row className="g-2 align-items-center">
                {/* Service input */}
                <Col md={5} sm={12}>
                  <div className="lf-input-group">
                    <label className="lf-input-label">What service do you need?</label>
                    <div className="position-relative">
                      <Form.Control
                        type="text"
                        placeholder="Plumbing, AC repair, electrical..."
                        className="lf-search-input"
                        id="hero-service-input"
                      />
                      <i className="bi bi-search lf-input-icon"></i>
                    </div>
                  </div>
                </Col>

                {/* Divider on desktop */}
                <div className="d-none d-md-block col-md-auto px-0">
                  <div className="lf-input-divider"></div>
                </div>

                {/* Location input */}
                <Col md={4} sm={12}>
                  <div className="lf-input-group">
                    <label className="lf-input-label">Your location</label>
                    <div className="position-relative">
                      <Form.Select className="lf-search-input lf-select" id="hero-location-input">
                        <option value="mumbai">📍 Mumbai, Maharashtra</option>
                        <option value="delhi">📍 Delhi, NCR</option>
                        <option value="bangalore">📍 Bengaluru, Karnataka</option>
                        <option value="pune">📍 Pune, Maharashtra</option>
                      </Form.Select>
                    </div>
                  </div>
                </Col>

                {/* Submit button */}
                <Col md={3} sm={12}>
                  <Button className="btn-find-pro w-100" id="hero-find-btn">
                    Find a Professional
                  </Button>
                </Col>
              </Row>

              {/* Popular Searches Pills */}
              <div className="lf-popular-searches mt-3 pt-2 border-top">
                <span className="popular-label">Popular searches:</span>
                <div className="popular-pills">
                  {popularSearches.map((item, idx) => (
                    <span key={idx} className="popular-pill">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bottom Trust / Rating Bar ─────────────────────────────── */}
            <div className="lf-hero-trust-bar d-flex align-items-center gap-4 flex-wrap">
              {/* Customer avatars stack */}
              <div className="d-flex align-items-center gap-2">
                <div className="lf-avatar-stack">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Customer 1" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Customer 2" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Customer 3" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="Customer 4" />
                </div>
                <div>
                  <div className="fw-bold text-dark fs-6 lh-1">2,000+</div>
                  <div className="text-muted small">Happy customers</div>
                </div>
              </div>

              <div className="lf-trust-divider"></div>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2">
                <div className="text-warning fs-5">★</div>
                <div>
                  <div className="fw-bold text-dark fs-6 lh-1">4.8/5</div>
                  <div className="text-muted small">Average rating</div>
                </div>
              </div>
            </div>

          </Col>

          {/* ── RIGHT COLUMN: ANIMATED HERO IMAGE & OVERLAYS ───────────── */}
          <Col lg={6} md={12}>
            <div className="lf-hero-media-wrap">
              {/* Animated Slideshow Image */}
              <img
                src={currentSlide.image}
                alt={currentSlide.providerName}
                className={`lf-hero-img ${fade ? "fade-in" : "fade-out"}`}
              />

              {/* Top Right Floating Rating Badge */}
              <div className="lf-floating-badge top-badge">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-4 text-warning">★</span>
                  <div>
                    <div className="fw-extrabold fs-5 lh-1 text-dark">4.8</div>
                    <div className="text-muted extra-small">2,000+ Pros</div>
                  </div>
                </div>
              </div>

              {/* Dynamic Animated Verified Provider Card */}
              <div className={`lf-floating-card bottom-card ${fade ? "fade-in" : "fade-out"}`}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge-verified-icon">
                    <i className="bi bi-patch-check-fill text-primary"></i>
                  </span>
                  <span className="fw-semibold text-dark extra-small">Verified Provider</span>
                </div>
                <div className="fw-bold text-dark fs-6">{currentSlide.providerName}</div>
                <div className="text-muted extra-small mb-1">{currentSlide.specialty}</div>
                <div className="d-flex align-items-center gap-1 extra-small text-muted">
                  <span className="text-warning">★</span>
                  <span className="fw-bold text-dark">{currentSlide.rating}</span>
                  <span>({currentSlide.reviews})</span>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="lf-slide-dots">
                {heroSlides.map((slide, idx) => (
                  <span
                    key={slide.id}
                    className={`slide-dot ${idx === currentIndex ? "active" : ""}`}
                    onClick={() => {
                      setFade(false);
                      setTimeout(() => {
                        setCurrentIndex(idx);
                        setFade(true);
                      }, 200);
                    }}
                  ></span>
                ))}
              </div>

            </div>
          </Col>

        </Row>
      </Container>
    </section>
  );
}

export default Hero;


