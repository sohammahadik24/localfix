// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Profile.jsx
//
// WHAT IS THIS PAGE?
//   The "Customer Profile" page for LocalFix customers.
//   Route: /profile
//
// WHAT DOES THIS PAGE DO?
//   1. Reuses DashboardSidebar (with activeTab="profile") and DashboardNavbar.
//   2. Displays a Profile Header with customer avatar, name, email, and role badge.
//   3. Displays Account Information KPI stats (Member Since, Total Requests, Completed).
//   4. Renders <ProfileInfo /> for view & edit mode personal details.
//   5. Renders <SecurityCard /> for account password updates.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";

// ── Import Reusable Layout Shell ──────────────────────────────────────────
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar  from "../components/DashboardNavbar";

// ── Import Page Components ────────────────────────────────────────────────
import ProfileInfo  from "../components/ProfileInfo";
import SecurityCard from "../components/SecurityCard";

function Profile() {
  return (
    <div className="lf-dashboard-wrapper">
      {/* ── SIDEBAR (Active tab: "profile") ──────────────────────────────── */}
      <DashboardSidebar activeTab="profile" />

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────────── */}
      <div className="lf-dashboard-main">
        {/* Top Navbar */}
        <DashboardNavbar pageTitle="My Profile" />

        {/* Scrollable Page Content */}
        <div className="lf-dashboard-content">
          <Container fluid className="px-0">

            {/* ── 1. PROFILE HEADER BANNER ───────────────────────────────── */}
            <div className="lf-profile-header-card mb-4">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {/* Avatar with Initials */}
                <div className="lf-profile-avatar-large">
                  <span>S</span>
                  <span className="lf-profile-avatar-badge" title="Verified Customer">
                    <i className="bi bi-patch-check-fill"></i>
                  </span>
                </div>

                {/* Name, Email, & Badges */}
                <div className="lf-profile-header-info flex-grow-1">
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <h2 className="lf-profile-name mb-0">Soham Mahadik</h2>
                    <Badge bg="primary" className="lf-profile-role-badge">
                      <i className="bi bi-person-check-fill me-1"></i> Customer
                    </Badge>
                  </div>
                  <p className="lf-profile-email text-muted mb-1">
                    <i className="bi bi-envelope me-1"></i> soham@example.com
                  </p>
                  <span className="lf-profile-since text-muted small">
                    <i className="bi bi-calendar-check me-1"></i> Member since January 2026
                  </span>
                </div>
              </div>
            </div>

            {/* ── 2. TWO-COLUMN LAYOUT (Profile Info + Account & Security) ── */}
            <Row className="g-4">
              {/* LEFT COLUMN: Personal Information Card */}
              <Col lg={7}>
                <ProfileInfo />
              </Col>

              {/* RIGHT COLUMN: Account Overview & Security Card */}
              <Col lg={5} className="d-flex flex-column gap-4">
                {/* Account Summary Stats Card */}
                <Card className="lf-profile-card">
                  <Card.Header className="lf-profile-card-header d-flex align-items-center gap-2">
                    <div className="lf-rd-card-header-icon">
                      <i className="bi bi-person-badge-fill"></i>
                    </div>
                    <h5 className="lf-profile-card-title mb-0">Account Overview</h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="lf-account-stats-grid">
                      {/* Stat 1: Account Type */}
                      <div className="lf-account-stat-item">
                        <span className="lf-account-stat-label">Account Role</span>
                        <strong className="lf-account-stat-value text-primary">Customer</strong>
                      </div>

                      {/* Stat 2: Member Since */}
                      <div className="lf-account-stat-item">
                        <span className="lf-account-stat-label">Member Since</span>
                        <strong className="lf-account-stat-value text-dark">Jan 2026</strong>
                      </div>

                      {/* Stat 3: Total Requests */}
                      <div className="lf-account-stat-item">
                        <span className="lf-account-stat-label">Total Requests</span>
                        <strong className="lf-account-stat-value text-dark">6</strong>
                      </div>

                      {/* Stat 4: Completed Services */}
                      <div className="lf-account-stat-item">
                        <span className="lf-account-stat-label">Completed Services</span>
                        <strong className="lf-account-stat-value text-success">4</strong>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                {/* Security Card (Password Management) */}
                <SecurityCard />
              </Col>
            </Row>

          </Container>
        </div>
      </div>
    </div>
  );
}

export default Profile;
