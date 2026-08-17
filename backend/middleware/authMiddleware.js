// ─────────────────────────────────────────────────────────────────────────────
// backend/middleware/authMiddleware.js
//
// WHAT IS THIS FILE?
//   Authentication & Role-Based Authorization Middleware for LocalFix.
//
// HOW IT WORKS:
//   1. 'protect'   → Checks incoming request headers for a valid JWT Bearer token,
//                    verifies it, and attaches the authenticated user to 'req.user'.
//   2. 'authorize' → Restricts route access to specific roles (customer/provider/admin).
// ─────────────────────────────────────────────────────────────────────────────

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── 1. PROTECT MIDDLEWARE (JWT Authentication) ──────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and begins with 'Bearer '
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract the raw token string: "Bearer <token>" -> "<token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB using decoded ID, excluding the password field
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "User belonging to this token no longer exists.",
        });
      }

      // User verified! Move to the next middleware or controller
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({
        success: false,
        error: "Not authorized, invalid or expired token.",
      });
    }
  }

  // If no token was found in the Authorization header
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized, no token provided. Please include 'Bearer <token>' in header.",
    });
  }
};

// ── 2. AUTHORIZE MIDDLEWARE (Role-Based Access Control) ──────────────────────
// Higher-order function that accepts allowed roles e.g. authorize("provider", "admin")
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user was populated by the 'protect' middleware right before this
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: User role '${req.user ? req.user.role : "unknown"}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
