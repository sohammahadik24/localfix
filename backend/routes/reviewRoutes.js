// ─────────────────────────────────────────────────────────────────────────────
// backend/routes/reviewRoutes.js
//
// WHAT IS THIS FILE?
//   API Route definitions for Ratings & Reviews in LocalFix.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

// ── Import Controller Methods ────────────────────────────────────────────────
const {
  createReview,
  getProviderReviews,
} = require("../controllers/reviewController");

// ── Import Auth & Role Middleware ────────────────────────────────────────────
const { protect, authorize } = require("../middleware/authMiddleware");

// ── 1. CUSTOMER REVIEW SUBMISSION ────────────────────────────────────────────

// POST /api/reviews -> Customer reviews a completed service request
router.post("/", protect, authorize("customer"), createReview);

// ── 2. PUBLIC PROVIDER REVIEWS & RATING QUERY ────────────────────────────────

// GET /api/reviews/provider/:providerId -> Get reviews and average rating for a provider
router.get("/provider/:providerId", getProviderReviews);

module.exports = router;
