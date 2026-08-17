// ─────────────────────────────────────────────────────────────────────────────
// backend/utils/notify.js
//
// Helper utility for generating and dispatching notifications across LocalFix
// ─────────────────────────────────────────────────────────────────────────────

const Notification = require("../models/Notification");

/**
 * Create a notification for a specific user or role
 * @param {Object} options
 * @param {string|ObjectId} options.recipient - Target User ID (optional)
 * @param {string} options.recipientRole - "customer" | "provider" | "admin" | "all"
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification description
 * @param {string} options.type - "booking" | "status_update" | "verification" | "support" | "review" | "broadcast" | "system"
 * @param {string} options.link - Relative path for action click (e.g. "/requests/123")
 * @param {string} options.priority - "low" | "medium" | "high" | "urgent"
 * @param {Object} options.metadata - Associated data (requestId, ticketId, etc.)
 */
const sendNotification = async ({
  recipient = null,
  recipientRole = "all",
  title,
  message,
  type = "system",
  link = "",
  priority = "medium",
  metadata = {},
  sender = null,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      recipientRole,
      title,
      message,
      type,
      link,
      priority,
      metadata,
      sender,
    });
    return notification;
  } catch (error) {
    console.error("⚠️ Failed to create notification:", error.message);
    return null;
  }
};

module.exports = {
  sendNotification,
};
