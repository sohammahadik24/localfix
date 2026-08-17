// ─────────────────────────────────────────────────────────────────────────────
// src/data/services.js
//
// WHAT IS THIS FILE?
//   This file stores a static JavaScript ARRAY of service category OBJECTS.
//   Think of it like our catalogue of available services in LocalFix.
//
// HOW DATA IS STRUCTURED:
//   Each service object contains:
//     - id          → Unique number (used for React keys)
//     - name        → Service title (e.g. "Plumbing", "Electrical")
//     - description → Short explanation of what the service covers
//     - providers   → Number of available service professionals (e.g. 24)
//     - emoji       → Visual emoji icon (e.g. "🔧", "⚡")
//     - icon        → Bootstrap Icon class name (e.g. "bi bi-droplet-fill")
//     - color       → Accent theme color for badges and icon backgrounds
//     - professionals → Formatted text count (e.g. "24+ Providers")
//
// WHY STORE DATA THIS WAY?
//   Instead of hardcoding 6 separate cards in JSX, we store data here
//   and use JavaScript's .map() and .filter() functions to render and
//   search cards dynamically. Clean and maintainable!
// ─────────────────────────────────────────────────────────────────────────────

const services = [
  {
    id: 1,
    name: "Plumbing",
    description: "Fix leaks, taps, pipes and other plumbing problems.",
    providers: 24,
    professionals: "24+ Providers",
    emoji: "🔧",
    icon: "bi bi-droplet-fill",
    color: "#2563EB", // Blue
  },
  {
    id: 2,
    name: "Electrical",
    description: "Install fixtures, repair wiring, switches, and electrical faults.",
    providers: 18,
    professionals: "18+ Providers",
    emoji: "⚡",
    icon: "bi bi-lightning-charge-fill",
    color: "#F59E0B", // Amber / Orange
  },
  {
    id: 3,
    name: "AC Repair",
    description: "AC servicing, gas refill, cooling issues, and filter maintenance.",
    providers: 15,
    professionals: "15+ Providers",
    emoji: "❄️",
    icon: "bi bi-snow",
    color: "#06B6D4", // Cyan
  },
  {
    id: 4,
    name: "Carpentry",
    description: "Custom woodwork, furniture repair, bookshelf assembly, and fittings.",
    providers: 12,
    professionals: "12+ Providers",
    emoji: "🪚",
    icon: "bi bi-tools",
    color: "#92400E", // Brown
  },
  {
    id: 5,
    name: "Cleaning",
    description: "Deep home cleaning, kitchen & bathroom sanitisation, and floor scrubbing.",
    providers: 30,
    professionals: "30+ Providers",
    emoji: "🧹",
    icon: "bi bi-brush-fill",
    color: "#16A34A", // Green
  },
  {
    id: 6,
    name: "Appliance Repair",
    description: "Fix washing machines, refrigerators, microwaves, and home appliances.",
    providers: 20,
    professionals: "20+ Providers",
    emoji: "🔌",
    icon: "bi bi-gear-fill",
    color: "#7C3AED", // Purple
  },
];

export default services;
