// ─────────────────────────────────────────────────────────────────────────────
// backend/models/Review.js
//
// WHAT IS THIS MODEL?
//   The Review model stores customer ratings (1-5) and feedback comments
//   for service providers on completed service requests in LocalFix.
//
// RELATIONSHIPS:
//   - 'customer'       → references the User (customer) who wrote the review.
//   - 'provider'       → references the User (service provider) who performed the job.
//   - 'serviceRequest' → references the specific completed ServiceRequest (unique).
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // The customer who booked and completed the service
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer reference is required"],
    },

    // The service provider who fulfilled the booking
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provider reference is required"],
    },

    // The completed service request linked to this review
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: [true, "Service request reference is required"],
      unique: true, // Prevents duplicate reviews for the same service request
    },

    // Rating given by the customer (1 to 5 stars)
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1 star"],
      max: [5, "Rating cannot exceed 5 stars"],
    },

    // Optional customer feedback comment
    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' Date fields
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
