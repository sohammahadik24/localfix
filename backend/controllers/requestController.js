// ─────────────────────────────────────────────────────────────────────────────
// backend/controllers/requestController.js
//
// WHAT IS THIS FILE?
//   Controller handling Customer Service Requests, Provider Jobs,
//   AI-Based Service Classification, and the Complete Status Lifecycle in LocalFix.
//
// STATUS LIFECYCLE:
//   Pending ➔ Accepted ➔ In Progress / On the Way ➔ Completed (or Cancelled)
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");
const ServiceRequest = require("../models/ServiceRequest");
const Provider = require("../models/Provider");
const { classifyService } = require("../utils/aiClassifier");
const { sendNotification } = require("../utils/notify");

// ── DEFINITION OF VALID STATUS TRANSITIONS (State Machine) ───────────────────
const VALID_STATUS_TRANSITIONS = {
  Pending: ["Accepted", "Cancelled"],
  Accepted: ["In Progress", "On the Way", "Cancelled"],
  "On the Way": ["In Progress", "Completed", "Cancelled"],
  "In Progress": ["On the Way", "Completed", "Cancelled"],
  Completed: [], // Terminal state - cannot transition further
  Cancelled: [], // Terminal state - cannot transition further
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 PART 1: CUSTOMER REQUEST OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. CREATE SERVICE REQUEST WITH AI CLASSIFICATION (POST /api/requests) ────
// Restricted to: Authenticated Customers
const createRequest = async (req, res) => {
  try {
    const { title, service, description, location, preferredDate, preferredTime } = req.body;

    // A. Validation: Check required fields
    if (!service || !description || !location) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields: service, description, and location.",
      });
    }

    // B. AI-Based Service Classification (Auto-detects / validates category)
    const aiResult = await classifyService(description, title, service);
    const aiCategory = aiResult.aiCategory || service;

    // C. Create the request in MongoDB
    // - customer: Automatically set from req.user._id (JWT)
    // - status: Always initialized to "Pending"
    // - provider: Set to null initially
    // - aiCategory: Auto-detected from customer's problem description
    const serviceRequest = await ServiceRequest.create({
      customer: req.user._id,
      provider: null,
      title: title || `${service} Service`,
      service,
      aiCategory,
      description,
      location,
      preferredDate: preferredDate || "",
      preferredTime: preferredTime || "",
      status: "Pending",
      statusHistory: [
        {
          status: "Pending",
          changedBy: req.user._id,
          changedAt: new Date(),
          note: `Request created. AI classification: ${aiCategory} (Method: ${aiResult.method || "Auto"})`,
        },
      ],
    });

    // Populate customer account details
    await serviceRequest.populate("customer", "name email phone");

    // 🔔 Send Real-Time Notifications
    // 1. To Customer
    sendNotification({
      recipient: req.user._id,
      recipientRole: "customer",
      title: "Booking Request Created",
      message: `Your ${service} request "${serviceRequest.title}" was posted successfully. Matching nearby professionals...`,
      type: "booking",
      link: `/request/${serviceRequest._id}`,
      metadata: { requestId: serviceRequest._id },
    });

    // 2. Broadcast to Providers in same category
    sendNotification({
      recipientRole: "provider",
      title: `New ${service} Request in ${location}`,
      message: `A customer posted a new request: "${serviceRequest.title}". Tap to view details and accept.`,
      type: "booking",
      link: `/provider/requests`,
      metadata: { requestId: serviceRequest._id, service },
    });

    // 3. To Admin
    sendNotification({
      recipientRole: "admin",
      title: "New Booking Submitted",
      message: `${req.user.name} created a new ${service} request (#${serviceRequest._id.toString().slice(-6)}).`,
      type: "system",
      link: `/admin`,
      metadata: { requestId: serviceRequest._id },
    });

    return res.status(201).json({
      success: true,
      message: "Service request created successfully!",
      aiClassification: {
        detectedCategory: aiCategory,
        confidence: aiResult.confidence,
        reasoning: aiResult.reasoning,
        method: aiResult.method,
      },
      data: serviceRequest,
    });
  } catch (error) {
    console.error("Create Request Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error creating service request.",
    });
  }
};

// ── 2. PREVIEW AI SERVICE CLASSIFICATION (POST /api/requests/classify) ───────
// Public / Authenticated utility endpoint to test/preview AI categorization
const classifyRequestPreview = async (req, res) => {
  try {
    const { description, title, service } = req.body;

    if (!description && !title) {
      return res.status(400).json({
        success: false,
        error: "Please provide 'description' or 'title' for AI classification.",
      });
    }

    const classification = await classifyService(description, title, service);

    return res.status(200).json({
      success: true,
      data: {
        detectedCategory: classification.aiCategory,
        aiCategory: classification.aiCategory,
        confidence: classification.confidence,
        reasoning: classification.reasoning,
        method: classification.method,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error during AI classification.",
    });
  }
};

// ── 3. GET LOGGED-IN CUSTOMER'S REQUESTS (GET /api/requests/my) ──────────────
// Restricted to: Authenticated Customers (returns ONLY their requests)
const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user._id })
      .populate("customer", "name email phone")
      .populate("provider", "name email phone")
      .populate("statusHistory.changedBy", "name role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get My Requests Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching your requests.",
    });
  }
};

