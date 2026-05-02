import type {
  DashboardPayload,
  Opportunity,
  OpportunityFilterInput,
  PaginatedResponse
} from "@scholar-career/shared";
import { mockActivity, mockOpportunities, mockStats } from "../../data/mockData.js";
import type { DataRepository } from "../contracts.js";

const savedByUser = new Map<string, Set<string>>();

const applySearch = (items: Opportunity[], search: string): Opportunity[] => {
  const q = search.trim().toLowerCase();
  if (!q) {
    return items;
  }
  return items.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.provider.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    );
  });
};

export class MockRepository implements DataRepository {
  async listOpportunities(filters: OpportunityFilterInput): Promise<PaginatedResponse<Opportunity>> {
    let items = [...mockOpportunities];

    items = applySearch(items, filters.search ?? "");
    if (filters.educationLevel) items = items.filter((i) => i.educationLevel === filters.educationLevel);
    if (filters.location) items = items.filter((i) => i.location === filters.location);
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
    } else if (filters.sort === "deadline") {
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

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    return mockOpportunities.find((item) => item.id === id) ?? null;
  }

  async saveOpportunity(userId: string, opportunityId: string): Promise<void> {
    const existing = savedByUser.get(userId) ?? new Set<string>();
    existing.add(opportunityId);
    savedByUser.set(userId, existing);
  }

  async unsaveOpportunity(userId: string, opportunityId: string): Promise<void> {
    const existing = savedByUser.get(userId) ?? new Set<string>();
    existing.delete(opportunityId);
    savedByUser.set(userId, existing);
  }

  async listSavedOpportunities(userId: string): Promise<Opportunity[]> {
    const saved = savedByUser.get(userId) ?? new Set<string>();
    return mockOpportunities.filter((item) => saved.has(item.id));
  }

  async applyToOpportunity(_userId: string, _opportunityId: string, _note?: string): Promise<void> {
    return;
  }

  async getDashboard(userId: string): Promise<DashboardPayload> {
    const saved = await this.listSavedOpportunities(userId);
    return {
      stats: mockStats,
      activity: mockActivity,
      recommended: saved.length > 0 ? saved : mockOpportunities.slice(0, 2)
    };
  }
}
