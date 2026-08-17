// ─────────────────────────────────────────────────────────────────────────────
// backend/controllers/notificationController.js
//
// Controller for querying, reading, deleting, and broadcasting notifications.
// ─────────────────────────────────────────────────────────────────────────────

const Notification = require("../models/Notification");
const User = require("../models/User");

// ── 1. GET MY NOTIFICATIONS (GET /api/notifications) ─────────────────────────
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { unreadOnly, limit = 50 } = req.query;

    // Filter by direct recipient OR role-based broadcast
    const query = {
      $or: [
        { recipient: userId },
        { recipientRole: userRole, recipient: null },
        { recipientRole: "all", recipient: null },
      ],
    };

    if (unreadOnly === "true") {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .populate("sender", "name email role");

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch notifications: " + error.message,
    });
  }
};

// ── 2. GET UNREAD NOTIFICATIONS COUNT (GET /api/notifications/unread-count) ──
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    const count = await Notification.countDocuments({
      isRead: false,
      $or: [
        { recipient: userId },
        { recipientRole: userRole, recipient: null },
        { recipientRole: "all", recipient: null },
      ],
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get unread count: " + error.message,
    });
  }
};

// ── 3. MARK SINGLE NOTIFICATION AS READ (PATCH /api/notifications/:id/read) ──
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update notification: " + error.message,
    });
  }
};

// ── 4. MARK ALL AS READ (PATCH /api/notifications/read-all) ──────────────────
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    await Notification.updateMany(
      {
        isRead: false,
        $or: [
          { recipient: userId },
          { recipientRole: userRole, recipient: null },
          { recipientRole: "all", recipient: null },
        ],
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to mark all as read: " + error.message,
    });
  }
};

// ── 5. DELETE NOTIFICATION (DELETE /api/notifications/:id) ───────────────────
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: "Notification not found",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: "Notification removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete notification: " + error.message,
    });
  }
};

// ── 6. BROADCAST NOTIFICATION [ADMIN ONLY] (POST /api/notifications/broadcast) 
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, targetRole = "all", priority = "medium", type = "broadcast", link = "" } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: "Title and message are required for broadcast.",
      });
    }

    const notification = await Notification.create({
      recipient: null,
      recipientRole: targetRole,
      title,
      message,
      type,
      priority,
      link,
      sender: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: `Broadcast notification dispatched to '${targetRole}'!`,
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to broadcast notification: " + error.message,
    });
  }
};