// ── 4. GET SINGLE REQUEST DETAILS (GET /api/requests/:id) ────────────────────
// Restricted to: Owner Customer (or assigned Provider/Admin)
const getRequestById = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("provider", "name email phone")
      .populate("statusHistory.changedBy", "name role");

    if (!request) {
      return res.status(404).json({
        success: false,
        error: `Service request not found with ID: ${req.params.id}`,
      });
    }

    // Security Check: If a customer is requesting, ensure they are the owner!
    if (
      req.user.role === "customer" &&
      request.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You are not authorized to view another customer's request.",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Request ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching request details.",
    });
  }
};

// ── 5. UPDATE PENDING REQUEST (PUT /api/requests/:id) ────────────────────────
// Restricted to: Owner Customer (Only while status is "Pending")
const updateRequest = async (req, res) => {
  try {
    const { title, service, description, location, preferredDate, preferredTime } = req.body;

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: `Service request not found with ID: ${req.params.id}`,
      });
    }

    // Security Check: Only the owner can edit
    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You cannot modify another customer's request.",
      });
    }

    // Status Check: Can ONLY update if still Pending
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        error: `Cannot update request because it is already '${request.status}'. Only 'Pending' requests can be modified.`,
      });
    }

    // Update allowed fields
    if (title) request.title = title;
    if (service) request.service = service;
    if (description) {
      request.description = description;
      // Re-run AI classification on updated description
      const updatedAi = await classifyService(description, title || request.title, service || request.service);
      request.aiCategory = updatedAi.aiCategory;
    }
    if (location) request.location = location;
    if (preferredDate !== undefined) request.preferredDate = preferredDate;
    if (preferredTime !== undefined) request.preferredTime = preferredTime;

    await request.save();
    await request.populate("customer", "name email phone");

    return res.status(200).json({
      success: true,
      message: "Service request updated successfully!",
      data: request,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Request ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || "Server error updating request.",
    });
  }
};

