// ─────────────────────────────────────────────────────────────────────────────
// src/components/ServicesAndHowItWorks.jsx
//
// WHY ONE FILE FOR TWO SECTIONS?
//   Both sections are visually grouped together on the page. Keeping them in
//   one file means fewer imports in Home.jsx and a cleaner project structure.
//   We can always split them later if one section grows complex.
//
// IMPORTANT CONCEPT: .map() → Turning Data into Cards
//
//   We import the services array from data/services.js.
//   It looks like this:
//
//   const services = [
//     { id: 1, name: "Plumbing", professionals: "120+ Pros", icon: "...", color: "..." },
//     { id: 2, name: "Electrical", ... },
//     ...
//   ]
//
//   Then we call: services.map((service) => <Card>...</Card>)
//
//   .map() is a JavaScript array method that:
//   1. Takes each item in the array, one at a time
//   2. Runs a function with that item
//   3. Returns the result of the function
//   4. Collects all results into a new array
//
//   So instead of writing 6 separate <Card> elements, we write ONE template
//   and .map() creates 6 cards automatically from the data.
//
//   Think of it like: "For every service in the array, make me a card."
//
// REACT-BOOTSTRAP COMPONENTS:
//   Container, Row, Col, Card
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Container, Row, Col } from "react-bootstrap";

// We import the services array from our data file.
// This is a NAMED import using a DEFAULT export, so no curly braces needed.
import services from "../data/services";

// ─── Step data ───────────────────────────────────────────────────────────────
// Like services, we define the "How It Works" steps as data so the JSX stays clean.
const steps = [
  {
    id: 1,
    number: "01",
    icon: "bi bi-pencil-square",
    title: "Tell us what you need",
    desc: "Describe your problem, choose a service category, and pick a convenient time.",
  },
  {
    id: 2,
    number: "02",
    icon: "bi bi-person-check-fill",
    title: "Connect with a professional",
    desc: "We match you with a vetted local service provider suited for your job.",
  },
  {
    id: 3,
    number: "03",
    icon: "bi bi-check-circle-fill",
    title: "Get it fixed",
    desc: "Track the job in real time, confirm completion, and leave a review.",
  },
];

function ServicesAndHowItWorks() {
  return (
    <>
      {/*
        We use <> and </> (called a Fragment) to wrap both sections.
        React requires that a component returns ONE root element.
        A Fragment lets us group elements without adding an extra <div> to the HTML.
      */}

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 1 — SERVICES
      ════════════════════════════════════════════════════════════════════ */}
      <section className="lf-services section-pad" id="services">
        <Container>

          {/* Section heading */}
          <div className="text-center mb-5">
            <h2 className="lf-section-heading">What do you need help with?</h2>
            <p className="lf-section-sub">
              Browse our most popular service categories
            </p>
          </div>

          {/*
            Row with g-4: "g-4" is a Bootstrap gutter class.
            It adds equal spacing (gap) between columns both horizontally
            and vertically. g-4 = 1.5rem gap.
          */}
          <Row className="g-4">

            {/*
              ── THE IMPORTANT PART ──────────────────────────────────────────

              services.map((service) => (...))

              Let's break this down step by step:

              1. services  = the imported array from data/services.js
              2. .map()    = JavaScript array method that loops over items
              3. (service) = the current item in the loop (one service object)
              4. The parentheses () contain the JSX we return for each item
              5. key={service.id} = required by React; uniquely identifies each item

              For EACH service object, we return a <Col> containing a <div>.
              .map() runs this 6 times (once per service) and returns 6 <Col>s.

              service.name       → "Plumbing", "Electrical", etc.
              service.professionals → "120+ Pros", "85+ Pros", etc.
              service.icon       → "bi bi-droplet-fill", etc. (CSS class names)
              service.color      → "#2563EB", "#F59E0B", etc. (hex colors)
            */}
            {services.map((service) => (
              /*
                key prop: React needs a unique identifier on each item produced
                by .map() so it can track changes efficiently.
                We use service.id because it's unique per service.
              */
              <Col key={service.id} xs={6} md={4} lg={2}>
                {/*
                  xs={6} = on extra-small screens (mobile): 2 columns per row (6/12)
                  md={4} = on medium screens (tablet): 3 columns per row (4/12)
                  lg={2} = on large screens (desktop): 6 columns per row (2/12)
                */}
                <div className="lf-service-card">

                  {/*
                    Icon wrapper. We set the background color from service.color
                    with 15% opacity using rgba(). The color comes from the data!
                    
                    How inline styles work in React:
                    style={{ backgroundColor: "...", color: "..." }}
                    - Outer {} = "this is JavaScript, not regular HTML"
                    - Inner {} = "this is a JavaScript object"
                    - Property names are camelCase (backgroundColor not background-color)
                  */}
                  <div
                    className="lf-service-icon-wrap"
                    style={{
                      backgroundColor: service.color + "18", // "18" = ~10% opacity in hex
                      color: service.color,
                    }}
                  >
                    {/*
                      <i className={service.icon}> renders a Bootstrap Icon.
                      service.icon contains the class string like "bi bi-droplet-fill".
                      Bootstrap Icons are a font, so the <i> tag displays the icon glyph.
                    */}
                    <i className={service.icon}></i>
                  </div>

                  <h6>{service.name}</h6>
                  <p>{service.professionals}</p>

                </div>
              </Col>
            ))}
          </Row>

        </Container>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SECTION 2 — HOW IT WORKS
      ════════════════════════════════════════════════════════════════════ */}
      <section className="lf-how section-pad" id="how-it-works">
        <Container>

          <div className="text-center mb-5">
            <h2 className="lf-section-heading">How LocalFix Works</h2>
            <p className="lf-section-sub">
              From request to resolution in three simple steps
            </p>
          </div>

          <Row className="g-4">
            {/*
              Same .map() pattern, but this time over the steps array.
              Each step has: number ("01"), icon, title, desc.
            */}
            {steps.map((step) => (
              <Col key={step.id} md={4}>
                <div className="lf-step-card">
                  {/* Step number badge — "01", "02", "03" */}
                  <div className="lf-step-number">Step {step.number}</div>

                  {/* Bootstrap Icon */}
                  <div className="lf-step-icon">
                    <i className={step.icon}></i>
                  </div>

                  <h5>{step.title}</h5>
                  <p>{step.desc}</p>
                </div>
              </Col>
            ))}
          </Row>

        </Container>
      </section>
    </>
  );
}

export default ServicesAndHowItWorks;
