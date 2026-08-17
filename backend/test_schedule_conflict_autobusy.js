// ─────────────────────────────────────────────────────────────────────────────
// backend/test_schedule_conflict_autobusy.js
// Verification of:
//   1. Preventing multiple bookings on the same date and time (Schedule Conflict)
//   2. Auto-Busy status transition during active jobs and auto-reset on completion
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

async function testScheduleAndAutoBusy() {
  console.log("==================================================================");
  console.log("🚀 TESTING SCHEDULE CONFLICT PREVENTION & AUTO-BUSY TRANSITIONS");
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

    // 1. Register Customer
    const custEmail = `schedule_cust_${ts}@test.com`;
    const custReg = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rahul Customer",
        email: custEmail,
        password: "password123",
        role: "customer",
        phone: "9876500888",
      }),
    });
    const custData = await custReg.json();
    const custToken = custData.token;

    // 2. Register & Verify Provider
    const provEmail = `schedule_prov_${ts}@test.com`;
    const provReg = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Amit Electrician",
        email: provEmail,
        password: "password123",
        role: "provider",
        phone: "9876500999",
      }),
    });
    const provData = await provReg.json();
    const provToken = provData.token;

    const profRes = await fetch(`${API_BASE}/providers/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${provToken}` },
      body: JSON.stringify({ service: "Electrical", location: "Mumbai" }),
    });
    const profData = await profRes.json();
    const provProfileId = profData.data._id;

    // Admin verifies provider
    const adminLogin = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@localfix.com", password: "password123" }),
    });
    const adminData = await adminLogin.json();
    await fetch(`${API_BASE}/providers/${provProfileId}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminData.token}` },
      body: JSON.stringify({ verificationStatus: "Verified" }),
    });

    // 3. Customer creates Request 1: "2026-08-30" at "14:00"
    const req1Res = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${custToken}` },
      body: JSON.stringify({
        title: "Electrical Spark Fix",
        service: "Electrical",
        description: "Living room fan is sparking",
        location: "Mumbai",
        preferredDate: "2026-08-30",
        preferredTime: "14:00",
      }),
    });
    const req1Data = await req1Res.json();
    const req1Id = req1Data.data._id;

    // 4. Customer creates Request 2: SAME date and SAME time ("2026-08-30" at "14:00")
    const req2Res = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${custToken}` },
      body: JSON.stringify({
        title: "Switchboard Replacement",
        service: "Electrical",
        description: "Switchboard burnt in bedroom",
        location: "Mumbai",
        preferredDate: "2026-08-30",
        preferredTime: "14:00",
      }),
    });
    const req2Data = await req2Res.json();
    const req2Id = req2Data.data._id;

    // 5. Customer creates Request 3: DIFFERENT time ("2026-08-30" at "18:00")
    const req3Res = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${custToken}` },
      body: JSON.stringify({
        title: "MCB Trip Repair",
        service: "Electrical",
        description: "Main circuit breaker tripping",
        location: "Mumbai",
        preferredDate: "2026-08-30",
        preferredTime: "18:00",
      }),
    });
    const req3Data = await req3Res.json();
    const req3Id = req3Data.data._id;

    // ── TEST A: ACCEPT FIRST REQUEST ──────────────────────────────────────────
    console.log("\n--- TEST A: Accept First Request ---");
    const accept1 = await fetch(`${API_BASE}/requests/${req1Id}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${provToken}` },
    });
    const accept1Data = await accept1.json();
    assert(accept1.status === 200 && accept1Data.success, "Provider successfully accepted Request 1 for 2026-08-30 at 14:00");

    // ── TEST B: PREVENT CONFLICTING BOOKING ON SAME DATE & TIME ───────────────
    console.log("\n--- TEST B: Prevent Conflicting Booking (Same Date & Time) ---");
    const accept2 = await fetch(`${API_BASE}/requests/${req2Id}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${provToken}` },
    });
    const accept2Data = await accept2.json();
    assert(
      accept2.status === 400 && accept2Data.error.includes("Schedule Conflict"),
      `Blocked duplicate job on same date & time with 400 Bad Request! (Error: ${accept2Data.error})`
    );

    // ── TEST C: ACCEPT NON-CONFLICTING TIME SLOT ──────────────────────────────
    console.log("\n--- TEST C: Accept Different Time Slot ---");
    const accept3 = await fetch(`${API_BASE}/requests/${req3Id}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${provToken}` },
    });
    const accept3Data = await accept3.json();
    assert(accept3.status === 200 && accept3Data.success, "Provider successfully accepted Request 3 scheduled for a different time (18:00)");

    // ── TEST D: AUTO-BUSY STATE TRANSITION WHEN WORK STARTS ───────────────────
    console.log("\n--- TEST D: Auto-Busy Transition During Active Job ---");
    await fetch(`${API_BASE}/requests/${req1Id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${provToken}` },
      body: JSON.stringify({ status: "In Progress", note: "Starting electrical inspection." }),
    });

    const checkBusy = await fetch(`${API_BASE}/providers/me`, {
      headers: { Authorization: `Bearer ${provToken}` },
    });
    const busyData = await checkBusy.json();
    assert(
      busyData.data.availability === false,
      "Provider availability automatically marked 'false' (Busy/In Progress) during active job!"
    );

    // ── TEST E: AUTO-RESET AVAILABILITY ON COMPLETION ─────────────────────────
    console.log("\n--- TEST E: Auto-Reset Availability to Available on Job Completion ---");
    await fetch(`${API_BASE}/requests/${req1Id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${provToken}` },
      body: JSON.stringify({ status: "Completed", note: "Fixed fan wiring." }),
    });

    const checkFree = await fetch(`${API_BASE}/providers/me`, {
      headers: { Authorization: `Bearer ${provToken}` },
    });
    const freeData = await checkFree.json();
    assert(
      freeData.data.availability === true,
      "Provider availability automatically restored to 'true' (Available) once active job completed!"
    );

    console.log("\n==================================================================");
    console.log(`📊 FINAL RESULT: ${passed} / ${total} TESTS PASSED`);
    console.log("==================================================================");

    if (passed === total) {
      console.log("🎉 SCHEDULE CONFLICT PREVENTION & AUTO-BUSY FEATURES 100% OPERATIONAL!");
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  }
}

testScheduleAndAutoBusy();
