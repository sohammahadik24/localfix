// ─────────────────────────────────────────────────────────────────────────────
// backend/routes/providerRoutes.js
//
// WHAT IS THIS FILE?
//   API Route definitions for Service Providers in LocalFix.
//   Handles profile creation, status updates, availability toggling,
//   filtering provider list, and admin verification.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

// ── Import Controller Methods ────────────────────────────────────────────────
const {
  createProfile,
  getMyProfile,
  updateMyProfile,
  updateAvailability,
  getAllProviders,
  getProviderById,
  verifyProvider,
} = require("../controllers/providerController");

// ── Import Auth & Role Middleware ────────────────────────────────────────────
const { protect, authorize } = require("../middleware/authMiddleware");

// ── Import Review Controller Methods ─────────────────────────────────────────
const { getProviderReviews } = require("../controllers/reviewController");

// ── 1. PROVIDER-ONLY ROUTES (Must be logged in with role='provider') ─────────

// POST /api/providers/profile -> Create provider profile
router.post("/profile", protect, authorize("provider"), createProfile);

// GET /api/providers/me -> Get current logged-in provider profile
router.get("/me", protect, authorize("provider"), getMyProfile);

// PUT /api/providers/me -> Update own provider profile (skills, bio, location)
router.put("/me", protect, authorize("provider"), updateMyProfile);

// PATCH /api/providers/me/availability -> Toggle availability (true/false)
router.patch("/me/availability", protect, authorize("provider"), updateAvailability);

// ── 2. ADMIN-ONLY ROUTES (Must be logged in with role='admin') ───────────────

// PATCH /api/providers/:id/verify -> Approve or Reject a provider
router.patch("/:id/verify", protect, authorize("admin"), verifyProvider);

// ── 3. PUBLIC / GENERAL ROUTES ───────────────────────────────────────────────

// GET /api/providers/:providerId/reviews -> Get provider reviews and average rating
router.get("/:providerId/reviews", getProviderReviews);

// GET /api/providers -> Get list of providers with optional query filters (?service=...&availability=...)
router.get("/", getAllProviders);

// GET /api/providers/:id -> Get single provider details
router.get("/:id", getProviderById);

module.exports = router;
