// ─────────────────────────────────────────────────────────────────────────────
// src/components/NotificationDropdown.jsx
//
// Reusable, real-time interactive Notification Bell & Popover for LocalFix
// (Used across Customer, Provider, Admin, and Public Navbars).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { notificationsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function NotificationDropdown({ align = "end" }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationsAPI.getMyNotifications({ limit: 30 });
      if (res.success && res.data) {
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.log("Error fetching notifications:", err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Auto-poll for new notifications every 20 seconds
      const interval = setInterval(fetchNotifications, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleMarkAsRead = async (e, notif) => {
    e.stopPropagation();
    if (notif.isRead) return;
    try {
      await notificationsAPI.markAsRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.log("Failed to mark as read:", err.message);
    }
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.log("Failed to mark all as read:", err.message);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      setUnreadCount((prev) => {
        const deleted = notifications.find((n) => n._id === id);
        return deleted && !deleted.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (err) {
      console.log("Failed to delete notification:", err.message);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationsAPI.markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.log("Error marking read on click:", err.message);
      }
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Helper for notification icons and styling
  const getTypeConfig = (type) => {
    switch (type) {
      case "booking":
        return { icon: "bi-calendar-check-fill", color: "#2563EB", bg: "#EFF6FF" };
      case "status_update":
        return { icon: "bi-arrow-repeat", color: "#D97706", bg: "#FEF3C7" };
      case "verification":
        return { icon: "bi-shield-fill-check", color: "#059669", bg: "#ECFDF5" };
      case "support":
        return { icon: "bi-headset", color: "#DC2626", bg: "#FEF2F2" };
      case "review":
        return { icon: "bi-star-fill", color: "#F59E0B", bg: "#FFFBEB" };
      case "broadcast":
        return { icon: "bi-megaphone-fill", color: "#7C3AED", bg: "#F5F3FF" };
      default:
        return { icon: "bi-bell-fill", color: "#4B5563", bg: "#F3F4F6" };
    }
  };

  // Relative time helper
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const displayedNotifications = notifications.filter((n) =>
    filter === "unread" ? !n.isRead : true
  );

  if (!isAuthenticated) return null;

  return (
    <Dropdown
      show={isOpen}
      onToggle={(show) => setIsOpen(show)}
      align={align}
      className="lf-notif-dropdown-wrapper"
    >
      <Dropdown.Toggle
        as="button"
        className="lf-notif-btn position-relative"
        title="Notifications"
      >
        <i className="bi bi-bell-fill"></i>
        {unreadCount > 0 && (
          <span className="lf-notif-badge position-absolute top-0 start-100 translate-middle">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu
        className="lf-notif-menu shadow-lg border-0 rounded-4 p-0 mt-2"
        style={{ width: "360px", maxWidth: "90vw" }}
      >
        {/* ── HEADER ──────────────────────────────────────────────── */}
        <div className="p-3 border-bottom bg-white rounded-top-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <h6 className="fw-bold text-dark mb-0">Notifications</h6>
            {unreadCount > 0 && (
              <Badge bg="primary" pill className="px-2 py-1 small">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn btn-link btn-sm text-primary text-decoration-none p-0 fw-semibold"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* ── FILTER TABS ─────────────────────────────────────────── */}
        <div className="d-flex border-bottom bg-light px-3 py-2 gap-2">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              filter === "all" ? "btn-primary" : "btn-light text-muted border"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setFilter("all");
            }}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              filter === "unread" ? "btn-primary" : "btn-light text-muted border"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setFilter("unread");
            }}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* ── NOTIFICATIONS LIST ──────────────────────────────────── */}
        <div
          className="lf-notif-list overflow-auto"
          style={{ maxHeight: "380px" }}
        >
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notif) => {
              const cfg = getTypeConfig(notif.type);
              return (
                <div
                  key={notif._id}
                  className={`lf-notif-item p-3 border-bottom d-flex gap-3 align-items-start position-relative transition-all ${
                    !notif.isRead ? "bg-primary-subtle bg-opacity-25" : "bg-white"
                  }`}
                  onClick={() => handleNotificationClick(notif)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Icon */}
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                    style={{
                      width: "38px",
                      height: "38px",
                      backgroundColor: cfg.bg,
                      color: cfg.color,
                      fontSize: "1rem",
                    }}
                  >
                    <i className={`bi ${cfg.icon}`}></i>
                  </div>

                  {/* Content */}
                  <div className="flex-grow-1 min-w-0 pe-2">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6
                        className={`mb-0 text-truncate ${
                          !notif.isRead ? "fw-bold text-dark" : "fw-semibold text-secondary"
                        }`}
                        style={{ fontSize: "0.88rem" }}
                      >
                        {notif.title}
                      </h6>
                      <small className="text-muted text-nowrap ms-2" style={{ fontSize: "0.72rem" }}>
                        {formatTimeAgo(notif.createdAt)}
                      </small>
                    </div>

                    <p
                      className="text-muted small mb-1 text-break line-clamp-2"
                      style={{ fontSize: "0.8rem", lineHeight: "1.3" }}
                    >
                      {notif.message}
                    </p>

                    {notif.link && (
                      <span className="badge bg-light text-primary border rounded-pill small" style={{ fontSize: "0.7rem" }}>
                        View Details →
                      </span>
                    )}
                  </div>

                  {/* Actions (Delete & Unread dot) */}
                  <div className="d-flex flex-column align-items-center justify-content-between h-100 flex-shrink-0 gap-2">
                    {!notif.isRead && (
                      <span
                        className="rounded-circle bg-primary"
                        style={{ width: "8px", height: "8px" }}
                        title="Unread"
                      ></span>
                    )}
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-muted p-0 opacity-50 hover-opacity-100"
                      title="Delete"
                      onClick={(e) => handleDelete(e, notif._id)}
                    >
                      <i className="bi bi-x-lg" style={{ fontSize: "0.75rem" }}></i>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-2"
                style={{ width: "50px", height: "50px", fontSize: "1.4rem" }}
              >
                <i className="bi bi-bell-slash text-muted"></i>
              </div>
              <p className="mb-0 small fw-semibold">No notifications</p>
              <small className="text-muted">
                {filter === "unread" ? "You have read all your alerts!" : "We'll notify you when updates arrive."}
              </small>
            </div>
          )}
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <div className="p-2 border-top bg-light text-center rounded-bottom-4">
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            LocalFix Real-Time Notification Center
          </small>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationDropdown;
