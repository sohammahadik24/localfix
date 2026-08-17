// ─────────────────────────────────────────────────────────────────────────────
// backend/routes/authRoutes.js
//
// WHAT IS THIS FILE?
//   Authentication and Authorization Route Definitions for LocalFix.
//   Mounts public routes (register, login) and protected/role-restricted routes.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

// ── Import Controller Functions ──────────────────────────────────────────────
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

// ── Import Auth Middleware ───────────────────────────────────────────────────
const { protect, authorize } = require("../middleware/authMiddleware");

// ── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// 1. Register a new user (Customer, Provider, or Admin)
// POST /api/auth/register
router.post("/register", registerUser);

// 2. Login user & return JWT token
// POST /api/auth/login
router.post("/login", loginUser);

// ── PROTECTED ROUTES (Requires valid JWT token in Authorization header) ──────

// 3. Get current authenticated user profile
// GET /api/auth/me
router.get("/me", protect, getMe);

// 4. Role-Protected Test Route: Providers & Admins ONLY
// GET /api/auth/provider-only
router.get(
  "/provider-only",
  protect,
  authorize("provider", "admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: `Welcome to the Provider Portal, ${req.user.name}! Your role is: ${req.user.role}.`,
      user: req.user,
    });
  }
);

// 5. Role-Protected Test Route: Admins ONLY
// GET /api/auth/admin-only
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome Admin ${req.user.name}! You have full platform access.`,
    user: req.user,
  });
});

module.exports = router;
