// ─────────────────────────────────────────────────────────────────────────────
// backend/server.js
//
// STEP 2: Express.js Routes & Middleware in LocalFix
// ─────────────────────────────────────────────────────────────────────────────

// 1. Load environment variables (.env)
require("dotenv").config();

// 2. Import Express & CORS framework
const express = require("express");
const cors = require("cors");

// 3. Import Database Connection Module
const connectDB = require("./config/db");

// 4. Create Express application instance
const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 PART 1: CUSTOM & BUILT-IN MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

// A. Enable Cross-Origin Resource Sharing for React Frontend
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

// B. Built-in Middleware: JSON Body Parser
// Allows Express to read incoming JSON data sent in POST/PUT request bodies
app.use(express.json());

// B. Custom Middleware: Request Logger
// This function runs automatically for EVERY incoming request before it reaches any route.
// 'req'  = incoming request data (method, url, headers, body)
// 'res'  = outgoing response object
// 'next' = function that tells Express: "I'm done, pass this request to the next handler!"
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`📡 [${timestamp}] ${req.method} request received at: ${req.originalUrl}`);

  // CRITICAL: Always call next() or the browser will hang forever waiting for a response!
  next();
};

// Apply our custom logger middleware to all routes
app.use(requestLogger);

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 PART 2: STATIC IN-MEMORY DATA (Mock Database for Step 2)
// ─────────────────────────────────────────────────────────────────────────────

const services = [
  { id: 1, name: "Plumbing", description: "Pipe leakage, tap fixes, and drainage", providersCount: 12 },
  { id: 2, name: "Electrical", description: "Wiring, switchboard fixes, and fan mounting", providersCount: 9 },
  { id: 3, name: "AC Repair", description: "Servicing, gas refill, and cooling issues", providersCount: 6 },
  { id: 4, name: "Cleaning", description: "Full home deep cleaning & sanitisation", providersCount: 15 },
];

const serviceRequests = [
  { id: 101, title: "Kitchen Tap Leakage", service: "Plumbing", customerName: "Soham Mahadik", status: "Pending" },
  { id: 102, title: "Master Bed Switchboard Fix", service: "Electrical", customerName: "Amit Shah", status: "Accepted" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 PART 3: API ROUTES (GET & POST)
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. HEALTH CHECK (GET /) ───────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    project: "LocalFix API",
    status: "Online",
    version: "1.0.0",
    message: "Welcome to the LocalFix Backend Server!",
  });
});

// ── 2. AUTHENTICATION & USER ROUTES ──────────────────────────────────────────
// Mount all authentication routes at /api/auth (register, login, me, role-checks)
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ── 3. PROVIDER MANAGEMENT ROUTES ────────────────────────────────────────────
// Mount provider profile, availability, filter list, and admin verification routes
const providerRoutes = require("./routes/providerRoutes");
app.use("/api/providers", providerRoutes);

// ── 4. CUSTOMER SERVICE REQUEST ROUTES ───────────────────────────────────────
// Mount customer booking creation, retrieval, updates, and cancellations
const requestRoutes = require("./routes/requestRoutes");
app.use("/api/requests", requestRoutes);

// ── 5. RATINGS & REVIEWS ROUTES (STEP 10) ───────────────────────────────────
// Mount customer reviews and ratings routes
const reviewRoutes = require("./routes/reviewRoutes");
app.use("/api/reviews", reviewRoutes);

// ── 6. SUPPORT & PROBLEM TICKETS ROUTES ──────────────────────────────────────
// Mount customer and provider issues & problem reports routes
const supportRoutes = require("./routes/supportRoutes");
app.use("/api/support", supportRoutes);

// ── 7. NOTIFICATIONS ROUTES ──────────────────────────────────────────────────
// Mount notifications query, read-status, and broadcast routes
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/notifications", notificationRoutes);

// ── 8. GET ROUTE: Fetch All Services (GET /api/services) ──────────────────────
// Used by the Frontend "Find a Service" page to display available categories
app.get("/api/services", (req, res) => {
  // res.status(200) means "HTTP OK" (Success)
  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

// ── 8. FALLBACK 404 ROUTE FOR UNRECOGNIZED ENDPOINTS ─────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found on LocalFix server.`,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 🌟 PART 4: CONNECT DATABASE & START SERVER
// ─────────────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

// Async function to connect to MongoDB FIRST, then start Express
const startServer = async () => {
  try {
    // 1. Establish MongoDB connection
    await connectDB();

    // 2. Start listening on the port
    app.listen(PORT, () => {
      console.log(`🚀 LocalFix Server running on port: ${PORT}`);
      console.log(`📡 GET  Services: http://localhost:${PORT}/api/services`);
      console.log(`📡 POST Requests: http://localhost:${PORT}/api/requests`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
  }
};

// Execute startup
startServer();
