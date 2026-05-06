import { describe, expect, it } from "vitest";
import { buildOpportunityQuery } from "./query";

describe("buildOpportunityQuery", () => {
  it("returns encoded query parameters", () => {
    const query = buildOpportunityQuery({
      search: "tech fellowship",
      educationLevel: "undergraduate",
      location: "global",
      sort: "deadline",
      page: 2
    });

    expect(query).toContain("search=tech+fellowship");
    expect(query).toContain("educationLevel=undergraduate");
    expect(query).toContain("location=global");
    expect(query).toContain("sort=deadline");
    expect(query).toContain("page=2");
  });

  it("returns empty string when no filters", () => {
    expect(buildOpportunityQuery({})).toBe("");
  });
});
