// ─────────────────────────────────────────────────────────────────────────────
// backend/routes/notificationRoutes.js
//
// Express routes for LocalFix notifications system.
// ─────────────────────────────────────────────────────────────────────────────

const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  broadcastNotification,
} = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All notification routes require user authentication
router.use(protect);

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

// Admin-only broadcast
router.post("/broadcast", authorize("admin"), broadcastNotification);

module.exports = router;
