// ─────────────────────────────────────────────────────────────────────────────
// src/pages/ProviderProfile.jsx
//
// WHAT IS THIS PAGE?
//   The "Provider Profile" page for LocalFix service professionals.
//   Route: /provider/profile
//
// FEATURES:
//   - Fetches live profile & verification status from Express & MongoDB.
//   - Fetches customer ratings and reviews.
//   - Allows editing profile details with instant MongoDB persistence.
//   - Displays verification badge (Verified / Pending / Rejected).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from "react-bootstrap";

// ── Import Provider Layout Shell ──────────────────────────────────────────
import ProviderSidebar from "../components/ProviderSidebar";
import ProviderNavbar  from "../components/ProviderNavbar";

// ── Import Page Components & APIs ─────────────────────────────────────────
import ProviderProfileCard from "../components/ProviderProfileCard";
import { providersAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProviderProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 5.0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);

  // Load Profile and Reviews
  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await providersAPI.getMyProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        if (res.data._id) {
          try {
            const revRes = await providersAPI.getProviderReviews(res.data._id);
            if (revRes.success) {
              setReviewsData(revRes.data);
            }
          } catch (e) {
            console.log("No reviews yet:", e.message);
          }
        }
      }
    } catch (err) {
      console.log("No profile yet:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const verificationStatus = profile?.isVerified || "Pending";
  const verifiedBadgeVariant =
    verificationStatus === "Verified"
      ? "success"
      : verificationStatus === "Rejected"
      ? "danger"
      : "warning";

  return (
    <div className="lf-dashboard-wrapper">
      <ProviderSidebar activeTab="profile" />

      <div className="lf-dashboard-main">
        <ProviderNavbar pageTitle="Provider Profile" />

        <div className="lf-dashboard-content">
          <Container fluid className="px-0">
            {/* ── 1. PROFILE HEADER BANNER ───────────────────────────────── */}
            <div className="lf-profile-header-card mb-4">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-4">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {/* Avatar */}
                  <div className="lf-profile-avatar-large" style={{ backgroundColor: "#2563EB" }}>
                    <span>{user?.name?.substring(0, 2).toUpperCase() || "LF"}</span>
                    <span className="lf-profile-avatar-badge" title="Verified Provider">
                      <i className="bi bi-patch-check-fill"></i>
                    </span>
                  </div>

                  {/* Name, Roles, Badges */}
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <h2 className="lf-profile-name mb-0">
                        {profile?.businessName || user?.name || "Service Provider"}
                      </h2>
                      <Badge bg="primary" className="lf-profile-role-badge">
                        <i className="bi bi-tools me-1"></i> Service Provider
                      </Badge>
                      <Badge
                        bg={verifiedBadgeVariant}
                        text={verificationStatus === "Pending" ? "dark" : "white"}
                        className="border px-2 py-1"
                      >
                        <i className="bi bi-patch-check-fill me-1"></i>
                        {verificationStatus === "Verified" ? "Verified Provider" : `${verificationStatus} Verification`}
                      </Badge>
                    </div>

                    <p className="lf-profile-joined mb-0">
                      <i className="bi bi-geo-alt me-1 text-danger"></i>
                      {profile?.location || "Mumbai, India"} · Member since 2026
                    </p>
                  </div>
                </div>

                {/* Quick Rating & Availability */}
                <div className="d-flex gap-3 align-items-center flex-wrap">
                  <div className="text-end">
                    <div className="fw-bold text-dark fs-5">
                      {reviewsData.averageRating?.toFixed(1) || "5.0"} <span className="text-warning">★</span>
                    </div>
                    <small className="text-muted">{reviewsData.totalReviews || 0} Customer Reviews</small>
                  </div>
                  <Badge bg={profile?.isAvailable ? "success" : "secondary"} className="px-3 py-2">
                    {profile?.isAvailable ? "Available" : "Busy"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* ── 2. TWO-COLUMN DETAILS GRID ─────────────────────────────── */}
            <Row className="g-4">
              <Col lg={7}>
                <ProviderProfileCard
                  initialProfile={profile}
                  user={user}
                  onProfileUpdate={() => loadProfile()}
                />
              </Col>

              <Col lg={5} className="d-flex flex-column gap-4">
                {/* Verification Status Notice */}
                <Card className="lf-profile-card">
                  <Card.Header className="lf-profile-card-header d-flex align-items-center gap-2">
                    <div className="lf-rd-card-header-icon bg-success-subtle text-success">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <h5 className="lf-profile-card-title mb-0">Account Verification</h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-semibold">Admin Verification Status:</span>
                      <Badge bg={verifiedBadgeVariant} text={verificationStatus === "Pending" ? "dark" : "white"}>
                        {verificationStatus}
                      </Badge>
                    </div>
                    <p className="small text-muted mb-0">
                      {verificationStatus === "Verified"
                        ? "Your background check and documents are verified. You can accept all customer jobs."
                        : verificationStatus === "Pending"
                        ? "Your account is awaiting Admin review. You can browse requests while verification is pending."
                        : "Your verification request was rejected. Please update your business details."}
                    </p>
                  </Card.Body>
                </Card>

                {/* Customer Reviews Card */}
                <Card className="lf-profile-card">
                  <Card.Header className="lf-profile-card-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="lf-rd-card-header-icon bg-warning-subtle text-warning">
                        <i className="bi bi-star-fill text-dark"></i>
                      </div>
                      <h5 className="lf-profile-card-title mb-0">Recent Customer Reviews</h5>
                    </div>
                    <Badge bg="light" text="dark" className="border">
                      {reviewsData.totalReviews} total
                    </Badge>
                  </Card.Header>

                  <Card.Body className="p-4">
                    {reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                      <div className="d-flex flex-column gap-3">
                        {reviewsData.reviews.map((rev) => (
                          <div key={rev._id} className="p-3 bg-light rounded-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-bold text-dark small">
                                {rev.customer?.name || "Verified Customer"}
                              </span>
                              <div className="text-warning small">
                                {"★".repeat(rev.rating)}
                                <span className="text-muted">{"☆".repeat(5 - rev.rating)}</span>
                              </div>
                            </div>
                            <p className="small text-muted mb-1 fst-italic">"{rev.comment}"</p>
                            <small className="text-muted" style={{ fontSize: "11px" }}>
                              {new Date(rev.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3 text-muted">
                        <i className="bi bi-chat-square-quote fs-3 d-block mb-1 text-muted"></i>
                        <p className="mb-0 small">No customer reviews yet.</p>
                        <small>Completed service requests will receive feedback here.</small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfile;
