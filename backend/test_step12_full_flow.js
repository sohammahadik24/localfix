// ─────────────────────────────────────────────────────────────────────────────
// backend/test_step12_full_flow.js
// Complete End-to-End Test for Step 12 Full Stack Connection
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = "http://localhost:5000/api";

async function testFullFlow() {
  console.log("==================================================");
  console.log("🚀 STARTING STEP 12 END-TO-END VERIFICATION TEST");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS ${total}] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL ${total}] ${message}`);
    }
  }

  try {
    const timestamp = Date.now();

    // 1. CUSTOMER REGISTRATION & LOGIN
    console.log("\n--- 1. CUSTOMER REGISTRATION & LOGIN ---");
    const custEmail = `customer_${timestamp}@localfix.com`;
    const custRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Soham E2E Customer",
        email: custEmail,
        password: "Password@123",
        role: "customer",
        phone: "9876500001",
      }),
    });
    const custData = await custRes.json();
    assert(custRes.status === 201 && custData.success, "Customer registered successfully");
    const customerToken = custData.token || custData.data?.token;
    assert(!!customerToken, "Customer received JWT authentication token");

    // 2. PROVIDER REGISTRATION & PROFILE CREATION
    console.log("\n--- 2. PROVIDER REGISTRATION & PROFILE ---");
    const provEmail = `provider_${timestamp}@localfix.com`;
    const provRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rajesh E2E Plumber",
        email: provEmail,
        password: "Password@123",
        role: "provider",
        phone: "9876500002",
      }),
    });
    const provData = await provRes.json();
    assert(provRes.status === 201 && provData.success, "Provider registered successfully");
    const providerToken = provData.token || provData.data?.token;

    // Provider creates profile
    const profileRes = await fetch(`${API_BASE}/providers/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({
        service: "Plumbing",
        businessName: "Rajesh Express Plumbing",
        services: ["Plumbing", "Tap Repair"],
        experience: "7 Years",
        location: "Mumbai",
        description: "Expert certified residential plumbing technician.",
      }),
    });
    const profileData = await profileRes.json();
    assert(profileRes.status === 201 && profileData.success, "Provider profile created successfully");
    const providerProfileId = profileData.data._id;

    // 3. ADMIN VERIFIES PROVIDER
    console.log("\n--- 3. ADMIN VERIFIES PROVIDER ---");
    const adminEmail = `admin_${timestamp}@localfix.com`;
    const adminRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "LocalFix Admin",
        email: adminEmail,
        password: "Password@123",
        role: "admin",
        phone: "9876500003",
      }),
    });
    const adminData = await adminRes.json();
    const adminToken = adminData.token || adminData.data?.token;

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
      "Admin verified provider successfully"
    );

    // 4. CUSTOMER CREATES SERVICE REQUEST WITH AI CLASSIFICATION
    console.log("\n--- 4. CUSTOMER CREATES REQUEST & AI CLASSIFIER ---");
    const reqRes = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        title: "Kitchen Sink Leak Repair",
        service: "Plumbing",
        description: "My kitchen pipe is leaking water continuously from the main joint",
        location: "Flat 402, Green Valley, Andheri West, Mumbai",
        preferredDate: "2026-08-20",
        preferredTime: "14:00",
      }),
    });
    const reqData = await reqRes.json();
    assert(reqRes.status === 201 && reqData.success, "Customer created service request successfully");
    assert(reqData.data.aiCategory === "Plumbing", `AI classified category as 'Plumbing' (Actual: ${reqData.data.aiCategory})`);
    assert(reqData.data.status === "Pending", "Initial request status is 'Pending'");
    const requestId = reqData.data._id;

    // 5. PROVIDER BROWSES & ACCEPTS REQUEST
    console.log("\n--- 5. PROVIDER ACCEPTS REQUEST ---");
    const availRes = await fetch(`${API_BASE}/requests/available?all=true`, {
      method: "GET",
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    const availData = await availRes.json();
    const found = availData.data.some((r) => r._id === requestId);
    assert(found, "Created request appears in provider's available requests list");

    const acceptRes = await fetch(`${API_BASE}/requests/${requestId}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${providerToken}` },
    });
    const acceptData = await acceptRes.json();
    assert(acceptRes.status === 200 && acceptData.data.status === "Accepted", "Provider accepted service request");

    // 6. STATUS WORKFLOW PROGRESSION: Accepted -> On the Way -> In Progress -> Completed
    console.log("\n--- 6. STATUS WORKFLOW TRANSITIONS ---");

    // Step a: On the Way
    const onWayRes = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ status: "On the Way", note: "Driver in transit" }),
    });
    const onWayData = await onWayRes.json();
    assert(onWayRes.status === 200 && onWayData.data.status === "On the Way", "Provider updated status to 'On the Way'");

    // Step b: In Progress
    const inProgRes = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ status: "In Progress", note: "Starting repair" }),
    });
    const inProgData = await inProgRes.json();
    assert(inProgRes.status === 200 && inProgData.data.status === "In Progress", "Provider updated status to 'In Progress'");

    // Step c: Completed
    const compRes = await fetch(`${API_BASE}/requests/${requestId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ status: "Completed", note: "Work finished" }),
    });
    const compData = await compRes.json();
    assert(compRes.status === 200 && compData.data.status === "Completed", "Provider updated status to 'Completed'");
    assert(compData.data.statusHistory.length >= 4, `Status history audit trail maintained (${compData.data.statusHistory.length} events recorded)`);

    // 7. CUSTOMER REVIEWS & RATES COMPLETED SERVICE
    console.log("\n--- 7. CUSTOMER RATINGS & REVIEWS ---");
    const reviewRes = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        requestId: requestId,
        rating: 5,
        comment: "Excellent repair work! Rajesh was on time and very professional.",
      }),
    });
    const reviewData = await reviewRes.json();
    assert(reviewRes.status === 201 && reviewData.success, "Customer submitted 5-star rating & review successfully");

    // Fetch provider reviews & average rating
    const provReviewsRes = await fetch(`${API_BASE}/providers/${providerProfileId}/reviews`, {
      method: "GET",
    });
    const provReviewsData = await provReviewsRes.json();
    assert(provReviewsRes.status === 200 && provReviewsData.data.totalReviews >= 1, "Provider review count updated");
    assert(provReviewsData.data.averageRating === 5, `Provider average rating is 5.0 (Actual: ${provReviewsData.data.averageRating})`);

    // 8. SECURITY & GUARD CHECKS
    console.log("\n--- 8. SECURITY & ROLE GUARDS ---");
    // Non-customer cannot create a request
    const badReqRes = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${providerToken}`,
      },
      body: JSON.stringify({ title: "Unauthorized", service: "Plumbing", location: "Mumbai", description: "Test" }),
    });
    assert(badReqRes.status === 403, "Provider cannot create a customer service request (403 Forbidden)");

    // Customer cannot accept a request
    const badAcceptRes = await fetch(`${API_BASE}/requests/${requestId}/accept`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert(badAcceptRes.status === 403, "Customer cannot accept a request (403 Forbidden)");

    console.log("\n==================================================");
    console.log(`📊 FINAL RESULT: ${passed} / ${total} TESTS PASSED`);
    console.log("==================================================");

    if (passed === total) {
      console.log("🎉 ALL STEP 12 END-TO-END INTEGRATION TESTS PASSED!");
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

testFullFlow();
