import { describe, expect, it } from "vitest";
import { MockRepository } from "./repositories/mock/mockRepository.js";
describe("list -> save -> dashboard flow", () => {
    it("reflects saved opportunities in recommendations", async () => {
        const repo = new MockRepository();
        const list = await repo.listOpportunities({
            search: "",
            page: 1,
            pageSize: 10,
            sort: "relevance"
        });
        expect(list.items.length).toBeGreaterThan(0);
        await repo.saveOpportunity("user-demo-1", list.items[0].id);
        const dashboard = await repo.getDashboard("user-demo-1");
        expect(dashboard.recommended.some((item) => item.id === list.items[0].id)).toBe(true);
    });
});
