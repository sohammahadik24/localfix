import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RequestDetails from "./pages/RequestDetails";
import RequestInfoCard from "./components/RequestInfoCard";
import ProviderCard from "./components/ProviderCard";
import ServiceTimeline from "./components/ServiceTimeline";
import RequestActions from "./components/RequestActions";
import requests from "./data/requests";

describe("Request Details Page & Components", () => {
  test("renders RequestDetails page for valid request ID 1 (Kitchen Tap Repair)", () => {
    render(
      <MemoryRouter initialEntries={["/requests/1"]}>
        <Routes>
          <Route path="/requests/:id" element={<RequestDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Header Title
    expect(screen.getByText("Kitchen Tap Repair")).toBeInTheDocument();
    // Back Link
    expect(screen.getByText(/Back to My Requests/i)).toBeInTheDocument();
    // Request ID in header/badge
    expect(screen.getByText(/#REQ-0001/i)).toBeInTheDocument();
    // Status Badge
    expect(screen.getByText("Accepted")).toBeInTheDocument();
  });

  test("renders RequestInfoCard correctly with problem description and location", () => {
    const sampleRequest = requests[0];
    render(<RequestInfoCard request={sampleRequest} />);

    expect(screen.getByText("Request Information")).toBeInTheDocument();
    expect(screen.getByText(sampleRequest.description)).toBeInTheDocument();
    expect(screen.getByText(sampleRequest.location)).toBeInTheDocument();
  });

  test("renders ProviderCard in Pending / Unassigned state", () => {
    render(
      <ProviderCard
        providerDetails={null}
        providerName={null}
        status="Pending"
      />
    );

    expect(screen.getByText(/Provider not assigned/i)).toBeInTheDocument();
  });

  test("renders ProviderCard with assigned provider info", () => {
    const sampleProvider = requests[0].providerDetails;
    render(
      <ProviderCard
        providerDetails={sampleProvider}
        providerName={requests[0].provider}
        status="Accepted"
      />
    );

    expect(screen.getByText(sampleProvider.name)).toBeInTheDocument();
    expect(screen.getByText(/7\+ years/i)).toBeInTheDocument();
  });

  test("renders ServiceTimeline with 4 steps", () => {
    render(<ServiceTimeline status="Accepted" timeline={requests[0].timeline} />);

    expect(screen.getByText("Request Created")).toBeInTheDocument();
    expect(screen.getByText("Provider Accepted")).toBeInTheDocument();
    expect(screen.getByText("Service In Progress")).toBeInTheDocument();
    expect(screen.getByText("Service Completed")).toBeInTheDocument();
  });

  test("renders RequestActions based on status", () => {
    // Accepted state -> Contact Provider
    const { rerender } = render(<RequestActions request={requests[0]} />);
    expect(screen.getByText("Contact Provider")).toBeInTheDocument();

    // Pending state -> Cancel Request
    rerender(<RequestActions request={requests[1]} />);
    expect(screen.getByText("Cancel Request")).toBeInTheDocument();

    // Completed state -> Give Review
    rerender(<RequestActions request={requests[2]} />);
    expect(screen.getByText("Give Review")).toBeInTheDocument();

    // In Progress state -> Track Service
    rerender(<RequestActions request={requests[3]} />);
    expect(screen.getByText("Track Service")).toBeInTheDocument();
  });

  test("renders 404 state when request ID is not found", () => {
    render(
      <MemoryRouter initialEntries={["/requests/999"]}>
        <Routes>
          <Route path="/requests/:id" element={<RequestDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Request Not Found")).toBeInTheDocument();
    expect(screen.getByText(/Return to My Requests/i)).toBeInTheDocument();
  });
});
