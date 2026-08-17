// ─────────────────────────────────────────────────────────────────────────────
// backend/controllers/providerController.js
//
// WHAT IS THIS FILE?
//   Controller handling all Provider profile, availability, listing,
//   and admin verification operations in LocalFix.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");
const Provider = require("../models/Provider");
const User = require("../models/User");
const { sendNotification } = require("../utils/notify");

// ── 1. CREATE PROVIDER PROFILE (POST /api/providers/profile) ─────────────────
// Restricted to: Logged-in Provider
const createProfile = async (req, res) => {
  try {
    const service = req.body.service || (Array.isArray(req.body.services) ? req.body.services[0] : "");
    const description = req.body.description || req.body.bio || "";
    const location = req.body.location || req.body.serviceArea || "";

    // A. Validation
    if (!service || !location) {
      return res.status(400).json({
        success: false,
        error: "Please provide 'service' and 'location'.",
      });
    }

    // B. Check if this user already has a provider profile
    const existingProfile = await Provider.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: "Provider profile already exists for this account. Use PUT /api/providers/me to update.",
      });
    }

    // C. Create new Provider profile (Default status: "Pending", availability: true)
    const provider = await Provider.create({
      user: req.user._id,
      service,
      description: description || "",
      location,
      availability: true,
      verificationStatus: "Pending",
    });

    // Populate user account info
    await provider.populate("user", "name email phone role");

    return res.status(201).json({
      success: true,
      message: "Provider profile created successfully! Status is Pending verification.",
      data: provider,
    });
  } catch (error) {
    console.error("Create Provider Profile Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error creating provider profile.",
    });
  }
};

// ── 2. GET CURRENT PROVIDER PROFILE (GET /api/providers/me) ──────────────────
// Restricted to: Logged-in Provider
const getMyProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone role createdAt"
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: "Provider profile not found. Please create one using POST /api/providers/profile.",
      });
    }

    return res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error("Get Provider Profile Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching provider profile.",
    });
  }
};

// ── 3. UPDATE CURRENT PROVIDER PROFILE (PUT /api/providers/me) ────────────────
// Restricted to: Logged-in Provider
const updateMyProfile = async (req, res) => {
  try {
    const service = req.body.service || (Array.isArray(req.body.services) ? req.body.services[0] : undefined);
    const description = req.body.description !== undefined ? req.body.description : req.body.bio;
    const location = req.body.location || req.body.serviceArea;
    const { phone, businessName } = req.body;

    let provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      // If provider profile doesn't exist yet, create it on the fly
      provider = await Provider.create({
        user: req.user._id,
        service: service || "General",
        description: description || "",
        location: location || "Not specified",
        availability: true,
        verificationStatus: "Pending",
      });
    } else {
      // Update fields
      if (service) provider.service = service;
      if (description !== undefined) provider.description = description;
      if (location) provider.location = location;
      await provider.save();
    }

    // Optionally update user's phone / name if provided
    if (phone || businessName) {
      const updateUserData = {};
      if (phone) updateUserData.phone = phone;
      if (businessName) updateUserData.name = businessName;
      await User.findByIdAndUpdate(req.user._id, updateUserData);
    }

    await provider.populate("user", "name email phone role");

    return res.status(200).json({
      success: true,
      message: "Provider profile updated successfully!",
      data: provider,
    });
  } catch (error) {
    console.error("Update Provider Profile Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error updating provider profile.",
    });
  }
};

// ── 4. UPDATE AVAILABILITY (PATCH /api/providers/me/availability) ─────────────
// Restricted to: Logged-in Provider
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (typeof availability !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "Please provide 'availability' as a boolean (true or false).",
      });
    }

    const provider = await Provider.findOne({ user: req.user._id });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: "Provider profile not found.",
      });
    }

    provider.availability = availability;
    await provider.save();
    await provider.populate("user", "name email phone");

    return res.status(200).json({
      success: true,
      message: `Availability updated to: ${availability ? "Available" : "Unavailable"}`,
      data: provider,
    });
  } catch (error) {
    console.error("Update Availability Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error updating availability.",
    });
  }
};

// ── 5. GET ALL PROVIDERS WITH FILTERS (GET /api/providers) ───────────────────
// Public / Available to all authenticated roles
const getAllProviders = async (req, res) => {
  try {
    const { service, availability, verificationStatus, location } = req.query;

    const filter = {};

    // Filter by service category (e.g. ?service=Plumbing)
    if (service) {
      filter.service = { $regex: service, $options: "i" };
    }

    // Filter by availability (e.g. ?availability=true)
    if (availability !== undefined) {
      filter.availability = availability === "true";
    }

    // Filter by verification status (e.g. ?verificationStatus=Verified)
    if (verificationStatus) {
      filter.verificationStatus = verificationStatus;
    }

    // Filter by location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const providers = await Provider.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    console.error("Get All Providers Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching providers list.",
    });
  }
};

// ── 6. GET SINGLE PROVIDER BY ID (GET /api/providers/:id) ─────────────────────
// Public / All roles
const getProviderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Provider ID format.",
      });
    }

    const provider = await Provider.findById(req.params.id).populate(
      "user",
      "name email phone"
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: `Provider not found with ID: ${req.params.id}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format error
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Provider ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching provider.",
    });
  }
};

// ── 7. ADMIN VERIFY / REJECT PROVIDER (PATCH /api/providers/:id/verify) ───────
// Restricted to: Admin ONLY
const verifyProvider = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Provider ID format.",
      });
    }

    const { verificationStatus } = req.body;

    // Validate status input
    if (!["Verified", "Rejected", "Pending"].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Allowed values: 'Verified', 'Rejected', 'Pending'.",
      });
    }

    let provider = await Provider.findById(req.params.id);

    if (!provider) {
      provider = await Provider.findOne({ user: req.params.id });
    }

    if (!provider) {
      // If user exists as provider, create profile on the fly
      const user = await User.findById(req.params.id);
      if (user && user.role === "provider") {
        provider = await Provider.create({
          user: user._id,
          service: "General",
          location: "Not specified",
          availability: true,
          verificationStatus: verificationStatus,
        });
      } else {
        return res.status(404).json({
          success: false,
          error: `Provider not found with ID: ${req.params.id}`,
        });
      }
    }

    provider.verificationStatus = verificationStatus;
    await provider.save();
    await provider.populate("user", "name email phone role");

    // 🔔 Notify Provider of verification update
    if (provider.user) {
      sendNotification({
        recipient: provider.user._id,
        recipientRole: "provider",
        title: `Account Verification: ${verificationStatus}`,
        message:
          verificationStatus === "Verified"
            ? "Congratulations! Your provider profile has been verified by the Administrator. You can now accept live customer job requests."
            : `Your verification status has been updated to '${verificationStatus}'. Please review your profile details.`,
        type: "verification",
        priority: verificationStatus === "Verified" ? "high" : "medium",
        link: `/provider/profile`,
        metadata: { verificationStatus },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Provider status updated to: ${verificationStatus}`,
      data: provider,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Provider ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || "Server error updating verification status.",
    });
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateMyProfile,
  updateAvailability,
  getAllProviders,
  getProviderById,
  verifyProvider,
};
