// ─────────────────────────────────────────────────────────────────────────────
// backend/controllers/authController.js
//
// WHAT IS THIS FILE?
//   Authentication Controller containing business logic for:
//     1. User Registration (Hashing password with bcrypt, saving to MongoDB)
//     2. User Login        (Comparing hashed password, issuing JWT token)
//     3. Get Current User  (Returning profile of authenticated user from req.user)
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── HELPER: Generate JWT Token ───────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// ── 1. REGISTER USER (POST /api/auth/register) ───────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // A. Validation: Check required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        error: "Please provide all required fields: name, email, password, and phone.",
      });
    }

    // Email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address format.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long.",
      });
    }

    // Role validation
    if (role && !["customer", "provider", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role '${role}'. Allowed roles are: 'customer', 'provider', 'admin'.`,
      });
    }

    // B. Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(409).json({
        success: false,
        error: "A user with this email address already exists. Please login instead.",
      });
    }

    // C. Hash password using bcryptjs (Salt rounds: 10)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // D. Create and save new user in MongoDB
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword, // Store ONLY the hashed password
      phone,
      role: role || "customer",
    });

    // E. Generate JWT Token
    const token = generateToken(user._id);

    // F. Return success response (never return password)
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "A user with this email address already exists.",
      });
    }
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error during registration.",
    });
  }
};

// ── 2. LOGIN USER (POST /api/auth/login) ─────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide both email and password.",
      });
    }

    // B. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // C. Verify password using bcrypt.compare() with auto-upgrade for legacy plain-text
    let isPasswordMatch = false;
    if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
      isPasswordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plain-text password match & auto-upgrade to bcrypt
      isPasswordMatch = (password === user.password);
      if (isPasswordMatch) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
      }
    }

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // D. Generate JWT Token
    const token = generateToken(user._id);

    // E. Return success response with token & user info
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Server error during login.",
    });
  }
};

// ── 3. GET CURRENT USER PROFILE (GET /api/auth/me) ───────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is automatically attached by the 'protect' middleware!
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Server error fetching user profile.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
