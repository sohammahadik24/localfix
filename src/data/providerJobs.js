// ─────────────────────────────────────────────────────────────────────────────
// src/data/providerJobs.js
//
// WHAT IS THIS FILE?
//   Stores a static JavaScript ARRAY of jobs accepted, ongoing, completed,
//   or cancelled by the service provider (Rajesh Kumar).
//
// STRUCTURE:
//   Each job object contains:
//     - id          → Unique identifier
//     - title       → Service title / summary
//     - service     → Category (Plumbing, Electrical, AC Repair, Cleaning, Carpentry)
//     - customer    → Customer full name
//     - customerPhone → Customer contact number
//     - location    → Job address
//     - date        → Scheduled service date
//     - time        → Scheduled service time
//     - status      → "Accepted" | "In Progress" | "Completed" | "Cancelled"
//     - payout      → Earnings amount (e.g. "₹650")
//     - description → Detailed customer problem / job scope
//     - icon        → Bootstrap icon class
//     - color       → Category theme color
// ─────────────────────────────────────────────────────────────────────────────

const providerJobs = [
  {
    id: 1,
    title: "Kitchen Tap Repair",
    service: "Plumbing",
    customer: "Soham Mahadik",
    customerPhone: "+91 98765 43210",
    location: "Flat 402, Sunshine Heights, Andheri West, Mumbai",
    date: "Aug 16, 2026",
    time: "5:00 PM",
    status: "In Progress",
    payout: "₹650",
    description: "Kitchen mixer tap has been leaking continuously from the base since yesterday.",
    icon: "bi bi-droplet-fill",
    color: "#2563EB",
  },
  {
    id: 2,
    title: "Ceiling Fan & LED Switch Fixing",
    service: "Electrical",
    customer: "Amit Shah",
    customerPhone: "+91 97692 88310",
    location: "A-204, Green Meadows, Powai, Mumbai",
    date: "Aug 18, 2026",
    time: "2:30 PM",
    status: "Accepted",
    payout: "₹750",
    description: "Sparking wall switch in bedroom and need mounting of 2 LED ceiling panel fixtures.",
    icon: "bi bi-lightning-charge-fill",
    color: "#F59E0B",
  },
  {
    id: 3,
    title: "Bathroom Water Pipe Fitting",
    service: "Plumbing",
    customer: "Priya Sharma",
    customerPhone: "+91 98201 44556",
    location: "Bldg 12, Palm Grove Apt, Bandra East, Mumbai",
    date: "Aug 15, 2026",
    time: "11:00 AM",
    status: "Completed",
    payout: "₹850",
    description: "Installed concealed shower diverter and resolved main water pressure block.",
    icon: "bi bi-droplet-fill",
    color: "#2563EB",
  },
  {
    id: 4,
    title: "Master Bedroom Split AC Servicing",
    service: "AC Repair",
    customer: "Rohan Deshmukh",
    customerPhone: "+91 98334 22110",
    location: "1401 Royal Towers, Worli, Mumbai",
    date: "Aug 14, 2026",
    time: "4:00 PM",
    status: "Completed",
    payout: "₹1,200",
    description: "Full AC gas refill, coil chemical wash, and compressor anti-vibration pad installation.",
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
    date: "Aug 12, 2026",
    time: "9:00 AM",
    status: "Completed",
    payout: "₹2,400",
    description: "Deep cleaning of kitchen, 2 bathrooms, balconies, and machine buffing floors.",
    icon: "bi bi-brush-fill",
    color: "#16A34A",
  },
  {
    id: 6,
    title: "Wooden Door Lock & Hinge Replacement",
    service: "Carpentry",
    customer: "Siddharth Roy",
    customerPhone: "+91 98200 11223",
    location: "Flat 301, Lake View, Thane West, Mumbai",
    date: "Aug 10, 2026",
    time: "3:00 PM",
    status: "Cancelled",
    payout: "₹500",
    description: "Customer cancelled before arrival due to travel scheduling conflict.",
    icon: "bi bi-tools",
    color: "#92400E",
  },
];

export default providerJobs;
