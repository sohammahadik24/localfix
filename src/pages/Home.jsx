// ─────────────────────────────────────────────────────────────────────────────
// src/pages/Home.jsx
//
// WHY DOES THIS FILE EXIST? (Very important concept!)
//
//   You might wonder: "Why not just put Navbar, Hero, etc. directly in App.jsx?"
//
//   The reason is SEPARATION OF CONCERNS — each file should have ONE job:
//
//   - App.jsx     → decides WHICH PAGE to show based on the URL
//   - Home.jsx    → assembles the HOMEPAGE from components
//   - Navbar.jsx  → renders the navigation bar
//   - Hero.jsx    → renders the hero section
//   ...and so on
//
//   Benefits:
//   ✅ If we add a Login page, App.jsx stays clean — we just add one <Route>
//   ✅ If the Hero design changes, we only touch Hero.jsx
//   ✅ Other pages (LoginPage, DashboardPage) can reuse Navbar and Footer
//      without touching Home.jsx
//
//   Home.jsx is like a blueprint that says:
//   "The homepage contains: Navbar, then Hero, then Services, then CTA, then Footer."
//   It doesn't know HOW to draw each section — it delegates that to the components.
//
// WHAT IS <> and </>?
//   This is a React Fragment. React requires every component to return exactly
//   ONE root element. If we used <div>, it would add an extra <div> to the HTML.
//   Fragments (<> </>) group elements without adding anything to the DOM.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

// Import all homepage components
// "../" means "go up one folder" (from pages/ to src/)
// then into components/
import AppNavbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServicesAndHowItWorks from "../components/ServicesAndHowItWorks";
import WhyChooseAndCTA from "../components/WhyChooseAndCTA";
import Footer from "../components/Footer";

function Home() {
  return (
    /*
      React Fragment: groups multiple elements without a wrapper <div>.
      The homepage is just these 5 components stacked vertically.
      That's it — clean and simple.
    */
    <>
      <AppNavbar />
      <Hero />
      <ServicesAndHowItWorks />
      <WhyChooseAndCTA />
      <Footer />
    </>
  );
}

export default Home;
