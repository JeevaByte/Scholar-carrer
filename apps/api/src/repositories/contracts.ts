import type {
  DashboardPayload,
  Opportunity,
  OpportunityFilterInput,
  PaginatedResponse,
  Profile
} from "@scholar-career/shared";

export interface DataRepository {
  listOpportunities(filters: OpportunityFilterInput): Promise<PaginatedResponse<Opportunity>>;
  getOpportunityById(id: string): Promise<Opportunity | null>;
  getProfile(userId: string): Promise<Profile>;
  saveOpportunity(userId: string, opportunityId: string): Promise<void>;
  unsaveOpportunity(userId: string, opportunityId: string): Promise<void>;
  listSavedOpportunities(userId: string): Promise<Opportunity[]>;
  applyToOpportunity(userId: string, opportunityId: string, note?: string): Promise<void>;
  getDashboard(userId: string): Promise<DashboardPayload>;
}