// ── 6. CANCEL PENDING REQUEST (PATCH /api/requests/:id/cancel) ───────────────
// Restricted to: Owner Customer (Only while status is "Pending")
const cancelRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: `Service request not found with ID: ${req.params.id}`,
      });
    }

    // Security Check: Only the owner can cancel
    if (request.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You cannot cancel another customer's request.",
      });
    }

    // Status Check: Can only cancel if still Pending
    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel request because it is already '${request.status}'.`,
      });
    }

    // Set status to Cancelled (document is preserved in MongoDB)
    request.status = "Cancelled";
    request.statusHistory.push({
      status: "Cancelled",
      changedBy: req.user._id,
      changedAt: new Date(),
      note: "Request cancelled by customer.",
    });

    await request.save();
    await request.populate("customer", "name email phone");

    return res.status(200).json({
      success: true,
      message: "Service request cancelled successfully.",
      data: request,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Request ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || "Server error cancelling request.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 PART 2: PROVIDER REQUEST MANAGEMENT OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

// ── 7. VIEW AVAILABLE SERVICE REQUESTS (GET /api/requests/available) ─────────
// Restricted to: Authenticated Providers
const getAvailableRequests = async (req, res) => {
  try {
    // A. Check if the provider has created a provider profile
    const providerProfile = await Provider.findOne({ user: req.user._id });
    if (!providerProfile) {
      return res.status(404).json({
        success: false,
        error: "Provider profile not found. Please create your profile first at POST /api/providers/profile.",
      });
    }

    // B. Build query: Must be "Pending" and unassigned (provider === null)
    const filter = {
      status: "Pending",
      provider: null,
    };

    // Filter strictly by provider's category (matching service OR AI detected category)
    const providerService =
      req.query.service ||
      providerProfile.service ||
      (providerProfile.services && providerProfile.services[0]);

    if (req.query.all !== "true" && providerService && providerService !== "All") {
      filter.$or = [
        { service: { $regex: providerService, $options: "i" } },
        { aiCategory: { $regex: providerService, $options: "i" } },
      ];
    } else if (req.query.service && req.query.service !== "All") {
      filter.$or = [
        { service: { $regex: req.query.service, $options: "i" } },
        { aiCategory: { $regex: req.query.service, $options: "i" } },
      ];
    }

    const availableRequests = await ServiceRequest.find(filter)
      .populate("customer", "name email phone location")
      .sort({ createdAt: -1 });

    // Fetch provider's active accepted/in-progress jobs to flag schedule conflicts
    const activeJobs = await ServiceRequest.find({
      provider: req.user._id,
      status: { $in: ["Accepted", "On the Way", "In Progress"] },
    });

    const requestsWithConflictInfo = availableRequests.map((r) => {
      const rObj = r.toObject();
      const conflict = activeJobs.find(
        (j) =>
          j.preferredDate &&
          r.preferredDate &&
          j.preferredDate === r.preferredDate &&
          j.preferredTime &&
          r.preferredTime &&
          j.preferredTime === r.preferredTime
      );
      rObj.hasScheduleConflict = !!conflict;
      rObj.conflictJobTitle = conflict ? conflict.title : null;
      return rObj;
    });

    return res.status(200).json({
      success: true,
      count: requestsWithConflictInfo.length,
      providerSkill: providerService || "General",
      data: requestsWithConflictInfo,
    });
  } catch (error) {
    console.error("Get Available Requests Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching available requests.",
    });
  }
};

// ── 8. ACCEPT SERVICE REQUEST (PATCH /api/requests/:id/accept) ───────────────
// Restricted to: Authenticated Providers
const acceptRequest = async (req, res) => {
  try {
    // A. Check provider profile existence
    const providerProfile = await Provider.findOne({ user: req.user._id });
    if (!providerProfile) {
      return res.status(404).json({
        success: false,
        error: "Provider profile not found. Please create a provider profile first.",
      });
    }

    // B. Verification Check: Provider must be verified by Admin
    if (providerProfile.verificationStatus !== "Verified") {
      return res.status(403).json({
        success: false,
        error: `Only verified providers can accept service requests. Your verification status is currently: '${providerProfile.verificationStatus}'.`,
      });
    }

    // C. Availability Check: Provider must be marked available
    if (!providerProfile.availability) {
      return res.status(400).json({
        success: false,
        error: "You are currently marked as unavailable or busy with an active job. Please update your availability or finish your active job to accept new requests.",
      });
    }

    // D. Fetch the requested booking
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: `Service request not found with ID: ${req.params.id}`,
      });
    }

    // E. Prevent accepting non-pending or already accepted requests
    if (request.status === "Accepted" || request.provider !== null) {
      return res.status(400).json({
        success: false,
        error: "This service request has already been accepted by another service provider.",
      });
    }

    if (request.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        error: "Cannot accept a cancelled service request.",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        error: `Cannot accept request because its status is: '${request.status}'.`,
      });
    }

    // F. SCHEDULE CONFLICT CHECK: Cannot take multiple jobs on the same date and time
    if (request.preferredDate && request.preferredTime) {
      const conflictJob = await ServiceRequest.findOne({
        provider: req.user._id,
        status: { $in: ["Accepted", "On the Way", "In Progress"] },
        _id: { $ne: request._id },
        preferredDate: request.preferredDate,
        preferredTime: request.preferredTime,
      });

      if (conflictJob) {
        return res.status(400).json({
          success: false,
          error: `Schedule Conflict: You already have an active job ("${conflictJob.title}") scheduled on ${request.preferredDate} at ${request.preferredTime}. You cannot accept multiple bookings for the same date and time.`,
        });
      }
    }

    // G. Assign Provider, update status to "Accepted", and log history
    request.provider = req.user._id;
    request.status = "Accepted";
    request.statusHistory.push({
      status: "Accepted",
      changedBy: req.user._id,
      changedAt: new Date(),
      note: "Request accepted by service provider.",
    });

    await request.save();

    await request.populate("customer", "name email phone");
    await request.populate("provider", "name email phone");

    // 🔔 Send Real-Time Notifications
    // 1. To Customer
    sendNotification({
      recipient: request.customer._id,
      recipientRole: "customer",
      title: "Request Accepted!",
      message: `${req.user.name} accepted your "${request.title}" booking. You can now track live job progress.`,
      type: "booking",
      link: `/request/${request._id}`,
      metadata: { requestId: request._id, providerId: req.user._id },
    });

    // 2. To Provider
    sendNotification({
      recipient: req.user._id,
      recipientRole: "provider",
      title: "Job Accepted",
      message: `You accepted "${request.title}". Scheduled on ${request.preferredDate || "Requested Time"}.`,
      type: "booking",
      link: `/provider/jobs`,
      metadata: { requestId: request._id },
    });

    return res.status(200).json({
      success: true,
      message: "Service request accepted successfully! The job is now assigned to you.",
      data: request,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Request ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || "Server error accepting request.",
    });
  }
};

// ── 9. GET PROVIDER'S ASSIGNED REQUESTS (GET /api/requests/provider) ─────────
// Restricted to: Authenticated Providers
const getProviderRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ provider: req.user._id })
      .populate("customer", "name email phone location")
      .populate("provider", "name email phone")
      .populate("statusHistory.changedBy", "name role")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Get Provider Requests Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching assigned jobs.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 PART 3: STATUS WORKFLOW TRANSITION & AUTO-AVAILABILITY
// ─────────────────────────────────────────────────────────────────────────────

// ── 10. UPDATE REQUEST STATUS (PATCH /api/requests/:id/status) ───────────────
// Restricted to: Assigned Provider (or Admin)
const updateRequestStatus = async (req, res) => {
  try {
    const { status: newStatus, note } = req.body;

    // A. Validation: Check new status
    if (!newStatus) {
      return res.status(400).json({
        success: false,
        error: "Please provide 'status' (e.g. 'In Progress', 'On the Way', 'Completed').",
      });
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: `Service request not found with ID: ${req.params.id}`,
      });
    }

    // B. Authorization: Only the assigned provider (or Admin) can update status
    if (req.user.role === "provider") {
      if (!request.provider || request.provider.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: "Forbidden: You can only update the status of jobs assigned to you.",
        });
      }
    }

    const currentStatus = request.status;

    // C. Validate Status Transition against State Machine
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status transition: Cannot change status from '${currentStatus}' to '${newStatus}'. Allowed next states from '${currentStatus}' are: [${allowedTransitions.join(", ")}].`,
      });
    }

    // D. Update Status & Log Audit Trail
    request.status = newStatus;
    request.statusHistory.push({
      status: newStatus,
      changedBy: req.user._id,
      changedAt: new Date(),
      note: note || `Status updated to ${newStatus} by ${req.user.name}`,
    });

    await request.save();

    // E. AUTO-AVAILABILITY / AUTO-BUSY STATE MANAGEMENT:
    // When a job becomes 'In Progress' or 'On the Way', provider automatically goes busy (availability = false).
    // When job is marked 'Completed' or 'Cancelled', provider availability automatically resets to available (true).
    if (request.provider) {
      if (["In Progress", "On the Way"].includes(newStatus)) {
        await Provider.findOneAndUpdate(
          { user: request.provider },
          { availability: false }
        );
      } else if (["Completed", "Cancelled"].includes(newStatus)) {
        // Check if there are any other ongoing jobs for this provider
        const ongoingJobs = await ServiceRequest.countDocuments({
          provider: request.provider,
          status: { $in: ["In Progress", "On the Way"] },
          _id: { $ne: request._id },
        });

        if (ongoingJobs === 0) {
          await Provider.findOneAndUpdate(
            { user: request.provider },
            { availability: true }
          );
        }
      }
    }

    await request.populate("customer", "name email phone location");
    await request.populate("provider", "name email phone");
    await request.populate("statusHistory.changedBy", "name role");

    // 🔔 Send Real-Time Notifications on status updates
    if (request.customer) {
      sendNotification({
        recipient: request.customer._id,
        recipientRole: "customer",
        title: `Booking Status: ${newStatus}`,
        message: `Your request "${request.title}" is now "${newStatus}". ${note ? `Note: ${note}` : ""}`,
        type: "status_update",
        link: `/request/${request._id}`,
        metadata: { requestId: request._id, status: newStatus },
      });
    }

    if (request.provider && req.user.role === "admin") {
      sendNotification({
        recipient: request.provider._id,
        recipientRole: "provider",
        title: `Job Status Updated by Admin: ${newStatus}`,
        message: `Admin updated request "${request.title}" to "${newStatus}".`,
        type: "status_update",
        link: `/provider/jobs`,
        metadata: { requestId: request._id, status: newStatus },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Request status successfully updated to '${newStatus}'!`,
      data: request,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid Request ID format.",
      });
    }
    return res.status(500).json({
      success: false,
      error: error.message || "Server error updating request status.",
    });
  }
};

// ── 11. GET ALL PLATFORM REQUESTS (GET /api/requests/all) ───────────────────
// Restricted to: Admin ONLY
const getAllRequestsAdmin = async (req, res) => {
  try {
    const { status, service, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (service) filter.service = { $regex: service, $options: "i" };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const requests = await ServiceRequest.find(filter)
      .populate("customer", "name email phone location")
      .populate("provider", "name email phone")
      .populate("statusHistory.changedBy", "name role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Admin Get All Requests Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching all requests for admin.",
    });
  }
};

module.exports = {
  createRequest,
  classifyRequestPreview,
  getMyRequests,
  getRequestById,
  updateRequest,
  cancelRequest,
  getAvailableRequests,
  acceptRequest,
  getProviderRequests,
  updateRequestStatus,
  getAllRequestsAdmin,
};
