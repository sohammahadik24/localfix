// ─────────────────────────────────────────────────────────────────────────────
// backend/routes/supportRoutes.js
//
// WHAT IS THIS FILE?
//   Route definitions for Customer and Provider problem reports, and
//   Admin dispute/support resolution management.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();

const {
  createTicket,
  getMyTickets,
  getAllTicketsAdmin,
  updateTicketStatus,
} = require("../controllers/supportController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 1. Create a support issue / problem report (Customer or Provider)
router.post("/", protect, createTicket);

// 2. Customer or Provider views their own raised issues
router.get("/my", protect, getMyTickets);

// 3. Admin views ALL issues raised across the entire platform
router.get("/all", protect, authorize("admin"), getAllTicketsAdmin);

// 4. Admin updates status or replies to a problem report
router.patch("/:id/status", protect, authorize("admin"), updateTicketStatus);

module.exports = router;
