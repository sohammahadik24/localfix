// ─────────────────────────────────────────────────────────────────────────────
// backend/models/User.js
//
// WHAT IS THIS MODEL?
//   The User model represents all registered accounts in LocalFix.
//   Both Customers, Service Providers, and Admins share this base account model.
//
// RELATIONSHIPS:
//   - A User with role="provider" is referenced by the Provider model.
//   - A User with role="customer" is referenced as 'customer' in ServiceRequest.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Full name of the user (e.g. "Soham Mahadik" or "Raj Sharma")
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Email address used for authentication and notifications
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Prevents duplicate registrations with the same email
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    // Password for account login
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },

    // Contact phone number
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Role defines permissions and portal view
    role: {
      type: String,
      enum: {
        values: ["customer", "provider", "admin"],
        message: "{VALUE} is not a valid user role",
      },
      default: "customer",
    },
  },
  {
    // Automatically adds 'createdAt' and 'updatedAt' Date fields
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
