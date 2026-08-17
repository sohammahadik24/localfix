// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.js
//
// WHAT IS THIS MODULE?
//   Centralized API Client for the LocalFix React Frontend.
//   Handles all HTTP communication with the Express/Node.js backend.
//
// FEATURES:
//   - Configured via environment variable: process.env.REACT_APP_API_URL
//   - Automatically injects JWT Bearer token into Authorization headers.
//   - Standardized error handling and user-friendly error formatting.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Generic HTTP request helper function
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Read stored JWT token
  const token = localStorage.getItem("localfix_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Create user-friendly error message based on backend payload or status
      const errorMessage =
        data.error ||
        data.message ||
        `Request failed with status code ${response.status}`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Network / Server down errors
    if (!error.status) {
      error.message =
        "Cannot connect to the LocalFix server. Please ensure the backend is running on port 5000.";
    }
    throw error;
  }
}

// ── 1. AUTHENTICATION API ────────────────────────────────────────────────────
export const authAPI = {
  // Register a new customer, provider, or admin
  register: (userData) =>
    request("/auth/register", { method: "POST", body: userData }),

  // Login user and obtain JWT token
  login: (credentials) =>
    request("/auth/login", { method: "POST", body: credentials }),

  // Fetch currently authenticated user profile
  getMe: () => request("/auth/me", { method: "GET" }),
};

// ── 2. SERVICE REQUESTS API ──────────────────────────────────────────────────
export const requestsAPI = {
  // Customer creates a new service booking (auto-classified by AI)
  createRequest: (requestData) =>
    request("/requests", { method: "POST", body: requestData }),

  // Preview AI service classification for a description
  classifyPreview: (previewData) =>
    request("/requests/classify", { method: "POST", body: previewData }),

  // Customer fetches all their own bookings
  getMyRequests: () => request("/requests/my", { method: "GET" }),

  // Get single request details by ID
  getRequestById: (id) => request(`/requests/${id}`, { method: "GET" }),

  // Customer updates pending request details
  updateRequest: (id, updateData) =>
    request(`/requests/${id}`, { method: "PUT", body: updateData }),

  // Customer cancels pending booking
  cancelRequest: (id) =>
    request(`/requests/${id}/cancel`, { method: "PATCH" }),

  // Provider views available unassigned pending jobs
  getAvailableRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/requests/available${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },

  // Provider views jobs assigned to themselves
  getProviderRequests: () =>
    request("/requests/provider", { method: "GET" }),

  // Provider accepts a pending booking
  acceptRequest: (id) =>
    request(`/requests/${id}/accept`, { method: "PATCH" }),

  // Provider transitions status (In Progress, On the Way, Completed)
  updateStatus: (id, status, note = "") =>
    request(`/requests/${id}/status`, {
      method: "PATCH",
      body: { status, note },
    }),

  // Admin views all platform requests and work management
  getAllRequestsAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/requests/all${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },
};

// ── 3. PROVIDER MANAGEMENT API ───────────────────────────────────────────────
export const providersAPI = {
  // Provider creates professional profile
  createProfile: (profileData) =>
    request("/providers/profile", { method: "POST", body: profileData }),

  // Provider fetches their own profile and verification status
  getMyProfile: () => request("/providers/me", { method: "GET" }),

  // Provider updates bio, trade skills, and location
  updateMyProfile: (profileData) =>
    request("/providers/me", { method: "PUT", body: profileData }),

  // Alias for updateMyProfile
  updateProfile: (profileData) =>
    request("/providers/me", { method: "PUT", body: profileData }),

  // Provider toggles work availability (true/false)
  updateAvailability: (availability) =>
    request("/providers/me/availability", {
      method: "PATCH",
      body: { availability },
    }),

  // Public/Customer searches and filters providers
  getAllProviders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/providers${query ? `?${query}` : ""}`, { method: "GET" });
  },

  // Get single provider by ID
  getProviderById: (id) => request(`/providers/${id}`, { method: "GET" }),

  // Admin verifies or rejects a provider
  verifyProvider: (id, verificationStatus) =>
    request(`/providers/${id}/verify`, {
      method: "PATCH",
      body: { verificationStatus },
    }),

  // Get provider reviews & average rating
  getProviderReviews: (providerId) =>
    request(`/providers/${providerId}/reviews`, { method: "GET" }),
};

// ── 4. RATINGS & REVIEWS API ─────────────────────────────────────────────────
export const reviewsAPI = {
  // Customer submits rating (1-5) and feedback for a completed request
  createReview: (reviewData) =>
    request("/reviews", { method: "POST", body: reviewData }),

  // Get reviews for a specific provider
  getProviderReviews: (providerId) =>
    request(`/reviews/provider/${providerId}`, { method: "GET" }),
};

// ── 5. SERVICES & CATEGORIES API ─────────────────────────────────────────────
export const servicesAPI = {
  getServices: () => request("/services", { method: "GET" }),
};

// ── 6. SUPPORT & PROBLEM TICKETS API ─────────────────────────────────────────
export const supportAPI = {
  // Customer or Provider creates a support ticket / reports a problem
  createTicket: (ticketData) =>
    request("/support", { method: "POST", body: ticketData }),

  // User fetches their own submitted issues
  getMyTickets: () => request("/support/my", { method: "GET" }),

  // Admin fetches all platform issues raised
  getAllTicketsAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/support/all${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },

  // Admin updates ticket status and adds resolution note
  updateTicketStatus: (id, status, resolutionNote = "") =>
    request(`/support/${id}/status`, {
      method: "PATCH",
      body: { status, resolutionNote },
    }),
};

// ── 7. NOTIFICATIONS API ─────────────────────────────────────────────────────
export const notificationsAPI = {
  // Fetch logged in user's notifications (supports unreadOnly and limit)
  getMyNotifications: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/notifications${query ? `?${query}` : ""}`, { method: "GET" });
  },

  // Get count of unread notifications
  getUnreadCount: () => request("/notifications/unread-count", { method: "GET" }),

  // Mark single notification as read
  markAsRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),

  // Mark all user's notifications as read
  markAllAsRead: () => request("/notifications/read-all", { method: "PATCH" }),

  // Delete notification
  deleteNotification: (id) => request(`/notifications/${id}`, { method: "DELETE" }),

  // Admin broadcast notification
  broadcastNotification: (data) =>
    request("/notifications/broadcast", { method: "POST", body: data }),
};

const api = {
  auth: authAPI,
  requests: requestsAPI,
  providers: providersAPI,
  reviews: reviewsAPI,
  services: servicesAPI,
  support: supportAPI,
  notifications: notificationsAPI,
};

export default api;

