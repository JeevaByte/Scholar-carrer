import { mockActivity, mockOpportunities, mockStats } from "../../data/mockData.js";
const savedByUser = new Map();
const applySearch = (items, search) => {
    const q = search.trim().toLowerCase();
    if (!q) {
        return items;
    }
    return items.filter((item) => {
        return (item.title.toLowerCase().includes(q) ||
            item.provider.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q));
    });
};
export class MockRepository {
    async listOpportunities(filters) {
        let items = [...mockOpportunities];
        items = applySearch(items, filters.search ?? "");
        if (filters.educationLevel)
            items = items.filter((i) => i.educationLevel === filters.educationLevel);
        if (filters.location)
            items = items.filter((i) => i.location === filters.location);
        if (filters.minAmount !== undefined) {
            const minAmount = filters.minAmount;
            items = items.filter((i) => i.amountValue >= minAmount);
        }
        if (filters.maxAmount !== undefined) {
            const maxAmount = filters.maxAmount;
            items = items.filter((i) => i.amountValue <= maxAmount);
        }
        if (filters.sort === "amount") {
            items.sort((a, b) => b.amountValue - a.amountValue);
        }
        else if (filters.sort === "deadline") {
            items.sort((a, b) => a.deadlineISO.localeCompare(b.deadlineISO));
        }
        const total = items.length;
        const offset = (filters.page - 1) * filters.pageSize;
        const paged = items.slice(offset, offset + filters.pageSize);
        return {
            items: paged,
            total,
            page: filters.page,
            pageSize: filters.pageSize
        };
    }
    async getOpportunityById(id) {
        return mockOpportunities.find((item) => item.id === id) ?? null;
    }
    async saveOpportunity(userId, opportunityId) {
        const existing = savedByUser.get(userId) ?? new Set();
        existing.add(opportunityId);
        savedByUser.set(userId, existing);
    }
    async unsaveOpportunity(userId, opportunityId) {
        const existing = savedByUser.get(userId) ?? new Set();
        existing.delete(opportunityId);
        savedByUser.set(userId, existing);
    }
    async listSavedOpportunities(userId) {
        const saved = savedByUser.get(userId) ?? new Set();
        return mockOpportunities.filter((item) => saved.has(item.id));
    }
    async applyToOpportunity(_userId, _opportunityId, _note) {
        return;
    }
    async getDashboard(userId) {
        const saved = await this.listSavedOpportunities(userId);
        return {
            stats: mockStats,
            activity: mockActivity,
            recommended: saved.length > 0 ? saved : mockOpportunities.slice(0, 2)
        };
    }
}
