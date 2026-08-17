// ─────────────────────────────────────────────────────────────────────────────
// backend/models/Provider.js
//
// WHAT IS THIS MODEL?
//   The Provider model stores professional details for service professionals.
//   It extends the base User account with service-specific information.
//
// RELATIONSHIPS:
//   - 'user' references the _id of a User document (where role === "provider").
//   - Referenced in ServiceRequest when a provider accepts/is assigned to a job.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    // Reference linking to the User account document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provider must be linked to a User account"],
      unique: true, // Each provider user has one provider profile
    },

    // Primary service skill or trade (e.g., "Plumbing", "Electrical", "AC Repair")
    service: {
      type: String,
      required: [true, "Primary service category is required"],
      trim: true,
    },

    // Short professional bio or experience summary
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Coverage area / city (e.g., "Mumbai, Andheri / Bandra")
    location: {
      type: String,
      required: [true, "Service location / coverage area is required"],
      trim: true,
    },

    // Current work availability (true = available to accept jobs, false = off-duty)
    availability: {
      type: Boolean,
      default: true,
    },

    // Verification status managed by Admin or system onboarding
    verificationStatus: {
      type: String,
      enum: {
        values: ["Pending", "Verified", "Rejected"],
        message: "{VALUE} is not a valid verification status",
      },
      default: "Pending",
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' Date fields
    timestamps: true,
  }
);

module.exports = mongoose.model("Provider", providerSchema);
