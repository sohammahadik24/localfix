// ─────────────────────────────────────────────────────────────────────────────
// src/components/Navbar.jsx
//
// WHY A SEPARATE FILE?
//   The navbar is shared across ALL pages. Making it its own component means
//   we write it once and import it wherever we need it. If we ever change the
//   navbar design, we only change ONE file.
//
// REACT-BOOTSTRAP COMPONENTS USED:
//   Navbar     - the top navigation container
//   Container  - centers content and adds horizontal padding
//   Nav        - the group of navigation links
//   Button     - styled button elements
//
// REACT ROUTER DOM:
//   Link       - like <a href="...">, but it changes the URL WITHOUT reloading
//               the whole page. This is what makes React apps feel fast.
//               <a href="/login"> = full page reload (slow)
//               <Link to="/login"> = instant URL change (React handles it)
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

function AppNavbar() {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  // Determine user dashboard destination
  const getDashboardPath = () => {
    if (role === "admin") return "/admin";
    if (role === "provider") return "/provider/dashboard";
    return "/dashboard";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="lf-navbar" sticky="top">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/">
          <i className="bi bi-tools me-2" style={{ color: "#2563EB" }}></i>
          LocalFix
        </Navbar.Brand>

        {/* Mobile Hamburger Toggle */}
        <Navbar.Toggle aria-controls="localfix-navbar-menu" />

        <Navbar.Collapse id="localfix-navbar-menu">
          {/* Main Navigation Links */}
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/how-it-works">How It Works</Nav.Link>
            <Nav.Link as={Link} to="/become-a-provider">Become a Provider</Nav.Link>
            <Nav.Link as={Link} to="/help">Help & Support</Nav.Link>
          </Nav>

          {/* Right Action Items (Auth-Aware) */}
          <div className="d-flex gap-2 align-items-center">
            {isAuthenticated && user ? (
              <div className="d-flex align-items-center gap-3">
                <NotificationDropdown align="end" />

                <Button
                  as={Link}
                  to={getDashboardPath()}
                  className="btn-getstarted d-flex align-items-center gap-2 py-2 px-3"
                >
                  <i className="bi bi-speedometer2"></i>
                  <span>Dashboard</span>
                </Button>

                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    id="dropdown-user"
                    className="d-flex align-items-center gap-2 border rounded-pill px-3 py-1 bg-white shadow-sm"
                  >
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: "28px", height: "28px", fontSize: "0.85rem" }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="fw-semibold text-dark small d-none d-sm-inline">
                      {user.name ? user.name.split(" ")[0] : "Account"}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-sm border-0 mt-2">
                    <Dropdown.Header>
                      <div className="fw-bold text-dark">{user.name || "User"}</div>
                      <small className="text-muted text-capitalize">{role || "Customer"}</small>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to={getDashboardPath()}>
                      <i className="bi bi-grid me-2 text-primary"></i> Main Portal
                    </Dropdown.Item>
                    {role === "customer" && (
                      <>
                        <Dropdown.Item as={Link} to="/requests">
                          <i className="bi bi-list-check me-2 text-primary"></i> My Requests
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/profile">
                          <i className="bi bi-person me-2 text-primary"></i> Profile Settings
                        </Dropdown.Item>
                      </>
                    )}
                    {role === "provider" && (
                      <>
                        <Dropdown.Item as={Link} to="/provider/jobs">
                          <i className="bi bi-briefcase me-2 text-primary"></i> My Jobs
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/provider/profile">
                          <i className="bi bi-person me-2 text-primary"></i> Provider Profile
                        </Dropdown.Item>
                      </>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i> Log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  className="btn-login"
                  variant="outline-primary"
                >
                  Log in
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  className="btn-getstarted"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// export default means: this is the main (and only) thing we export from this file.
// Other files can import it like: import Navbar from "./components/Navbar"
export default AppNavbar;
