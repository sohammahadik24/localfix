// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Register.jsx
//
// WHAT THIS FILE IS:
//   The Desktop Split-Screen Animated Registration Page for LocalFix.
//   It features a dual-role toggle (Customer vs Service Provider) with the exact
//   same smooth sliding animation, structure, and visual style as Login.jsx.
//
// HOW THE ANIMATION WORKS:
//   1. State: const [role, setRole] = useState("customer");
//   2. Customer mode:
//      - Form Box sits on the LEFT (translateX(0%))
//      - Promotional Panel sits on the RIGHT (translateX(0%))
//   3. Provider mode:
//      - Form Box slides to the RIGHT (translateX(100%))
//      - Promotional Panel slides to the LEFT (translateX(-100%))
//   4. CSS transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Container, Form, Button, InputGroup, Alert, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { providersAPI } from "../services/api";

function Register({ defaultRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();

  // ── 1. STATE FOR DUAL-ROLE TOGGLE ("customer" | "provider") ────────────────
  const [role, setRole] = useState("customer");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get("role");
    if (defaultRole === "provider" || roleParam === "provider" || location.pathname.includes("/provider")) {
      setRole("provider");
    } else {
      setRole("customer");
    }
  }, [defaultRole, location]);

  // ── 2. STATE FOR SHOW/HIDE PASSWORD TOGGLES ────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── 3. FORM INPUT STATES & STATUS ─────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceCategory: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
    setError("");
  };

  // Form submit handler connected to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordError("");

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match. Please verify and try again.");
      return;
    }

    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const newUser = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
      });

      // If registering as a provider, create the initial provider profile record
      if (role === "provider") {
        try {
          await providersAPI.createProfile({
            service: formData.serviceCategory || "General Maintenance",
            description: `Certified ${formData.serviceCategory || "service"} expert on LocalFix.`,
            location: "Local Area",
          });
        } catch (profErr) {
          console.warn("Provider profile auto-create notice:", profErr.message);
        }
        navigate("/provider/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      serviceCategory: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    });
    setPasswordError("");
  };

  return (
    <div className="lf-login-page lf-register-page">
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
        <div className={`lf-login-card lf-register-card ${role === "provider" ? "provider-active" : ""}`}>

          {/* ════════════════════════════════════════════════════════════════
              1. FORM CONTAINER (Slides LEFT ↔ RIGHT)
              - Customer mode: Sits on LEFT (translateX(0%))
              - Provider mode: Slides to RIGHT (translateX(100%))
          ════════════════════════════════════════════════════════════════ */}
          <div className="lf-form-box">
            {role === "customer" ? (

              /* ── CUSTOMER REGISTER FORM ──────────────────────────────── */
              <div className="lf-form-content fade-in">
                <div className="mb-3 text-start">
                  <h2 className="lf-form-title">Create Account 🚀</h2>
                  <p className="lf-form-subtitle">Join LocalFix to find verified service pros.</p>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2 fs-7 mb-2">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <Form.Group className="mb-2" controlId="customerFullName">
                    <Form.Label className="lf-label">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="lf-input"
                    />
                  </Form.Group>

                  {/* Email Field */}
                  <Form.Group className="mb-2" controlId="customerRegEmail">
                    <Form.Label className="lf-label">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="lf-input"
                    />
                  </Form.Group>

                  {/* Phone Field */}
                  <Form.Group className="mb-2" controlId="customerRegPhone">
                    <Form.Label className="lf-label">Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="lf-input"
                    />
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-2" controlId="customerRegPassword">
                    <Form.Label className="lf-label">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
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

                  {/* Confirm Password Field */}
                  <Form.Group className="mb-2" controlId="customerRegConfirmPassword">
                    <Form.Label className="lf-label">Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="lf-input border-end-0"
                      />
                      <InputGroup.Text
                        className="lf-input-eye"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {passwordError && (
                    <div className="text-danger extra-small mb-2 fw-semibold">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                      {passwordError}
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  <div className="mb-3 fs-7">
                    <Form.Check
                      type="checkbox"
                      id="customerAgreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      label={
                        <span>
                          I agree to the <a href="#terms" className="lf-link-blue">Terms</a> &amp; <a href="#privacy" className="lf-link-blue">Privacy Policy</a>
                        </span>
                      }
                      className="lf-checkbox"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={loading} className="btn-login-submit w-100 mb-2">
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Customer Account →"
                    )}
                  </Button>
                </Form>

                {/* Footer link to Login */}
                <div className="text-center mt-2 pt-2 border-top fs-7">
                  <span className="text-muted me-1">Already have an account?</span>
                  <Link to="/login" className="lf-link-bold">
                    Log In
                  </Link>
                </div>
              </div>

            ) : (

              /* ── PROVIDER REGISTER FORM ──────────────────────────────── */
              <div className="lf-form-content fade-in">
                <div className="mb-3 text-start">
                  <h2 className="lf-form-title">Join as a Pro 💼</h2>
                  <p className="lf-form-subtitle">Connect with customers &amp; grow your business.</p>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2 fs-7 mb-2">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Full Name / Business Name */}
                  <Form.Group className="mb-2" controlId="providerFullName">
                    <Form.Label className="lf-label">Full Name / Business Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="e.g. Apex Plumbing Services"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="lf-input"
                    />
                  </Form.Group>

                  {/* Primary Service Category */}
                  <Form.Group className="mb-2" controlId="providerCategory">
                    <Form.Label className="lf-label">Primary Service Category</Form.Label>
                    <Form.Select
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleChange}
                      required
                      className="lf-input lf-select-input"
                    >
                      <option value="">Select your specialty...</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="AC Repair">AC Repair</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Carpentry">Carpentry</option>
                      <option value="Painting">Painting</option>
                      <option value="Appliance Repair">Appliance Repair</option>
                      <option value="Other">Other Services</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Email & Phone Row */}
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <Form.Group controlId="providerRegEmail">
                        <Form.Label className="lf-label">Email address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="pro@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="lf-input"
                        />
                      </Form.Group>
                    </div>
                    <div className="col-6">
                      <Form.Group controlId="providerRegPhone">
                        <Form.Label className="lf-label">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="lf-input"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  {/* Password Field */}
                  <Form.Group className="mb-2" controlId="providerRegPassword">
                    <Form.Label className="lf-label">Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
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

                  {/* Confirm Password Field */}
                  <Form.Group className="mb-2" controlId="providerRegConfirmPassword">
                    <Form.Label className="lf-label">Confirm Password</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="lf-input border-end-0"
                      />
                      <InputGroup.Text
                        className="lf-input-eye"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {passwordError && (
                    <div className="text-danger extra-small mb-2 fw-semibold">
                      <i className="bi bi-exclamation-triangle-fill me-1"></i>
                      {passwordError}
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  <div className="mb-3 fs-7">
                    <Form.Check
                      type="checkbox"
                      id="providerAgreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      label={
                        <span>
                          I agree to <a href="#terms" className="lf-link-blue">Provider Partner Terms</a>
                        </span>
                      }
                      className="lf-checkbox"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={loading} className="btn-login-submit provider-btn w-100 mb-2">
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      "Join as Service Pro →"
                    )}
                  </Button>
                </Form>

                {/* Footer link to Provider Login */}
                <div className="text-center mt-2 pt-2 border-top fs-7">
                  <span className="text-muted me-1">Already registered as a pro?</span>
                  <Link to="/login?role=provider" className="lf-link-bold">
                    Log In as Provider
                  </Link>
                </div>
              </div>

            )}
          </div>

          {/* ════════════════════════════════════════════════════════════════
              2. PROMOTIONAL PANEL CONTAINER (Slides RIGHT ↔ LEFT)
              - Customer mode: Sits on RIGHT (translateX(0%))
              - Provider mode: Slides to LEFT (translateX(-100%))
          ════════════════════════════════════════════════════════════════ */}
          <div className="lf-panel-box">
            {role === "customer" ? (

              /* ── CUSTOMER PROMOTIONAL PANEL ─────────────────────────── */
              <div className="lf-panel-content customer-panel fade-in">
                <div className="panel-badge">For Customers</div>
                <h2 className="panel-title">Need something fixed?</h2>
                <p className="panel-text">
                  Sign up in seconds to discover verified local technicians, get free quotes, and track bookings.
                </p>

                {/* Benefits List */}
                <ul className="panel-benefits">
                  <li><i className="bi bi-check-circle-fill me-2"></i> Verified & Background-Checked Pros</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Instant Direct Booking & Quotes</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Transparent Customer Reviews</li>
                </ul>

                {/* Feature Image */}
                <div className="panel-img-wrap my-3">
                  <img
                    src="/customer-icon.png"
                    alt="LocalFix Customer Registration"
                    className="panel-img"
                  />
                </div>

                {/* Switch to Provider Role Button */}
                <div className="mt-auto pt-3">
                  <p className="extra-small text-white-50 mb-2">Are you a service professional?</p>
                  <Button
                    className="btn-switch-role w-100"
                    onClick={() => handleRoleSwitch("provider")}
                  >
                    Register as Service Provider →
                  </Button>
                </div>
              </div>

            ) : (

              /* ── PROVIDER PROMOTIONAL PANEL ─────────────────────────── */
              <div className="lf-panel-content provider-panel fade-in">
                <div className="panel-badge provider-badge">For Service Providers</div>
                <h2 className="panel-title">Expand your business.</h2>
                <p className="panel-text">
                  Join LocalFix network to get high-intent customer leads in your area with zero hidden commissions.
                </p>

                {/* Benefits List */}
                <ul className="panel-benefits">
                  <li><i className="bi bi-check-circle-fill me-2"></i> Verified Local Lead Stream</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Build Your Digital Reputation</li>
                  <li><i className="bi bi-check-circle-fill me-2"></i> Full Control Over Your Pricing</li>
                </ul>

                {/* Feature Image */}
                <div className="panel-img-wrap my-3">
                  <img
                    src="/provider-img.png"
                    alt="LocalFix Provider Registration"
                    className="panel-img"
                  />
                </div>

                {/* Switch to Customer Role Button */}
                <div className="mt-auto pt-3">
                  <p className="extra-small text-white-50 mb-2">Looking to hire a local professional?</p>
                  <Button
                    className="btn-switch-role w-100"
                    onClick={() => handleRoleSwitch("customer")}
                  >
                    Register as Customer →
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

export default Register;
