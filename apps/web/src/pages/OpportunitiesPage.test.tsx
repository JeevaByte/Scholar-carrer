import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OpportunitiesPage } from "./OpportunitiesPage";
import { api } from "../lib/api";

vi.mock("../lib/api", () => ({
  api: {
    listOpportunities: vi.fn(),
    save: vi.fn()
  }
}));

describe("OpportunitiesPage", () => {
  beforeEach(() => {
    vi.mocked(api.listOpportunities).mockReset();
    vi.mocked(api.save).mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders loaded opportunities and pagination metadata", async () => {
    vi.mocked(api.listOpportunities).mockResolvedValue({
      items: [
        {
          id: "opp-1",
          title: "Future Tech Innovators Fellowship",
          provider: "Future Forward Foundation",
          summary: "Support for high-impact software, AI, and engineering projects.",
          amountLabel: "$50,000 / year",
          amountValue: 50000,
          educationLevel: "undergraduate",
          location: "global",
          deadlineISO: "2026-10-15",
          tags: ["full-ride"]
        }
      ],
      total: 1,
      page: 1,
      pageSize: 6
    });

    render(
      <MemoryRouter>
        <OpportunitiesPage />
      </MemoryRouter>
    );

    await screen.findByText("Future Tech Innovators Fellowship");
    expect(screen.getByText("Showing page 1 of 1 · 1 opportunities")).toBeTruthy();
  });

  it("renders an error state when the opportunities request fails", async () => {
    vi.mocked(api.listOpportunities).mockRejectedValue(new Error("boom"));

    render(
      <MemoryRouter>
        <OpportunitiesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load: Error: boom")).toBeTruthy();
    });
  });
});
