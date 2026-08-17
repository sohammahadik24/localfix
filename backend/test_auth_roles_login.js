// ─────────────────────────────────────────────────────────────────────────────
// backend/test_auth_roles_login.js
// Verification of Unified Login & Role-Based Access Control for all 3 Roles
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

async function testAllThreeRoles() {
  console.log("==================================================================");
  console.log("🚀 TESTING UNIFIED LOGIN & ROLE-BASED ACCESS CONTROL (3 ROLES)");
  console.log("==================================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [TEST ${total}] ${message}`);
      passed++;
    } else {
      console.error(`❌ [TEST ${total}] ${message}`);
    }
  }

  try {
    const timestamp = Date.now();

    // ── 1. CUSTOMER LOGIN FLOW ────────────────────────────────────────────────
    console.log("\n--- 1. CUSTOMER LOGIN FLOW ---");
    const custEmail = `customer_auth_${timestamp}@localfix.com`;
    const custRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Aarav Customer",
        email: custEmail,
        password: "password123",
        role: "customer",
        phone: "9876500111",
      }),
    });
    const custRegData = await custRegRes.json();
    assert(custRegRes.status === 201, "Customer registered successfully");

    // Login via standard Login API
    const custLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: custEmail, password: "password123" }),
    });
    const custLoginData = await custLoginRes.json();
    assert(custLoginRes.status === 200 && custLoginData.success, "Customer logged in via unified login API");
    assert(custLoginData.user.role === "customer", `Customer role returned as 'customer' -> Routes to /dashboard (Actual: ${custLoginData.user.role})`);
    const customerToken = custLoginData.token;

    // ── 2. PROVIDER LOGIN FLOW ────────────────────────────────────────────────
    console.log("\n--- 2. PROVIDER LOGIN FLOW ---");
    const provEmail = `provider_auth_${timestamp}@localfix.com`;
    const provRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Vijay Plumber",
        email: provEmail,
        password: "password123",
        role: "provider",
        phone: "9876500222",
      }),
    });
    const provRegData = await provRegRes.json();
    assert(provRegRes.status === 201, "Provider registered successfully");

    // Login via same Login API
    const provLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: provEmail, password: "password123" }),
    });
    const provLoginData = await provLoginRes.json();
    assert(provLoginRes.status === 200 && provLoginData.success, "Provider logged in via unified login API");
    assert(provLoginData.user.role === "provider", `Provider role returned as 'provider' -> Routes to /provider/dashboard (Actual: ${provLoginData.user.role})`);
    const providerToken = provLoginData.token;

    // ── 3. ADMIN LOGIN FLOW ───────────────────────────────────────────────────
    console.log("\n--- 3. ADMIN LOGIN FLOW ---");
    const adminEmail = `admin_auth_${timestamp}@localfix.com`;
    const adminRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "LocalFix Super Admin",
        email: adminEmail,
        password: "password123",
        role: "admin",
        phone: "9876500333",
      }),
    });
    const adminRegData = await adminRegRes.json();
    assert(adminRegRes.status === 201, "Admin registered successfully");

    // Login via same Login API
    const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: "password123" }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.success, "Admin logged in via unified login API");
    assert(adminLoginData.user.role === "admin", `Admin role returned as 'admin' -> Routes to /admin (Actual: ${adminLoginData.user.role})`);
    const adminToken = adminLoginData.token;

    // Also test with default seeded admin account
    const seededAdminRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@localfix.com", password: "password123" }),
    });
    const seededAdminData = await seededAdminRes.json();
    assert(seededAdminRes.status === 200 && seededAdminData.user.role === "admin", "Seeded admin account (admin@localfix.com) returns role 'admin'");

    // ── 4. RBAC ROUTE & API PROTECTION CHECKS ─────────────────────────────────
    console.log("\n--- 4. RBAC & ROUTE PROTECTION ---");

    // Admin can access admin-only endpoint
    const adminAccessRes = await fetch(`${API_BASE}/requests/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminAccessRes.status === 200, "Admin authorized to access /api/requests/all (200 OK)");

    // Customer CANNOT access admin-only endpoint
    const custToAdminRes = await fetch(`${API_BASE}/requests/all`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(custToAdminRes.status === 403, "Customer blocked from admin endpoint (403 Forbidden)");

    // Provider CANNOT access admin-only endpoint
    const provToAdminRes = await fetch(`${API_BASE}/requests/all`, {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    assert(provToAdminRes.status === 403, "Provider blocked from admin endpoint (403 Forbidden)");

    // Unauthenticated user CANNOT access protected endpoint
    const unauthRes = await fetch(`${API_BASE}/requests/all`);
    assert(unauthRes.status === 401, "Unauthenticated user blocked (401 Unauthorized)");

    console.log("\n==================================================================");
    console.log(`📊 FINAL RESULT: ${passed} / ${total} TESTS PASSED`);
    console.log("==================================================================");

    if (passed === total) {
      console.log("🎉 ALL 3 LOGIN FLOWS & RBAC CHECKS PASSED 100%!");
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

testAllThreeRoles();
