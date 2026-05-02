import type {
  DashboardPayload,
  Opportunity,
  OpportunityFilterInput,
  PaginatedResponse
} from "@scholar-career/shared";
import type { DataRepository } from "../contracts.js";
import { supabase } from "./supabaseClient.js";

export class SupabaseRepository implements DataRepository {
  async listOpportunities(filters: OpportunityFilterInput): Promise<PaginatedResponse<Opportunity>> {
    let query = supabase
      .from("opportunities")
      .select("*", { count: "exact" })
      .range((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize - 1);

    if (filters.search) query = query.ilike("title", `%${filters.search}%`);
    if (filters.educationLevel) query = query.eq("education_level", filters.educationLevel);
    if (filters.location) query = query.eq("location", filters.location);

    const { data, count, error } = await query;
    if (error) throw error;

    const items = (data ?? []).map((row: any) => ({
      id: row.id,
      title: row.title,
      provider: row.provider,
      summary: row.summary,
      amountLabel: row.amount_label,
      amountValue: row.amount_value,
      educationLevel: row.education_level,
      location: row.location,
      deadlineISO: row.deadline_iso,
      tags: row.tags ?? []
    })) as Opportunity[];

    return {
      items,
      total: count ?? items.length,
      page: filters.page,
      pageSize: filters.pageSize
    };
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).single();
    if (error) return null;
    return {
      id: data.id,
      title: data.title,
      provider: data.provider,
      summary: data.summary,
      amountLabel: data.amount_label,
      amountValue: data.amount_value,
      educationLevel: data.education_level,
      location: data.location,
      deadlineISO: data.deadline_iso,
      tags: data.tags ?? []
    } as Opportunity;
  }

  async saveOpportunity(userId: string, opportunityId: string): Promise<void> {
    await supabase.from("saved_opportunities").insert({ user_id: userId, opportunity_id: opportunityId });
  }

  async unsaveOpportunity(userId: string, opportunityId: string): Promise<void> {
    await supabase
      .from("saved_opportunities")
      .delete()
      .eq("user_id", userId)
      .eq("opportunity_id", opportunityId);
  }

  async listSavedOpportunities(userId: string): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from("saved_opportunities")
      .select("opportunities(*)")
      .eq("user_id", userId);

    if (error) throw error;

    return (data ?? [])
      .map((row: any) => row.opportunities)
      .filter(Boolean)
      .map((op: any) => ({
        id: op.id,
        title: op.title,
        provider: op.provider,
        summary: op.summary,
        amountLabel: op.amount_label,
        amountValue: op.amount_value,
        educationLevel: op.education_level,
        location: op.location,
        deadlineISO: op.deadline_iso,
        tags: op.tags ?? []
      }));
  }

  async applyToOpportunity(userId: string, opportunityId: string, note?: string): Promise<void> {
    await supabase.from("applications").insert({ user_id: userId, opportunity_id: opportunityId, note: note ?? null });
  }

  async getDashboard(userId: string): Promise<DashboardPayload> {
    const saved = await this.listSavedOpportunities(userId);
    return {
      stats: {
        inProgress: 0,
        submitted: 0,
        awarded: 0,
        profileCompletion: 0
      },
      activity: [],
      recommended: saved
    };
  }
}
