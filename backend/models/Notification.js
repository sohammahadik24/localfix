// ─────────────────────────────────────────────────────────────────────────────
// backend/models/Notification.js
//
// Mongoose Model for system, booking, verification, support, and broadcast
// notifications across LocalFix (Customer, Provider, Admin).
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    // The specific user receiving this notification (null if broadcast)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // Role target: "customer", "provider", "admin", or "all"
    recipientRole: {
      type: String,
      enum: ["customer", "provider", "admin", "all"],
      default: "all",
      index: true,
    },

    // Notification title & body
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },

    // Notification category
    type: {
      type: String,
      enum: [
        "booking",
        "status_update",
        "verification",
        "support",
        "review",
        "broadcast",
        "system",
      ],
      default: "system",
    },

    // Priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Action link when clicked
    link: {
      type: String,
      default: "",
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    // Sender info (optional, e.g. Admin or System)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Optional metadata object for references
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries by recipient and read status
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipientRole: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
