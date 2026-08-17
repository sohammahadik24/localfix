// ─────────────────────────────────────────────────────────────────────────────
// backend/models/ServiceRequest.js
//
// WHAT IS THIS MODEL?
//   The ServiceRequest model stores all service booking jobs created by customers.
//   It tracks the lifecycle of a request from "Pending" through "Completed".
//
// RELATIONSHIPS:
//   - 'customer' references the _id of the User who submitted the request.
//   - 'provider' references the _id of the User/Provider assigned to the job (optional initially).
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    // Reference linking to the Customer who requested the service
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
    },

    // Reference linking to the Service Provider who accepted or was assigned (null initially)
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Short summary title (e.g., "Kitchen Tap Repair")
    title: {
      type: String,
      required: [true, "Request title is required"],
      trim: true,
    },

    // Service category (e.g., "Plumbing", "Electrical", "AC Repair")
    service: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
    },

    // AI-classified category inferred from description
    aiCategory: {
      type: String,
      default: "",
      trim: true,
    },

    // Detailed description of the problem
    description: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },

    // Service address / customer location
    location: {
      type: String,
      required: [true, "Service location is required"],
      trim: true,
    },

    // Customer's preferred service date (e.g., "2026-08-20")
    preferredDate: {
      type: String,
      trim: true,
      default: "",
    },

    // Customer's preferred service time slot (e.g., "05:00 PM")
    preferredTime: {
      type: String,
      trim: true,
      default: "",
    },

    // Lifecycle status of the job
    status: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Accepted",
          "In Progress",
          "On the Way",
          "Completed",
          "Cancelled",
        ],
        message: "{VALUE} is not a valid request status",
      },
      default: "Pending",
    },

    // Status audit trail / history log
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: "",
        },
      },
    ],
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' Date fields
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
