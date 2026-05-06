import type {
  DashboardPayload,
  Opportunity,
  PaginatedResponse,
  Profile,
} from "@scholar-career/shared";

const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const json = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const empty = async (path: string, init?: RequestInit): Promise<void> => {
  const response = await fetch(`${base}${path}`, init);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
};

export const api = {
  listOpportunities: (query = "") =>
    json<PaginatedResponse<Opportunity>>(`/api/v1/opportunities${query}`),
  getOpportunity: (id: string) =>
    json<Opportunity>(`/api/v1/opportunities/${id}`),
  profile: () => json<Profile>("/api/v1/profile"),
  listSaved: () => json<{ items: Opportunity[] }>("/api/v1/saved"),
  save: (opportunityId: string) =>
    json<{ message: string }>("/api/v1/saved", {
      method: "POST",
      body: JSON.stringify({ opportunityId }),
    }),
  unsave: (id: string) => empty(`/api/v1/saved/${id}`, { method: "DELETE" }),
  apply: (opportunityId: string) =>
    json<{ message: string }>("/api/v1/applications", {
      method: "POST",
      body: JSON.stringify({ opportunityId }),
    }),
  dashboard: () => json<DashboardPayload>("/api/v1/dashboard"),
};
