// ─────────────────────────────────────────────────────────────────────────────
// backend/models/SupportTicket.js
//
// WHAT IS THIS MODEL?
//   Stores issues, problems, and complaints raised by Customers and Service Providers.
//   Provides full visibility to Platform Administrators.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    // The user (Customer or Provider) who raised the issue
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Role of the user at the time of raising the issue
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      required: true,
    },

    // Problem category (e.g. Booking Issue, Payment, Service Quality, etc.)
    category: {
      type: String,
      required: [true, "Problem category is required."],
      trim: true,
    },

    // Detailed description of the problem
    description: {
      type: String,
      required: [true, "Problem description is required."],
      minlength: [5, "Description must be at least 5 characters."],
      trim: true,
    },

    // Optional reference to a specific service request if related
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      default: null,
    },

    // Current ticket status
    status: {
      type: String,
      enum: ["Open", "In Review", "Resolved", "Closed"],
      default: "Open",
    },

    // Urgency level
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },

    // Admin resolution note / reply
    resolutionNote: {
      type: String,
      default: "",
      trim: true,
    },

    // Admin who resolved or reviewed the ticket
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
