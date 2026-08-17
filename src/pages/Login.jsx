// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Login.jsx
//
// WHAT THIS FILE IS:
//   The complete Desktop Split-Screen Animated Login Page for LocalFix.
//   It features a smooth dual-role toggle (Customer vs Service Provider).
//
// HOW THE ANIMATION WORKS:
//   1. We maintain React state: const [role, setRole] = useState("customer");
//   2. When role === "customer":
//      - Form Box is on the LEFT (translateX(0%))
//      - Panel Box is on the RIGHT (translateX(0%))
//   3. When role === "provider":
//      - Form Box slides to the RIGHT (translateX(100%))
//      - Panel Box slides to the LEFT (translateX(-100%))
//   4. CSS transition: transform 0.6s ease-in-out creates the smooth sliding motion!
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Form, Button, InputGroup, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── 1. STATE FOR DUAL-ROLE TOGGLE ("customer" | "provider") ────────────────
  const [role, setRole] = useState("customer");

  // ── 2. STATE FOR SHOW/HIDE PASSWORD TOGGLE ────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);

  // ── 3. STATE FOR FORM INPUTS & STATUS ──────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form submit handler connected to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      
      // Dynamic Role-Based Redirection based on returned backend user role
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else if (loggedInUser.role === "provider") {
        navigate("/provider/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lf-login-page">
      <Container className="d-flex flex-column align-items-center justify-content-center h-100 py-4">

        {/* ── TOP HEADER (BACK BUTTON & LOGO) ────────────────────────────── */}
        <div className="w-100 d-flex justify-content-between align-items-center mb-4" style={{ maxWidth: "850px" }}>
          <Link
            to="/"
            className="btn btn-sm btn-white bg-white border rounded-pill px-3 py-2 text-secondary fw-semibold shadow-sm d-inline-flex align-items-center gap-2 hover-shadow transition-all"
            title="Back to Home"
          >
            <i className="bi bi-arrow-left text-primary"></i>
            <span>Back to Home</span>
          </Link>

          <Link to="/" className="lf-login-logo d-none d-sm-flex align-items-center">
            <i className="bi bi-tools me-2 text-primary"></i>
            <span>LocalFix</span>
          </Link>

          <div style={{ width: "120px" }} className="d-none d-sm-block"></div>
        </div>

        {/* ── MAIN ANIMATED SPLIT-CONTAINER CARD ──────────────────────────── */}
        <div className={`lf-login-card ${role === "provider" ? "provider-active" : ""}`}>

          {/* ════════════════════════════════════════════════════════════════
              1. FORM CONTAINER (Slides LEFT ↔ RIGHT)
              - In Customer mode: sits on LEFT (translateX(0%))
              - In Provider mode: slides to RIGHT (translateX(100%))
          ════════════════════════════════════════════════════════════════ */}
          <div className="lf-form-box">
            {role === "customer" ? (

              /* ── CUSTOMER LOGIN FORM ─────────────────────────────────── */
              <div className="lf-form-content fade-in">
                <div className="mb-4">
                  <h2 className="lf-form-title">Welcome back 👋</h2>
                  <p className="lf-form-subtitle">Sign in to continue to LocalFix.</p>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2 fs-7 mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3" controlId="customerEmail">
                    <Form.Label className="lf-label">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="lf-input"
                    />
                  </Form.Group>

                  {/* Password Field with Eye Toggle */}
                  <Form.Group className="mb-3" controlId="customerPassword">
                    <Form.Label className="lf-label">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="lf-input border-end-0"
                      />
                      <InputGroup.Text
                        className="lf-input-eye"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4 fs-7">
                    <Form.Check
                      type="checkbox"
                      id="customerRemember"
                      label="Remember me"
                      className="lf-checkbox"
                    />
                    <a href="#forgot" className="lf-link-blue">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={loading} className="btn-login-submit w-100 mb-3">
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Signing in...
                      </>
                    ) : (
                      "Login as Customer →"
                    )}
                  </Button>
                </Form>

                {/* Footer link to Register */}
                <div className="text-center mt-3 pt-3 border-top fs-7">
                  <span className="text-muted me-1">Don't have an account?</span>
                  <Link to="/register" className="lf-link-bold">
                    Create Customer Account
                  </Link>
                </div>
              </div>

            ) : (

              /* ── PROVIDER LOGIN FORM ─────────────────────────────────── */
              <div className="lf-form-content fade-in">
                <div className="mb-4">
                  <h2 className="lf-form-title">Welcome, Professional 👋</h2>
                  <p className="lf-form-subtitle">Sign in to manage your LocalFix services.</p>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2 fs-7 mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-3" controlId="providerEmail">
                    <Form.Label className="lf-label">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="lf-input"
                    />
                  </Form.Group>

                  {/* Password Field with Eye Toggle */}
                  <Form.Group className="mb-3" controlId="providerPassword">
                    <Form.Label className="lf-label">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="lf-input border-end-0"
                      />
                      <InputGroup.Text
                        className="lf-input-eye"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4 fs-7">
                    <Form.Check
                      type="checkbox"
                      id="providerRemember"
                      label="Remember me"
                      className="lf-checkbox"
                    />
                    <a href="#forgot" className="lf-link-blue">
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={loading} className="btn-login-submit provider-btn w-100 mb-3">
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Signing in...
                      </>
                    ) : (
                      "Login as Provider →"
                    )}
                  </Button>
                </Form>

                {/* Footer link to Provider Register */}
                <div className="text-center mt-3 pt-3 border-top fs-7">
                  <span className="text-muted me-1">Don't have a provider account?</span>
                  <Link to="/provider/register" className="lf-link-bold">
                    Become a Provider
                  </Link>
                </div>
              </div>

            )}
          </div>

          {/* ════════════════════════════════════════════════════════════════
              2. PROMOTIONAL PANEL CONTAINER (Slides RIGHT ↔ LEFT)
              - In Customer mode: sits on RIGHT (translateX(0%))
              - In Provider mode: slides to LEFT (translateX(-100%))
          ════════════════════════════════════════════════════════════════ */}
          <div className="lf-panel-box">
            {role === "customer" ? (

              /* ── CUSTOMER PROMOTIONAL PANEL ─────────────────────────── */
              <div className="lf-panel-content customer-panel fade-in">
                <div className="panel-badge">For Customers</div>
                <h2 className="panel-title">Need something fixed?</h2>
                <p className="panel-text">
                  Find trusted local professionals for repairs, maintenance, and everyday services.
                </p>

                {/* Benefits List */}
                <ul className="panel-benefits">
                  <li><i className="bi bi-check-circle-fill me-2"></i> Verified Professionals</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Easy Booking</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Track Your Requests</li>
                </ul>

                {/* Feature Image */}
                <div className="panel-img-wrap my-3">
                  <img
                    src="/customer-icon.png"
                    alt="LocalFix Customer Service"
                    className="panel-img"
                  />
                </div>

                {/* Action button to switch to Provider Mode */}
                <div className="mt-auto pt-3">
                  <p className="extra-small text-white-50 mb-2">Are you a service professional?</p>
                  <Button
                    className="btn-switch-role w-100"
                    onClick={() => {
                      setRole("provider");
                      setEmail("");
                      setPassword("");
                    }}
                  >
                    Become a Service Provider →
                  </Button>
                </div>
              </div>

            ) : (

              /* ── PROVIDER PROMOTIONAL PANEL ─────────────────────────── */
              <div className="lf-panel-content provider-panel fade-in">
                <div className="panel-badge provider-badge">For Service Providers</div>
                <h2 className="panel-title">Grow your local business.</h2>
                <p className="panel-text">
                  Connect with customers who need your services and manage your jobs with LocalFix.
                </p>

                {/* Benefits List */}
                <ul className="panel-benefits">
                  <li><i className="bi bi-check-circle-fill me-2"></i> Reach Local Customers</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Manage Service Requests</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Build Your Reputation</li>
                </ul>

                {/* Feature Image */}
                <div className="panel-img-wrap my-3">
                  <img
                    src="/provider-img.png"
                    alt="LocalFix Provider Work"
                    className="panel-img"
                  />
                </div>

                {/* Action button to switch back to Customer Mode */}
                <div className="mt-auto pt-3">
                  <p className="extra-small text-white-50 mb-2">Looking to hire a local professional?</p>
                  <Button
                    className="btn-switch-role w-100"
                    onClick={() => {
                      setRole("customer");
                      setEmail("");
                      setPassword("");
                    }}
                  >
                    Login as Customer →
                  </Button>
                </div>
              </div>

            )}
          </div>

        </div>
      </Container>
    </div>
  );
}

export default Login;
