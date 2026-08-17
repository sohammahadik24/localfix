// ─────────────────────────────────────────────────────────────────────────────
// src/data/providerRequests.js
//
// WHAT IS THIS FILE?
//   Stores a static JavaScript ARRAY of customer service requests available
//   for service professionals / providers.
//
// STRUCTURE:
//   Each request object contains:
//     - id          → Unique number (used for React keys)
//     - title       → Service request summary
//     - service     → Category (Plumbing, Electrical, AC Repair, Cleaning, etc.)
//     - customer    → Name of the customer who submitted the request
//     - customerPhone → Customer contact number
//     - location    → Address where service is needed
//     - date        → Scheduled service date
//     - time        → Scheduled service time
//     - description → Detailed description of the problem
//     - payout      → Estimated earnings / payment for the job
//     - status      → "Pending" | "Accepted" | "Rejected"
//     - icon        → Bootstrap Icon class
//     - color       → Category theme color
// ─────────────────────────────────────────────────────────────────────────────

const providerRequests = [
  {
    id: 1,
    title: "Kitchen Tap Repair",
    service: "Plumbing",
    customer: "Soham Mahadik",
    customerPhone: "+91 98765 43210",
    location: "Flat 402, Sunshine Heights, Andheri West, Mumbai",
    date: "Aug 16, 2026",
    time: "5:00 PM",
    description: "Kitchen mixer tap is leaking continuously from the base and water pressure is dropping.",
    payout: "₹650",
    status: "Pending",
    icon: "bi bi-droplet-fill",
    color: "#2563EB",
  },
  {
    id: 2,
    title: "Bathroom Water Pipe Fitting",
    service: "Plumbing",
    customer: "Priya Sharma",
    customerPhone: "+91 98201 44556",
    location: "Bldg 12, Palm Grove Apt, Bandra East, Mumbai",
    date: "Aug 17, 2026",
    time: "11:00 AM",
    description: "Need installation of a new concealed shower diverter and fixing low water pressure line.",
    payout: "₹850",
    status: "Pending",
    icon: "bi bi-droplet-fill",
    color: "#2563EB",
  },
  {
    id: 3,
    title: "Ceiling Fan & LED Switch Fixing",
    service: "Electrical",
    customer: "Amit Shah",
    customerPhone: "+91 97692 88310",
    location: "A-204, Green Meadows, Powai, Mumbai",
    date: "Aug 18, 2026",
    time: "2:30 PM",
    description: "Sparking wall switch in bedroom and need mounting of 2 LED ceiling panel fixtures.",
    payout: "₹750",
    status: "Accepted",
    icon: "bi bi-lightning-charge-fill",
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Master Bedroom Split AC Servicing",
    service: "AC Repair",
    customer: "Rohan Deshmukh",
    customerPhone: "+91 98334 22110",
    location: "1401 Royal Towers, Worli, Mumbai",
    date: "Aug 19, 2026",
    time: "4:00 PM",
    description: "AC blows warm air and outdoor compressor unit makes loud humming noises.",
    payout: "₹1,200",
    status: "Pending",
    icon: "bi bi-snow",
    color: "#06B6D4",
  },
  {
    id: 5,
    title: "Full 2BHK Deep Cleaning & Sanitisation",
    service: "Cleaning",
    customer: "Neha Kapoor",
    customerPhone: "+91 98190 77412",
    location: "Flat 7B, Sky Vista, Goregaon West, Mumbai",
    date: "Aug 20, 2026",
    time: "9:00 AM",
    description: "Pre-move-in deep cleaning including kitchen degreasing, bathroom descaling, and floor scrubbing.",
    payout: "₹2,400",
    status: "Pending",
    icon: "bi bi-brush-fill",
    color: "#16A34A",
  },
  {
    id: 6,
    title: "Custom Bookshelf Wall Assembly",
    service: "Carpentry",
    customer: "Vikram Mehta",
    customerPhone: "+91 99200 66554",
    location: "Villa 3, Sea Breeze Enclave, Juhu, Mumbai",
    date: "Aug 21, 2026",
    time: "1:30 PM",
    description: "Assemble 6-tier heavy wooden bookshelf and secure it into masonry wall studs.",
    payout: "₹950",
    status: "Rejected",
    icon: "bi bi-tools",
    color: "#92400E",
  },
];

export default providerRequests;
