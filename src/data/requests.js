// ─────────────────────────────────────────────────────────────────────────────
// src/data/requests.js
//
// WHAT IS THIS FILE?
//   This file stores a JavaScript ARRAY of service request OBJECTS.
//   Think of it like a local database or mock data source for the frontend.
//   When we connect the backend later, we will replace this static array
//   with real data fetched from our MongoDB database via an Express API.
//
// HOW DATA IS STRUCTURED:
//   Each request object contains:
//     - id             → Unique ID for routing (/requests/:id) and React keys
//     - title          → Summary title of the requested service
//     - service        → Category name (Plumbing, Electrical, AC Repair, etc.)
//     - category       → Duplicate of service for backwards compatibility
//     - description    → Detailed problem explanation
//     - date           → Scheduled date
//     - time           → Scheduled time
//     - location       → Service address
//     - notes          → Special instructions from the customer
//     - image          → Sample photo attachment preview
//     - imageName      → File name of attached photo
//     - provider       → Name of assigned provider (or null if pending)
//     - providerDetails→ Detailed provider profile (rating, experience, contact, avatar)
//     - status         → Current status ("Pending" | "Accepted" | "In Progress" | "Completed" | "Cancelled")
//     - timeline       → Step completion dates and status descriptions
//     - icon           → Bootstrap Icon class name
//     - iconColor      → Theme accent color for the category icon
// ─────────────────────────────────────────────────────────────────────────────

