import type {
  ActivityItem,
  DashboardPayload,
  Opportunity,
  OpportunityFilterInput,
  PaginatedResponse,
  Profile
} from "@scholar-career/shared";
import { mockActivity, mockOpportunities, mockStats } from "../../data/mockData.js";
import type { DataRepository } from "../contracts.js";

const savedByUser = new Map<string, Set<string>>();
const applicationsByUser = new Map<string, ActivityItem[]>();

const getProfileForUser = (userId: string): Profile => ({
  id: userId,
  fullName: "Alex Johnson",
  email: "alex@example.com",
  profileCompletion: mockStats.profileCompletion,
  educationLevel: "graduate",
  nationality: "Indian"
});

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

  async getProfile(userId: string): Promise<Profile> {
    return getProfileForUser(userId);
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

  async applyToOpportunity(userId: string, opportunityId: string, _note?: string): Promise<void> {
    const opportunity = await this.getOpportunityById(opportunityId);
    const nextActivity: ActivityItem = {
      id: `act-${userId}-${opportunityId}`,
      title: opportunity?.title ?? "Opportunity",
      status: "submitted",
      dateLabel: "Submitted just now"
    };
    const items = applicationsByUser.get(userId) ?? [];
    applicationsByUser.set(userId, [nextActivity, ...items].slice(0, 5));
  }

  async getDashboard(userId: string): Promise<DashboardPayload> {
    const saved = await this.listSavedOpportunities(userId);
    const profile = await this.getProfile(userId);
    const activity = applicationsByUser.get(userId) ?? mockActivity;
    const submitted = activity.filter((item) => item.status === "submitted").length;
    const awarded = activity.filter((item) => item.status === "awarded").length;
    const inProgress = activity.filter((item) => item.status === "in-progress").length;

    return {
      stats: {
        inProgress,
        submitted,
        awarded,
        profileCompletion: profile.profileCompletion
      },
      activity,
      recommended: saved.length > 0 ? saved : mockOpportunities.slice(0, 2)
    };
  }
}
