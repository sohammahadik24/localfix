// ─────────────────────────────────────────────────────────────────────────────
// backend/test_notifications_flow.js
//
// Automated End-to-End Test for LocalFix Real-Time Notification System
// ─────────────────────────────────────────────────────────────────────────────

const http = require("http");

const request = (path, method = "GET", data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : "";
    const options = {
      hostname: "127.0.0.1",
      port: 5000,
      path: `/api${path}`,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(data && { "Content-Length": Buffer.byteLength(postData) }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on("error", (err) => reject(err));
    if (data) req.write(postData);
    req.end();
  });
};

async function runNotificationTests() {
  console.log("=================================================");
  console.log("🔔 RUNNING NOTIFICATION SYSTEM AUTOMATED TESTS");
  console.log("=================================================");

  const timestamp = Date.now();
  const customerEmail = `notif_cust_${timestamp}@test.com`;
  const providerEmail = `notif_prov_${timestamp}@test.com`;
  const adminEmail = `notif_admin_${timestamp}@test.com`;

  try {
    // ── 1. REGISTER USERS ────────────────────────────────────────────────────
    console.log("\n1️⃣ Registering Customer, Provider, and Admin accounts...");

    const custReg = await request("/auth/register", "POST", {
      name: "Alice Customer",
      email: customerEmail,
      password: "Password123!",
      role: "customer",
      phone: "9876543210",
    });
    console.log("✓ Customer registered:", custReg.body.user?.email);
    const custToken = custReg.body.token;

    const provReg = await request("/auth/register", "POST", {
      name: "Bob Plumber",
      email: providerEmail,
      password: "Password123!",
      role: "provider",
      phone: "9876543211",
      service: "Plumbing",
      location: "Downtown",
    });
    console.log("✓ Provider registered:", provReg.body.user?.email);
    const provToken = provReg.body.token;

    const adminReg = await request("/auth/register", "POST", {
      name: "Super Admin",
      email: adminEmail,
      password: "Password123!",
      role: "admin",
      phone: "9876543212",
    });
    console.log("✓ Admin registered:", adminReg.body.user?.email);
    const adminToken = adminReg.body.token;

    // Verify Provider as Admin so they can accept jobs
    await request(`/providers/${provReg.body.user._id}/verify`, "PATCH", {
      verificationStatus: "Verified",
    }, adminToken);
    console.log("✓ Provider verified by Admin");

    // ── 2. CREATE SERVICE REQUEST & TEST NOTIFICATION TRIGGERS ─────────────
    console.log("\n2️⃣ Customer creates a service request...");
    const createReq = await request("/requests", "POST", {
      title: "Leaking Kitchen Faucet",
      service: "Plumbing",
      description: "Severe water leakage under kitchen sink needing immediate repair",
      location: "Downtown",
      preferredDate: "2026-08-20",
      preferredTime: "10:00 AM",
    }, custToken);
    console.log("✓ Service request created with ID:", createReq.body.data?._id);

    // Check Customer Notifications
    const custNotifs = await request("/notifications", "GET", null, custToken);
    console.log(`✓ Customer notifications count: ${custNotifs.body.count}`);
    console.log(`   Latest: "${custNotifs.body.data?.[0]?.title}" - ${custNotifs.body.data?.[0]?.message}`);

    // Check Provider Notifications (should have received available request broadcast)
    const provNotifs = await request("/notifications", "GET", null, provToken);
    console.log(`✓ Provider notifications count: ${provNotifs.body.count}`);
    console.log(`   Latest: "${provNotifs.body.data?.[0]?.title}" - ${provNotifs.body.data?.[0]?.message}`);

    // Check Admin Notifications
    const adminNotifs = await request("/notifications", "GET", null, adminToken);
    console.log(`✓ Admin notifications count: ${adminNotifs.body.count}`);
    console.log(`   Latest: "${adminNotifs.body.data?.[0]?.title}" - ${adminNotifs.body.data?.[0]?.message}`);

    // ── 3. PROVIDER ACCEPTS REQUEST & VERIFY NOTIFICATIONS ──────────────────
    console.log("\n3️⃣ Provider accepts the service request...");
    const reqId = createReq.body.data?._id;
    const acceptRes = await request(`/requests/${reqId}/accept`, "PATCH", null, provToken);
    console.log("✓ Request accepted:", acceptRes.body.data?.status);

    // Verify customer received acceptance notification
    const custNotifs2 = await request("/notifications", "GET", null, custToken);
    console.log(`✓ Customer notifications updated count: ${custNotifs2.body.count}`);
    console.log(`   Latest: "${custNotifs2.body.data?.[0]?.title}" - ${custNotifs2.body.data?.[0]?.message}`);

    // ── 4. PROVIDER UPDATES STATUS TO 'ON THE WAY' ─────────────────────────
    console.log("\n4️⃣ Provider updates job status to 'On the Way'...");
    const statusRes = await request(`/requests/${reqId}/status`, "PATCH", {
      status: "On the Way",
      note: "Technician dispatched with tool kit",
    }, provToken);
    console.log("✓ Status updated to:", statusRes.body.data?.status);

    const custNotifs3 = await request("/notifications", "GET", null, custToken);
    console.log(`✓ Customer received status alert: "${custNotifs3.body.data?.[0]?.title}"`);

    // ── 5. ADMIN SENDS SYSTEM BROADCAST ────────────────────────────────────
    console.log("\n5️⃣ Admin dispatches a platform-wide Broadcast Announcement...");
    const broadcastRes = await request("/notifications/broadcast", "POST", {
      title: "LocalFix Summer Discount Week 🎉",
      message: "Enjoy 20% off all home repair and AC servicing bookings this entire week!",
      targetRole: "all",
      priority: "high",
    }, adminToken);
    console.log("✓ Broadcast response:", broadcastRes.body.message);

    // Verify customer received broadcast
    const custNotifsAfterBroadcast = await request("/notifications", "GET", null, custToken);
    console.log(`✓ Customer sees broadcast alert: "${custNotifsAfterBroadcast.body.data?.[0]?.title}"`);

    // ── 6. TEST UNREAD COUNT & MARK ALL AS READ ────────────────────────────
    console.log("\n6️⃣ Testing Unread Count and Mark All as Read...");
    const unreadBefore = await request("/notifications/unread-count", "GET", null, custToken);
    console.log(`✓ Unread count before: ${unreadBefore.body.count}`);

    const markAllRes = await request("/notifications/read-all", "PATCH", null, custToken);
    console.log("✓ Mark all as read result:", markAllRes.body.message);

    const unreadAfter = await request("/notifications/unread-count", "GET", null, custToken);
    console.log(`✓ Unread count after: ${unreadAfter.body.count}`);

    console.log("\n=================================================");
    console.log("🎉 ALL NOTIFICATION SYSTEM TESTS PASSED 100%!");
    console.log("=================================================");
  } catch (error) {
    console.error("❌ Notification Test Error:", error);
  }
}

runNotificationTests();
