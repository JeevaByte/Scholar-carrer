import { describe, expect, it } from "vitest";
import { applyOpportunitySchema, opportunityFilterSchema } from "./validation";

describe("opportunityFilterSchema", () => {
  it("coerces pagination and amount values", () => {
    const parsed = opportunityFilterSchema.parse({
      page: "2",
      pageSize: "12",
      minAmount: "1000",
      maxAmount: "5000",
    });

    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(12);
    expect(parsed.minAmount).toBe(1000);
    expect(parsed.maxAmount).toBe(5000);
  });
});

describe("applyOpportunitySchema", () => {
  it("rejects notes longer than 500 characters", () => {
    expect(() =>
      applyOpportunitySchema.parse({
        opportunityId: "opp-1",
        note: "x".repeat(501),
      }),
    ).toThrow();
  });
});
