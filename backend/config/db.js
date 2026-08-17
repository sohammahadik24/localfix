// ─────────────────────────────────────────────────────────────────────────────
// backend/config/db.js
//
// WHAT IS THIS FILE?
//   Database connection module for LocalFix using Mongoose.
//   Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js.
//
// HOW IT WORKS:
//   1. Reads the MONGO_URI string from the .env file.
//   2. Uses mongoose.connect() to establish an asynchronous connection.
//   3. Catches and logs any connection errors with troubleshooting hints.
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // 1. Get the MongoDB URI from environment variables (or use local fallback)
    const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/localfix";

    // 2. Connect to MongoDB
    const conn = await mongoose.connect(connUri);

    // 3. Log clear success message
    console.log(`=========================================`);
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📦 Database Host: ${conn.connection.host}`);
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`=========================================`);
  } catch (error) {
    // 4. Log detailed error if connection fails
    console.error(`=========================================`);
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: Make sure MongoDB Community Server is running.`);
    console.error(`   Windows Service Command: net start MongoDB`);
    console.error(`=========================================`);

    // Exit Node process with failure code if database fails to connect
    process.exit(1);
  }
};

module.exports = connectDB;