const requests = [
  {
    id: 1,
    title: "Kitchen Tap Repair",
    service: "Plumbing",
    category: "Plumbing",
    description: "Kitchen mixer tap has been leaking continuously from the base since yesterday. Water pressure is also dropping intermittently.",
    date: "Aug 15, 2026",
    time: "5:00 PM",
    location: "Flat 402, Sunshine Heights, Link Road, Andheri West, Mumbai 400053",
    notes: "Please call 15 minutes before arrival. The building has guest parking available at Gate 2.",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80",
    imageName: "kitchen_tap_leak.jpg",
    provider: "Raj Plumbing Services",
    providerDetails: {
      name: "Rajesh Kumar",
      businessName: "Raj Plumbing Services",
      avatar: "RK",
      avatarBg: "#2563EB",
      serviceType: "Senior Sanitary & Pipe Specialist",
      rating: 4.9,
      reviewsCount: 142,
      experience: "7+ years",
      phone: "+91 98201 45678",
      email: "rajesh.plumbing@localfix.in",
      verified: true,
      completedJobs: 380,
    },
    status: "Accepted",
    timeline: {
      created: { date: "Aug 14, 2026", time: "10:30 AM", completed: true },
      accepted: { date: "Aug 14, 2026", time: "01:15 PM", completed: true },
      inProgress: { date: "Aug 15, 2026", time: "Expected 5:00 PM", completed: false },
      completed: { date: "Aug 15, 2026", time: "Expected 6:00 PM", completed: false },
    },
    icon: "bi bi-droplet-fill",
    iconColor: "#2563EB",
  },
  {
    id: 2,
    title: "AC Not Cooling",
    service: "AC Repair",
    category: "AC Repair",
    description: "Master bedroom split AC turns on and blows air, but doesn't cool the room. Outdoor compressor unit makes a humming noise.",
    date: "Aug 17, 2026",
    time: "3:00 PM",
    location: "Bldg 12, Palm Grove Apt, Bandra East, Mumbai 400051",
    notes: "Please bring refrigerant gas test kit and coil cleaning equipment.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    imageName: "ac_unit_split.jpg",
    provider: null, // Awaiting provider assignment
    providerDetails: null,
    status: "Pending",
    timeline: {
      created: { date: "Aug 15, 2026", time: "04:45 PM", completed: true },
      accepted: { date: null, time: null, completed: false },
      inProgress: { date: null, time: null, completed: false },
      completed: { date: null, time: null, completed: false },
    },
    icon: "bi bi-snow",
    iconColor: "#06B6D4",
  },
  {
    id: 3,
    title: "Bedroom Light & Switch Installation",
    service: "Electrical",
    category: "Electrical",
    description: "Need installation of 2 ceiling LED panel lights and fixing a sparking wall switch in the master bedroom.",
    date: "Aug 10, 2026",
    time: "11:30 AM",
    location: "A-204, Green Meadows, Powai, Mumbai 400076",
    notes: "Lights and switch fixtures are already purchased and ready for mounting.",
    image: null,
    imageName: null,
    provider: "Amit Electricals",
    providerDetails: {
      name: "Amit Sharma",
      businessName: "Amit Electricals",
      avatar: "AS",
      avatarBg: "#D97706",
      serviceType: "Certified Electrical Technician",
      rating: 4.8,
      reviewsCount: 96,
      experience: "5+ years",
      phone: "+91 97692 88310",
      email: "amit.elec@localfix.in",
      verified: true,
      completedJobs: 215,
    },
    status: "Completed",
    timeline: {
      created: { date: "Aug 09, 2026", time: "09:00 AM", completed: true },
      accepted: { date: "Aug 09, 2026", time: "11:20 AM", completed: true },
      inProgress: { date: "Aug 10, 2026", time: "11:35 AM", completed: true },
      completed: { date: "Aug 10, 2026", time: "01:10 PM", completed: true },
    },
    icon: "bi bi-lightning-charge-fill",
    iconColor: "#F59E0B",
  },
  {
    id: 4,
    title: "Full 2BHK Deep Cleaning",
    service: "Cleaning",
    category: "Cleaning",
    description: "Complete pre-move-in deep cleaning including kitchen degreasing, bathroom descaling, balcony wash, and floor buffing.",
    date: "Aug 19, 2026",
    time: "9:00 AM",
    location: "Flat 7B, Sky Vista, Goregaon West, Mumbai 400104",
    notes: "Key is available with security guard if team arrives early. Water and power are connected.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    imageName: "apartment_cleaning.jpg",
    provider: "Sparkle Cleaners Mumbai",
    providerDetails: {
      name: "Pooja Verma",
      businessName: "Sparkle Cleaners Mumbai",
      avatar: "SC",
      avatarBg: "#16A34A",
      serviceType: "Professional Sanitisation & Housekeeping Lead",
      rating: 5.0,
      reviewsCount: 230,
      experience: "8+ years",
      phone: "+91 98334 11290",
      email: "service@sparkleclean.in",
      verified: true,
      completedJobs: 620,
    },
    status: "In Progress",
    timeline: {
      created: { date: "Aug 16, 2026", time: "02:15 PM", completed: true },
      accepted: { date: "Aug 16, 2026", time: "03:40 PM", completed: true },
      inProgress: { date: "Aug 19, 2026", time: "09:05 AM", completed: true },
      completed: { date: "Aug 19, 2026", time: "Expected 02:00 PM", completed: false },
    },
    icon: "bi bi-brush-fill",
    iconColor: "#16A34A",
  },
  {
    id: 5,
    title: "Custom Wooden Bookshelf Assembly",
    service: "Carpentry",
    category: "Carpentry",
    description: "Assemble and wall-mount a 6-tier wooden bookshelf in the home office room.",
    date: "Aug 05, 2026",
    time: "2:00 PM",
    location: "Villa 3, Sea Breeze Enclave, Juhu, Mumbai 400049",
    notes: "Heavy solid oak materials, wall studs require masonry anchors.",
    image: null,
    imageName: null,
    provider: "WoodCraft Studios",
    providerDetails: {
      name: "Suresh Mistry",
      businessName: "WoodCraft Studios",
      avatar: "WM",
      avatarBg: "#92400E",
      serviceType: "Master Carpenter & Furniture Craftsman",
      rating: 4.7,
      reviewsCount: 84,
      experience: "10+ years",
      phone: "+91 98190 77412",
      email: "contact@woodcraft.in",
      verified: true,
      completedJobs: 190,
    },
    status: "Cancelled",
    timeline: {
      created: { date: "Aug 04, 2026", time: "11:00 AM", completed: true },
      accepted: { date: "Aug 04, 2026", time: "01:30 PM", completed: true },
      inProgress: { date: null, time: null, completed: false },
      completed: { date: null, time: null, completed: false },
      cancelled: { date: "Aug 05, 2026", time: "10:00 AM", completed: true },
    },
    icon: "bi bi-tools",
    iconColor: "#92400E",
  },
  {
    id: 6,
    title: "Front-Load Washing Machine Vibration Fix",
    service: "Appliance Repair",
    category: "Appliance Repair",
    description: "Washing machine vibrates excessively during the spin cycle and makes loud squeaking noises.",
    date: "Aug 20, 2026",
    time: "4:30 PM",
    location: "1401 Royal Towers, Worli, Mumbai 400018",
    notes: "Brand: LG 8kg Inverter Direct Drive. Model purchased in 2023.",
    image: null,
    imageName: null,
    provider: null, // Pending matching
    providerDetails: null,
    status: "Pending",
    timeline: {
      created: { date: "Aug 16, 2026", time: "12:00 PM", completed: true },
      accepted: { date: null, time: null, completed: false },
      inProgress: { date: null, time: null, completed: false },
      completed: { date: null, time: null, completed: false },
    },
    icon: "bi bi-gear-fill",
    iconColor: "#7C3AED",
  },
];

export default requests;
