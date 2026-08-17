// ─────────────────────────────────────────────────────────────────────────────
// scripts/start-all.js
// Runs Express Backend (:5000) and React Frontend (:3000) concurrently
// ─────────────────────────────────────────────────────────────────────────────

const { spawn } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const backendDir = path.join(rootDir, "backend");

console.log("\x1b[36m%s\x1b[0m", "==================================================");
console.log("\x1b[36m%s\x1b[0m", "🚀 LocalFix Full-Stack Launcher (Backend + Frontend)");
console.log("\x1b[36m%s\x1b[0m", "==================================================");

// 1. Spawn Backend Process (Node.js Express Server on port 5000)
console.log("\x1b[34m%s\x1b[0m", "📡 [BACKEND] Starting Express server on http://localhost:5000...");
const isWin = process.platform === "win32";

const backend = spawn(isWin ? "node.exe" : "node", ["server.js"], {
  cwd: backendDir,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, PORT: "5000" },
});

backend.on("error", (err) => {
  console.error("\x1b[31m%s\x1b[0m", `❌ [BACKEND ERROR] ${err.message}`);
});

// 2. Spawn Frontend Process (React Webpack Dev Server on port 3000)
console.log("\x1b[32m%s\x1b[0m", "💻 [FRONTEND] Starting React App on http://localhost:3000...");

const frontend = spawn(isWin ? "npm.cmd" : "npm", ["run", "client"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
  env: { ...process.env, PORT: "3000", BROWSER: "none" },
});

frontend.on("error", (err) => {
  console.error("\x1b[31m%s\x1b[0m", `❌ [FRONTEND ERROR] ${err.message}`);
});

// 3. Graceful shutdown handler
function cleanExit() {
  console.log("\n\x1b[33m%s\x1b[0m", "🛑 Shutting down LocalFix backend and frontend services...");
  try {
    if (backend && !backend.killed) backend.kill("SIGINT");
    if (frontend && !frontend.killed) frontend.kill("SIGINT");
  } catch (e) {}
  process.exit(0);
}

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);
process.on("exit", cleanExit);
