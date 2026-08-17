// ─────────────────────────────────────────────────────────────────────────────
// backend/test_standout_5_features.js
// Complete Verification Suite for ALL 5 Standout Features (25 Exact Test Scenarios)
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

async function runTestScenario() {
  console.log("==================================================================");
  console.log("🚀 TESTING ALL 5 STANDOUT FEATURES (25 EXACT USER SCENARIOS)");
  console.log("==================================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [SCENARIO ${total}] ${message}`);
      passed++;
    } else {
      console.error(`❌ [SCENARIO ${total}] ${message}`);
    }
  }

  try {
    const timestamp = Date.now();

    // ── 1. REGISTER CUSTOMER ──────────────────────────────────────────────────
    console.log("\n--- STEP 1: Register Customer ---");
    const custEmail = `cust_5feat_${timestamp}@test.com`;
    const custRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Aman Gupta",
        email: custEmail,
        password: "password123",
        role: "customer",
        phone: "9876543210",
      }),
    });
    const custRegData = await custRegRes.json();
    assert(custRegRes.status === 201 && custRegData.success, "Customer registered successfully");
    const customerToken = custRegData.token || custRegData.data?.token;

    // ── 2. REGISTER PROVIDER ──────────────────────────────────────────────────
    console.log("\n--- STEP 2: Register Provider ---");
    const provEmail = `prov_5feat_${timestamp}@test.com`;
    const provRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Sunil AC Pro",
        email: provEmail,
        password: "password123",
        role: "provider",
        phone: "9876543211",
      }),
    });
    const provRegData = await provRegRes.json();
    assert(provRegRes.status === 201 && provRegData.success, "Provider registered successfully");

    // ── 3. LOGIN AS PROVIDER ──────────────────────────────────────────────────
    console.log("\n--- STEP 3: Login as Provider ---");
    const provLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: provEmail,
        password: "password123",
      }),
    });
    const provLoginData = await provLoginRes.json();
    assert(provLoginRes.status === 200 && !!provLoginData.token, "Provider logged in and received JWT");
    const providerToken = provLoginData.token;

    // Create provider profile
    const profileRes = await fetch(`${API_BASE}/providers/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({
        service: "AC Repair",
        location: "Mumbai",
        description: "Certified AC technician.",
      }),
    });
    const profileData = await profileRes.json();
    const providerProfileId = profileData.data._id;

    // ── 4. VERIFY PROVIDER IS INITIALLY PENDING ───────────────────────────────
    console.log("\n--- STEP 4: Verify Provider Initial Status is Pending ---");
    const provMeRes = await fetch(`${API_BASE}/providers/me`, {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    const provMeData = await provMeRes.json();
    assert(
      provMeRes.status === 200 &&
        (provMeData.data.verificationStatus === "Pending" || provMeData.data.isVerified === "Pending"),
      `Provider verification status is initially 'Pending' (Actual: ${provMeData.data.verificationStatus})`
    );

    // ── 5. LOGIN AS ADMIN ─────────────────────────────────────────────────────
    console.log("\n--- STEP 5: Login as Admin ---");
    const adminEmail = `admin_5feat_${timestamp}@test.com`;
    const adminRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "LocalFix Super Admin",
        email: adminEmail,
        password: "password123",
        role: "admin",
        phone: "9876543212",
      }),
    });
    const adminRegData = await adminRegRes.json();
    const adminToken = adminRegData.token || adminRegData.data?.token;
    assert(!!adminToken, "Admin authenticated with admin credentials and JWT");

    // ── 6. ADMIN VERIFIES PROVIDER ────────────────────────────────────────────
    console.log("\n--- STEP 6: Admin Verifies Provider ---");
    const verifyRes = await fetch(`${API_BASE}/providers/${providerProfileId}/verify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ verificationStatus: "Verified" }),
    });
    const verifyData = await verifyRes.json();
    assert(
      verifyRes.status === 200 &&
        (verifyData.data.verificationStatus === "Verified" || verifyData.data.isVerified === "Verified"),
      "Admin updated provider status to 'Verified'"
    );

    // ── 7. PROVIDER SETS AVAILABILITY = TRUE ──────────────────────────────────
    console.log("\n--- STEP 7: Provider Sets Availability = True ---");
    const availToggleRes = await fetch(`${API_BASE}/providers/me/availability`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ availability: true }),
    });
    const availToggleData = await availToggleRes.json();
    assert(
      availToggleRes.status === 200 && availToggleData.data.availability === true,
      "Provider toggled availability to true (Available)"
    );

    // ── 8. CUSTOMER CREATES REQUEST: 'My AC is running but it isn't cooling.' ─
    console.log("\n--- STEP 8: Customer Creates AC Request ---");
    const acReqRes = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        title: "AC cooling issue",
        service: "AC Repair",
        description: "My AC is running but it isn't cooling.",
        location: "Flat 201, Green Heights, Andheri, Mumbai",
        preferredDate: "2026-08-25",
        preferredTime: "10:00",
      }),
    });
    const acReqData = await acReqRes.json();
    assert(acReqRes.status === 201 && acReqData.success, "Customer created AC service request");
    const requestId = acReqData.data._id;

    // ── 9. CONFIRM AI RETURNS 'AC Repair' ─────────────────────────────────────
    console.log("\n--- STEP 9: Confirm AI Category is 'AC Repair' ---");
    assert(
      acReqData.data.aiCategory === "AC Repair" &&
        acReqData.aiClassification.detectedCategory === "AC Repair",
      `AI Classifier identified category as 'AC Repair' (Actual: ${acReqData.data.aiCategory})`
    );

    // ── 10. CONFIRM REQUEST STATUS = PENDING ──────────────────────────────────
    console.log("\n--- STEP 10: Confirm Request Status = Pending ---");
    assert(acReqData.data.status === "Pending", "Service request initial status is 'Pending'");

    // ── 11. PROVIDER VIEWS AVAILABLE REQUESTS ─────────────────────────────────
    console.log("\n--- STEP 11: Provider Views Available Requests ---");
    const availListRes = await fetch(`${API_BASE}/requests/available?all=true`, {
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    const availListData = await availListRes.json();
    const isPresent = availListData.data.some((r) => r._id === requestId);
    assert(isPresent, "Created AC service request appears in provider's open available requests");

    // ── 12. PROVIDER ACCEPTS REQUEST ──────────────────────────────────────────
    console.log("\n--- STEP 12: Provider Accepts Request ---");
    const acceptRes = await fetch(`${API_BASE}/requests/${requestId}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    const acceptData = await acceptRes.json();
    assert(acceptRes.status === 200, "Provider accepted service request successfully");

    // ── 13. CONFIRM STATUS = ACCEPTED ─────────────────────────────────────────
    console.log("\n--- STEP 13: Confirm Status = Accepted ---");
    assert(acceptData.data.status === "Accepted", "Request status transitioned to 'Accepted'");

    // ── 14. PROVIDER CHANGES STATUS → IN PROGRESS ─────────────────────────────
    console.log("\n--- STEP 14: Provider Status → In Progress ---");
    const inProgRes = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ status: "In Progress", note: "Starting inspection of AC unit." }),
    });
    const inProgData = await inProgRes.json();
    assert(
      inProgRes.status === 200 && inProgData.data.status === "In Progress",
      "Provider updated request status to 'In Progress'"
    );

    // ── 15. PROVIDER CHANGES STATUS → ON THE WAY ──────────────────────────────
    console.log("\n--- STEP 15: Provider Status → On the Way ---");
    const onWayRes = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ status: "On the Way", note: "Technician dispatched and traveling." }),
    });
    const onWayData = await onWayRes.json();
    assert(
      onWayRes.status === 200 && onWayData.data.status === "On the Way",
      "Provider updated request status to 'On the Way'"
    );

    // ── 16. CUSTOMER CHECKS REQUEST AND SEES 'On the Way' ─────────────────────
    console.log("\n--- STEP 16: Customer Views 'On the Way' ---");
    const custViewRes = await fetch(`${API_BASE}/requests/${requestId}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    const custViewData = await custViewRes.json();
    assert(
      custViewRes.status === 200 && custViewData.data.status === "On the Way",
      "Customer viewed request details and confirmed live status is 'On the Way'"
    );

    // ── 17. PROVIDER CHANGES STATUS → COMPLETED ───────────────────────────────
    console.log("\n--- STEP 17: Provider Status → Completed ---");
    const compRes = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ status: "Completed", note: "AC gas refilled and filters cleaned." }),
    });
    const compData = await compRes.json();
    assert(
      compRes.status === 200 && compData.data.status === "Completed",
      "Provider marked request status as 'Completed'"
    );

    // ── 18. CUSTOMER SUBMITS RATING AND REVIEW ────────────────────────────────
    console.log("\n--- STEP 18: Customer Submits Rating & Review ---");
    const reviewRes = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        requestId: requestId,
        rating: 5,
        comment: "Excellent AC cooling restored immediately! Highly recommend Sunil.",
      }),
    });
    const reviewData = await reviewRes.json();
    assert(reviewRes.status === 201 && reviewData.success, "Customer submitted 5-star review on completed request");

    // ── 19. CONFIRM PROVIDER'S AVERAGE RATING UPDATES ─────────────────────────
    console.log("\n--- STEP 19: Confirm Provider Average Rating Updates ---");
    const revListRes = await fetch(`${API_BASE}/providers/${providerProfileId}/reviews`);
    const revListData = await revListRes.json();
    assert(
      revListRes.status === 200 && (revListData.averageRating === 5 || revListData.data?.averageRating === 5),
      `Provider average rating updated to 5.0 (Actual: ${revListData.averageRating || revListData.data?.averageRating})`
    );

    // ── 20. TEST DUPLICATE REVIEW IS REJECTED (409 Conflict) ──────────────────
    console.log("\n--- STEP 20: Test Duplicate Review Rejected ---");
    const dupReviewRes = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        requestId: requestId,
        rating: 4,
        comment: "Duplicate attempt",
      }),
    });
    assert(dupReviewRes.status === 409, "Duplicate review on same request was rejected with 409 Conflict");

    // ── 21. TEST UNAVAILABLE PROVIDER CANNOT ACCEPT (400 Bad Request) ─────────
    console.log("\n--- STEP 21: Test Unavailable Provider Cannot Accept ---");
    // Create new pending request
    const pendingReqRes1 = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        title: "Tap fix",
        service: "Plumbing",
        description: "Leaking bathroom pipe",
        location: "Mumbai",
      }),
    });
    const pendingReqData1 = await pendingReqRes1.json();
    const req1Id = pendingReqData1.data._id;

    // Toggle provider availability to false
    await fetch(`${API_BASE}/providers/me/availability`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ availability: false }),
    });

    // Attempt accept while unavailable
    const unavailAcceptRes = await fetch(`${API_BASE}/requests/${req1Id}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    assert(unavailAcceptRes.status === 400, "Unavailable provider blocked from accepting request (400 Bad Request)");

    // ── 22. TEST UNVERIFIED PROVIDER CANNOT ACCEPT (403 Forbidden) ────────────
    console.log("\n--- STEP 22: Test Unverified Provider Cannot Accept ---");
    // Register new unverified provider
    const unvEmail = `unv_prov_${timestamp}@test.com`;
    const unvRegRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Unverified Pro",
        email: unvEmail,
        password: "password123",
        role: "provider",
        phone: "9876543299",
      }),
    });
    const unvRegData = await unvRegRes.json();
    const unvToken = unvRegData.token || unvRegData.data?.token;
    await fetch(`${API_BASE}/providers/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${unvToken}` },
      body: JSON.stringify({ service: "Plumbing", location: "Mumbai" }),
    });

    const unvAcceptRes = await fetch(`${API_BASE}/requests/${req1Id}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${unvToken}` },
    });
    assert(unvAcceptRes.status === 403, "Unverified provider blocked from accepting request (403 Forbidden)");

    // ── 23. TEST INVALID STATUS TRANSITIONS (400 Bad Request) ─────────────────
    console.log("\n--- STEP 23: Test Invalid Status Transitions ---");
    // Attempt invalid transition: Completed request -> Pending
    const invalidTransRes = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ status: "Pending" }),
    });
    assert(invalidTransRes.status === 400, "Invalid status transition (Completed → Pending) rejected with 400 Bad Request");

    // ── 24. TEST UNAUTHORIZED ACCESS & ROLE RESTRICTIONS (403 Forbidden) ───────
    console.log("\n--- STEP 24: Test Unauthorized Access ---");
    // Customer cannot accept a request
    const custAcceptRes = await fetch(`${API_BASE}/requests/${req1Id}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(custAcceptRes.status === 403, "Customer cannot accept service requests (403 Forbidden)");

    // Provider cannot create customer requests
    const provCreateRes = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ title: "Bad", service: "Plumbing", description: "Bad", location: "Mumbai" }),
    });
    assert(provCreateRes.status === 403, "Provider cannot create customer requests (403 Forbidden)");

    // ── 25. TEST MISSING OR INVALID JWT (401 Unauthorized) ────────────────────
    console.log("\n--- STEP 25: Test Missing / Invalid JWT ---");
    const noAuthRes = await fetch(`${API_BASE}/requests/my`, {
      headers: {},
    });
    const badAuthRes = await fetch(`${API_BASE}/requests/my`, {
      headers: { Authorization: "Bearer invalid.jwt.token" },
    });
    assert(noAuthRes.status === 401 && badAuthRes.status === 401, "Missing or invalid JWT rejected with 401 Unauthorized");

    console.log("\n==================================================================");
    console.log(`📊 FINAL RESULT: ${passed} / ${total} SCENARIOS PASSED`);
    console.log("==================================================================");

    if (passed === total) {
      console.log("🎉 ALL 5 STANDOUT FEATURES AND ALL 25 SCENARIOS PASSED 100%!");
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

runTestScenario();
