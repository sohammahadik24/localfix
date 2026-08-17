// ─────────────────────────────────────────────────────────────────────────────
// src/data/faqData.js
//
// WHAT IS THIS FILE?
//   Stores a static JavaScript ARRAY of FAQ (Frequently Asked Questions) OBJECTS.
//   Used by the Help & Support page (HelpSupport.jsx) to populate the expandable
//   React-Bootstrap Accordion.
//
// STRUCTURE:
//   Each item contains:
//     - id       → Unique identifier for Accordion eventKey (e.g. "0", "1", "2")
//     - question → The question title shown in the accordion header
//     - answer   → Detailed helpful answer text
//     - category → Grouping category (e.g. "Requests", "Providers", "General")
// ─────────────────────────────────────────────────────────────────────────────

const faqData = [
  {
    id: "0",
    category: "Requests",
    question: "How do I create a service request?",
    answer:
      "To create a service request, click on 'Create Request' in the top navbar or sidebar, choose your required service category (e.g., Plumbing, Electrical, AC Repair), describe the problem, select your preferred date and time, and click 'Submit Service Request'.",
  },
  {
    id: "1",
    category: "Tracking",
    question: "How can I track my request?",
    answer:
      "You can track any request by going to 'My Requests' from the sidebar and clicking 'View Details' on the relevant request card. The Request Details page features a real-time 4-step Service Status Timeline showing the progress from Request Created to Service Completed.",
  },
  {
    id: "2",
    category: "Cancellation",
    question: "How do I cancel a request?",
    answer:
      "If your request is still in 'Pending' status, navigate to the Request Details page and click the 'Cancel Request' button in the Quick Actions box. You can select a cancellation reason and confirm without any penalty.",
  },
  {
    id: "3",
    category: "Providers",
    question: "How can I contact my service provider?",
    answer:
      "Once a verified professional accepts your booking, their profile card will display their verified phone number and in-app contact options. You can click 'Contact Provider' or use the phone icon to call or message them directly.",
  },
  {
    id: "4",
    category: "Reviews",
    question: "How do I give a rating and review?",
    answer:
      "After a service is marked as 'Completed', go to the Request Details page and click the 'Give Review' button. You can rate the professional from 1 to 5 stars and leave written feedback to help other community members.",
  },
  {
    id: "5",
    category: "Providers",
    question: "What happens if a provider rejects my request?",
    answer:
      "If a provider is unavailable at your selected time, LocalFix automatically re-broadcasts your booking to other top-rated and background-checked technicians in your local area to ensure quick fulfillment.",
  },
  {
    id: "6",
    category: "General",
    question: "Are all LocalFix service providers verified?",
    answer:
      "Yes. Every service professional on LocalFix undergoes thorough identity verification, skills assessment, background checks, and customer rating reviews before accepting customer jobs.",
  },
];

export default faqData;
