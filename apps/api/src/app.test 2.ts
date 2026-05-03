import { describe, expect, it } from "vitest";
import { MockRepository } from "./repositories/mock/mockRepository.js";

describe("mock repository", () => {
  it("filters by education level", async () => {
    const repo = new MockRepository();
    const data = await repo.listOpportunities({
      search: "",
      educationLevel: "phd",
      page: 1,
      pageSize: 10,
      sort: "relevance"
    });

    expect(data.items.every((item) => item.educationLevel === "phd")).toBe(true);
  });
});
