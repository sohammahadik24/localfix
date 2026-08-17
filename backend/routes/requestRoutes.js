// ─────────────────────────────────────────────────────────────────────────────
// backend/routes/requestRoutes.js
//
// WHAT IS THIS FILE?
//   API Route definitions for Customer Bookings, Provider Jobs,
//   and Service Request Status Lifecycle in LocalFix.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

// ── Import Controller Methods ────────────────────────────────────────────────
const {
  createRequest,
  classifyRequestPreview,
  getMyRequests,
  getRequestById,
  updateRequest,
  cancelRequest,
  getAvailableRequests,
  acceptRequest,
  getProviderRequests,
  updateRequestStatus,
  getAllRequestsAdmin,
} = require("../controllers/requestController");

// ── Import Auth & Role Middleware ────────────────────────────────────────────
const { protect, authorize } = require("../middleware/authMiddleware");

// ── 1. CUSTOMER & AI CLASSIFICATION ROUTES ───────────────────────────────────

// POST /api/requests -> Customer creates a new service request (with AI auto-classification)
router.post("/", protect, authorize("customer"), createRequest);

// POST /api/requests/classify -> AI preview endpoint for testing/categorizing descriptions
router.post("/classify", classifyRequestPreview);

// GET /api/requests/my -> Customer views all their own bookings
router.get("/my", protect, authorize("customer"), getMyRequests);

// ── 2. ADMIN WORK MANAGEMENT ROUTE ───────────────────────────────────────────

// GET /api/requests/all -> Admin views all platform requests and work management
router.get("/all", protect, authorize("admin"), getAllRequestsAdmin);

// ── 2. PROVIDER ROUTES (Placed BEFORE /:id to prevent route shadowing) ───────

// GET /api/requests/available -> Provider views matching unassigned "Pending" requests
router.get("/available", protect, authorize("provider"), getAvailableRequests);

// GET /api/requests/provider -> Provider views jobs assigned to themselves
router.get("/provider", protect, authorize("provider"), getProviderRequests);

// PATCH /api/requests/:id/accept -> Provider accepts a pending service request
router.patch("/:id/accept", protect, authorize("provider"), acceptRequest);

// ── 3. STATUS TRANSITION & LIFECYCLE ROUTES ──────────────────────────────────

// PATCH /api/requests/:id/status -> Assigned Provider (or Admin) transitions request status
router.patch("/:id/status", protect, authorize("provider", "admin"), updateRequestStatus);

// ── 4. SINGLE REQUEST & CUSTOMER EDIT/CANCEL ROUTES ──────────────────────────

// GET /api/requests/:id -> View single request details (Owner customer or Provider/Admin)
router.get("/:id", protect, getRequestById);

// PUT /api/requests/:id -> Customer updates their pending request
router.put("/:id", protect, authorize("customer"), updateRequest);

// PATCH /api/requests/:id/cancel -> Customer cancels their pending request
router.patch("/:id/cancel", protect, authorize("customer"), cancelRequest);

module.exports = router;
