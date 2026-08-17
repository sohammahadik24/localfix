// ─────────────────────────────────────────────────────────────────────────────
// backend/controllers/reviewController.js
//
// WHAT IS THIS FILE?
//   Controller handling Ratings & Reviews in LocalFix.
//   Manages customer review submissions for completed jobs,
//   fetching provider reviews, and computing provider average ratings.
// ─────────────────────────────────────────────────────────────────────────────

const Review = require("../models/Review");
const ServiceRequest = require("../models/ServiceRequest");
const Provider = require("../models/Provider");
const User = require("../models/User");
const { sendNotification } = require("../utils/notify");

// ── 1. CREATE SERVICE REVIEW (POST /api/reviews) ─────────────────────────────
// Restricted to: Authenticated Customers (who booked and completed the request)
const createReview = async (req, res) => {
  try {
    const { requestId, rating, comment } = req.body;

    // A. Validation: Required fields
    if (!requestId || rating === undefined || rating === null) {
      return res.status(400).json({
        success: false,
        error: "Please provide both 'requestId' and 'rating' (1 to 5).",
      });
    }

    // B. Validation: Rating range (1 to 5)
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be a number between 1 and 5.",
      });
    }

    // C. Find the Service Request
    const request = await ServiceRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: `Service request not found with ID: ${requestId}`,
      });
    }

    // D. Security Check: Customer can only review their own request
    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You can only submit a review for your own service request.",
      });
    }

    // E. Status Check: Must be "Completed"
    if (request.status !== "Completed") {
      return res.status(400).json({
        success: false,
        error: `Cannot review request because its status is '${request.status}'. Reviews are only allowed on 'Completed' jobs.`,
      });
    }

    // F. Provider Check: Ensure a provider fulfilled the job
    if (!request.provider) {
      return res.status(400).json({
        success: false,
        error: "No provider was assigned to this request.",
      });
    }

    // G. Duplicate Review Check: Prevent multiple reviews for the same request
    const existingReview = await Review.findOne({ serviceRequest: requestId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        error: "Conflict: You have already submitted a review for this completed service request.",
      });
    }

    // H. Create and save the Review in MongoDB
    const review = await Review.create({
      customer: req.user._id,
      provider: request.provider,
      serviceRequest: requestId,
      rating: numRating,
      comment: comment || "",
    });

    // Populate public display fields
    await review.populate("customer", "name");
    await review.populate("provider", "name");

    // 🔔 Notify Provider of new review
    sendNotification({
      recipient: request.provider,
      recipientRole: "provider",
      title: `New ${numRating}★ Review Received!`,
      message: `${req.user.name} rated your service: "${comment || "Great job!"}"`,
      type: "review",
      link: `/provider/profile`,
      metadata: { reviewId: review._id, rating: numRating },
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully! Thank you for your feedback.",
      data: review,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Request ID format.",
      });
    }
    console.error("Create Review Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error submitting review.",
    });
  }
};

// ── 2. GET PROVIDER REVIEWS & AVERAGE RATING (GET /api/reviews/provider/:providerId)
// Public / Accessible to all users
const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Resolve target Provider User ID (handles either Provider profile ID or User ID)
    let targetUserId = providerId;

    // Check if providerId is a Provider Profile document _id
    const providerProfile = await Provider.findById(providerId);
    if (providerProfile) {
      targetUserId = providerProfile.user;
    } else {
      // Check if it's a User _id with role 'provider'
      const userDoc = await User.findById(providerId);
      if (!userDoc || userDoc.role !== "provider") {
        return res.status(404).json({
          success: false,
          error: `Provider not found with ID: ${providerId}`,
        });
      }
    }

    // Fetch all reviews for this provider
    // Note: Privacy protection - only populate customer name, exclude phone/email
    const reviews = await Review.find({ provider: targetUserId })
      .populate("customer", "name")
      .populate("serviceRequest", "title service")
      .sort({ createdAt: -1 });

    // Calculate Average Rating & Total Reviews
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

    return res.status(200).json({
      success: true,
      providerId: providerId,
      averageRating: averageRating,
      totalReviews: totalReviews,
      data: {
        reviews,
        totalReviews,
        averageRating,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Provider ID format.",
      });
    }
    console.error("Get Provider Reviews Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching provider reviews.",
    });
  }
};

module.exports = {
  createReview,
  getProviderReviews,
};
