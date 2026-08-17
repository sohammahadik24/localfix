// ─────────────────────────────────────────────────────────────────────────────
// src/data/providerFaqData.js
//
// WHAT IS THIS FILE?
//   Stores a static JavaScript ARRAY of FAQ objects specifically for
//   LocalFix Service Providers (technicians & professionals).
//
// STRUCTURE:
//   Each item contains:
//     - id       → Unique identifier for Accordion eventKey (e.g. "0", "1")
//     - question → The question title shown in the accordion header
//     - answer   → Detailed answer text
//     - category → Grouping category (Requests, Jobs, Account, Payments)
// ─────────────────────────────────────────────────────────────────────────────

const providerFaqData = [
  {
    id: "0",
    category: "Requests",
    question: "How do I accept a service request?",
    answer:
      "When a customer in your service area submits a booking, it appears in your 'Jobs & Requests' list. Review the problem description, preferred time, and payout. Click the 'Accept' button to confirm the booking. The customer is immediately notified with your contact details.",
  },
  {
    id: "1",
    category: "Requests",
    question: "How do I reject a request?",
    answer:
      "If you are unavailable or the service location is outside your coverage area, click 'Reject' on the request card. The booking will automatically be re-routed to other available professionals in the neighborhood without impacting your rating.",
  },
  {
    id: "2",
    category: "Jobs",
    question: "How do I update a job status?",
    answer:
      "Navigate to 'Jobs & Requests' and select the 'Accepted' tab. When you arrive at the customer's location and begin work, click 'Start Job (In Progress)' or use the gear icon to update the status to 'In Progress'.",
  },
  {
    id: "3",
    category: "Jobs",
    question: "How do I mark a service as completed?",
    answer:
      "Once you finish the repair or service, open the job card and click 'Mark as Completed'. The status updates to 'Completed', and the customer receives an invitation to submit payment and rate your service.",
  },
  {
    id: "4",
    category: "Account",
    question: "How can I update my availability?",
    answer:
      "On your Provider Dashboard, use the 'Online / Offline' toggle button in the header. Switching to 'Online' enables instant customer lead alerts, while 'Offline' temporarily pauses new incoming requests.",
  },
  {
    id: "5",
    category: "Account",
    question: "How are customer ratings calculated?",
    answer:
      "Your overall rating is an average of all verified customer reviews submitted after completed jobs. Ratings are weighted on a 1 to 5 star scale based on punctuality, service quality, and professionalism.",
  },
  {
    id: "6",
    category: "Support",
    question: "How can I contact LocalFix support?",
    answer:
      "You can submit a ticket using the 'Report a Problem' form below or reach our 24/7 dedicated Provider Helpdesk via email at provider-support@localfix.in or phone at +91 1800-LOCALFIX.",
  },
];

export default providerFaqData;
