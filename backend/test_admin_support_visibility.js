// ─────────────────────────────────────────────────────────────────────────────
// backend/test_admin_support_visibility.js
// Verification of:
//   1. Customers raising problems/tickets
//   2. Providers raising problems/tickets
//   3. Admin having full visibility over all raised problems across the platform
//   4. Admin resolving tickets with resolution notes
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

async function testAdminSupportVisibility() {
  console.log("==================================================================");
  console.log("🚀 TESTING CUSTOMER & PROVIDER PROBLEM VISIBILITY IN ADMIN PORTAL");
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
    const ts = Date.now();

    // 1. Customer registration & login
    const custRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Pooja Customer",
        email: `pooja_support_${ts}@test.com`,
        password: "password123",
        role: "customer",
        phone: "9876511223",
      }),
    });
    const custData = await custRes.json();
    const custToken = custData.token;

    // 2. Provider registration & login
    const provRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Sunil Electrician",
        email: `sunil_support_${ts}@test.com`,
        password: "password123",
        role: "provider",
        phone: "9876522334",
      }),
    });
    const provData = await provRes.json();
    const provToken = provData.token;

    // 3. Admin login
    const adminLogin = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@localfix.com", password: "password123" }),
    });
    const adminData = await adminLogin.json();
    const adminToken = adminData.token;

    // ── TEST A: CUSTOMER RAISES A PROBLEM ────────────────────────────────────
    console.log("\n--- TEST A: Customer Raises a Problem ---");
    const custTicketRes = await fetch(`${API_BASE}/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${custToken}` },
      body: JSON.stringify({
        category: "Provider Delay",
        description: "Provider was 45 minutes late for plumbing service.",
      }),
    });
    const custTicketData = await custTicketRes.json();
    assert(
      custTicketRes.status === 201 && custTicketData.success,
      `Customer successfully raised problem ticket #${custTicketData.data._id}`
    );
    const custTicketId = custTicketData.data._id;

    // ── TEST B: PROVIDER RAISES A PROBLEM ────────────────────────────────────
    console.log("\n--- TEST B: Provider Raises a Problem ---");
    const provTicketRes = await fetch(`${API_BASE}/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${provToken}` },
      body: JSON.stringify({
        category: "Customer Unreachable",
        description: "Customer did not pick up phone at the address gate.",
      }),
    });
    const provTicketData = await provTicketRes.json();
    assert(
      provTicketRes.status === 201 && provTicketData.success,
      `Provider successfully raised problem ticket #${provTicketData.data._id}`
    );
    const provTicketId = provTicketData.data._id;

    // ── TEST C: ADMIN GETS ALL RAISED PROBLEMS ────────────────────────────────
    console.log("\n--- TEST C: Admin Visibility Across All Raised Problems ---");
    const adminAllTicketsRes = await fetch(`${API_BASE}/support/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminAllTicketsData = await adminAllTicketsRes.json();
    assert(
      adminAllTicketsRes.status === 200 && adminAllTicketsData.success,
      `Admin successfully retrieved all tickets (Count: ${adminAllTicketsData.count})`
    );

    const foundCustTicket = adminAllTicketsData.data.find((t) => t._id === custTicketId);
    const foundProvTicket = adminAllTicketsData.data.find((t) => t._id === provTicketId);

    assert(
      foundCustTicket && foundCustTicket.user.name === "Pooja Customer",
      "Customer problem is visible to Admin with customer name & details!"
    );
    assert(
      foundProvTicket && foundProvTicket.user.name === "Sunil Electrician",
      "Provider problem is visible to Admin with provider name & details!"
    );

    // ── TEST D: ADMIN RESOLVES TICKET WITH RESOLUTION NOTE ───────────────────
    console.log("\n--- TEST D: Admin Resolves Problem Ticket ---");
    const resolveRes = await fetch(`${API_BASE}/support/${custTicketId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: "Resolved",
        resolutionNote: "Contacted provider and credited ₹100 discount coupon to customer account.",
      }),
    });
    const resolveData = await resolveRes.json();
    assert(
      resolveRes.status === 200 && resolveData.data.status === "Resolved",
      "Admin resolved the customer problem and attached official resolution note!"
    );

    // ── TEST E: CUSTOMER SEES RESOLUTION IN THEIR DASHBOARD ───────────────────
    console.log("\n--- TEST E: Customer Sees Resolved Status and Admin Note ---");
    const custMyTicketsRes = await fetch(`${API_BASE}/support/my`, {
      headers: { Authorization: `Bearer ${custToken}` },
    });
    const custMyTicketsData = await custMyTicketsRes.json();
    const myResolvedTicket = custMyTicketsData.data.find((t) => t._id === custTicketId);
    assert(
      myResolvedTicket &&
        myResolvedTicket.status === "Resolved" &&
        myResolvedTicket.resolutionNote.includes("credited ₹100"),
      "Customer receives live status update: 'Resolved' with admin's response!"
    );

    console.log("\n==================================================================");
    console.log(`📊 FINAL RESULT: ${passed} / ${total} TESTS PASSED`);
    console.log("==================================================================");

    if (passed === total) {
      console.log("🎉 ALL CUSTOMER & PROVIDER PROBLEMS ARE VISIBLE & MANAGEABLE BY ADMIN!");
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  }
}

testAdminSupportVisibility();
