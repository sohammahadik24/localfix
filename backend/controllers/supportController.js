// ─────────────────────────────────────────────────────────────────────────────
// backend/controllers/supportController.js
//
// WHAT IS THIS CONTROLLER?
//   Handles support tickets, complaints, and problem reports raised by
//   Customers and Providers, and provides full Admin oversight.
// ─────────────────────────────────────────────────────────────────────────────

const SupportTicket = require("../models/SupportTicket");
const mongoose = require("mongoose");
const { sendNotification } = require("../utils/notify");

// ── 1. CREATE SUPPORT TICKET / REPORT ISSUE (POST /api/support) ──────────────
// Restricted to: Authenticated Customers & Providers
const createTicket = async (req, res) => {
  try {
    const { category, description, serviceRequestId, priority } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        success: false,
        error: "Please provide both category and description for your issue.",
      });
    }

    const ticket = await SupportTicket.create({
      user: req.user._id,
      role: req.user.role,
      category,
      description,
      serviceRequest: serviceRequestId || null,
      priority: priority || "Normal",
      status: "Open",
    });

    await ticket.populate("user", "name email phone role");

    // 🔔 Notify Admin of newly raised issue
    sendNotification({
      recipientRole: "admin",
      title: `New Support Ticket: ${category}`,
      message: `${req.user.name} (${req.user.role}) reported an issue: "${description.slice(0, 80)}..."`,
      type: "support",
      priority: "high",
      link: `/admin`,
      metadata: { ticketId: ticket._id },
    });

    // 🔔 Notify User confirmation
    sendNotification({
      recipient: req.user._id,
      recipientRole: req.user.role,
      title: "Support Issue Received",
      message: `Your issue regarding "${category}" has been logged. Admin is reviewing it.`,
      type: "support",
      link: req.user.role === "provider" ? `/provider/help` : `/help`,
      metadata: { ticketId: ticket._id },
    });

    return res.status(201).json({
      success: true,
      message: "Your problem has been submitted successfully to the LocalFix support team.",
      data: ticket,
    });
  } catch (error) {
    console.error("Create Ticket Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error submitting support issue.",
    });
  }
};

// ── 2. GET CURRENT USER'S TICKETS (GET /api/support/my) ──────────────────────
// Restricted to: Authenticated Customers & Providers
const getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id })
      .populate("user", "name email phone role")
      .populate("serviceRequest", "title service status")
      .populate("resolvedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("Get My Tickets Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching support tickets.",
    });
  }
};

// ── 3. ADMIN: GET ALL RAISED PROBLEMS / TICKETS (GET /api/support/all) ────────
// Restricted to: Platform Admin ONLY
const getAllTicketsAdmin = async (req, res) => {
  try {
    const { role, status, category, search } = req.query;
    const filter = {};

    if (role && role !== "all") {
      filter.role = role;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (category && category !== "all") {
      filter.category = { $regex: category, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await SupportTicket.find(filter)
      .populate("user", "name email phone role")
      .populate("serviceRequest", "title service status preferredDate location")
      .populate("resolvedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("Admin Get Tickets Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching tickets for admin.",
    });
  }
};

// ── 4. ADMIN: UPDATE TICKET STATUS / RESOLVE (PATCH /api/support/:id/status) ──
// Restricted to: Platform Admin ONLY
const updateTicketStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ticket ID format.",
      });
    }

    const { status, resolutionNote } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Please provide the new status ('Open', 'In Review', 'Resolved', 'Closed').",
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: `Support ticket not found with ID: ${req.params.id}`,
      });
    }

    ticket.status = status;
    if (resolutionNote !== undefined) {
      ticket.resolutionNote = resolutionNote;
    }

    if (status === "Resolved" || status === "Closed") {
      ticket.resolvedBy = req.user._id;
      ticket.resolvedAt = new Date();
    }

    await ticket.save();
    await ticket.populate("user", "name email phone role");
    await ticket.populate("resolvedBy", "name email");

    // 🔔 Notify Ticket Owner
    if (ticket.user) {
      sendNotification({
        recipient: ticket.user._id,
        recipientRole: ticket.role || "customer",
        title: `Support Ticket: ${status}`,
        message: `Admin updated your ticket regarding "${ticket.category}" to "${status}". ${
          resolutionNote ? `Response: "${resolutionNote}"` : ""
        }`,
        type: "support",
        priority: status === "Resolved" ? "high" : "medium",
        link: ticket.role === "provider" ? `/provider/help` : `/help`,
        metadata: { ticketId: ticket._id, status },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Ticket status updated to '${status}' successfully!`,
      data: ticket,
    });
  } catch (error) {
    console.error("Update Ticket Status Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error updating ticket status.",
    });
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTicketsAdmin,
  updateTicketStatus,
};
