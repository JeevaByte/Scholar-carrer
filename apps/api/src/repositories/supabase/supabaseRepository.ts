import type {
  ActivityItem,
  DashboardPayload,
  Opportunity,
  OpportunityTag,
  OpportunityFilterInput,
  PaginatedResponse,
  Profile
} from "@scholar-career/shared";
import type { DataRepository } from "../contracts.js";
import { supabase } from "./supabaseClient.js";

type SupabaseTagRow = {
  tag: OpportunityTag;
};

type SupabaseOpportunityRow = {
  id: string;
  title: string;
  provider: string;
  summary: string;
  amount_label: string;
  amount_value: number;
  education_level: Opportunity["educationLevel"];
  location: Opportunity["location"];
  deadline_iso: string;
  opportunity_tags?: SupabaseTagRow[] | null;
};

type SupabaseSavedOpportunityRow = {
  opportunities: SupabaseOpportunityRow | null;
};

type SupabaseProfileRow = {
  id: string;
  full_name: string;
  email: string;
  profile_completion: number;
  education_level: Profile["educationLevel"] | null;
  nationality: string | null;
};

type SupabaseApplicationRow = {
  status: ActivityItem["status"];
};

type SupabaseActivityRow = {
  id: string | number;
  title: string;
  status: ActivityItem["status"];
  date_label: string;
};

const toOpportunity = (row: SupabaseOpportunityRow): Opportunity => ({
  id: row.id,
  title: row.title,
  provider: row.provider,
  summary: row.summary,
  amountLabel: row.amount_label,
  amountValue: row.amount_value,
  educationLevel: row.education_level,
  location: row.location,
  deadlineISO: row.deadline_iso,
  tags: row.opportunity_tags?.map((item) => item.tag) ?? []
});

export class SupabaseRepository implements DataRepository {
  async listOpportunities(filters: OpportunityFilterInput): Promise<PaginatedResponse<Opportunity>> {
    let query = supabase
      .from("opportunities")
      .select(
        "id, title, provider, summary, amount_label, amount_value, education_level, location, deadline_iso, opportunity_tags(tag)",
        { count: "exact" }
      )
      .range((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize - 1);

    if (filters.search) query = query.ilike("title", `%${filters.search}%`);
    if (filters.educationLevel) query = query.eq("education_level", filters.educationLevel);
    if (filters.location) query = query.eq("location", filters.location);
    if (filters.minAmount !== undefined) query = query.gte("amount_value", filters.minAmount);
    if (filters.maxAmount !== undefined) query = query.lte("amount_value", filters.maxAmount);
    if (filters.sort === "amount") query = query.order("amount_value", { ascending: false });
    if (filters.sort === "deadline") query = query.order("deadline_iso", { ascending: true });

    const { data, count, error } = await query;
    if (error) throw error;

    const items = ((data ?? []) as SupabaseOpportunityRow[]).map(toOpportunity);

    return {
      items,
      total: count ?? items.length,
      page: filters.page,
      pageSize: filters.pageSize
    };
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const { data, error } = await supabase
      .from("opportunities")
      .select("id, title, provider, summary, amount_label, amount_value, education_level, location, deadline_iso, opportunity_tags(tag)")
      .eq("id", id)
      .single<SupabaseOpportunityRow>();
    if (error) return null;
    return toOpportunity(data);
  }

  async getProfile(userId: string): Promise<Profile> {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email, profile_completion, education_level, nationality")
      .eq("id", userId)
      .maybeSingle<SupabaseProfileRow>();

    if (!data) {
      return {
        id: userId,
        fullName: "Demo User",
        email: "demo@example.com",
        profileCompletion: 0
      };
    }

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      profileCompletion: data.profile_completion,
      educationLevel: data.education_level ?? undefined,
      nationality: data.nationality ?? undefined
    };
  }

  async saveOpportunity(userId: string, opportunityId: string): Promise<void> {
    const { error } = await supabase
      .from("saved_opportunities")
      .upsert({ user_id: userId, opportunity_id: opportunityId }, { onConflict: "user_id,opportunity_id" });
    if (error) throw error;
  }

  async unsaveOpportunity(userId: string, opportunityId: string): Promise<void> {
    const { error } = await supabase
      .from("saved_opportunities")
      .delete()
      .eq("user_id", userId)
      .eq("opportunity_id", opportunityId);
    if (error) throw error;
  }

  async listSavedOpportunities(userId: string): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from("saved_opportunities")
      .select(
        "opportunities(id, title, provider, summary, amount_label, amount_value, education_level, location, deadline_iso, opportunity_tags(tag))"
      )
      .eq("user_id", userId);

    if (error) throw error;

    return ((data ?? []) as SupabaseSavedOpportunityRow[])
      .map((row) => row.opportunities)
      .filter(Boolean)
      .map((opportunity) => toOpportunity(opportunity));
  }

  async applyToOpportunity(userId: string, opportunityId: string, note?: string): Promise<void> {
    const { error } = await supabase
      .from("applications")
      .insert({ user_id: userId, opportunity_id: opportunityId, note: note ?? null, status: "submitted" });
    if (error) throw error;
  }

  async getDashboard(userId: string): Promise<DashboardPayload> {
    const [saved, profile, applicationsResult, activityResult, recommendationsResult] = await Promise.all([
      this.listSavedOpportunities(userId),
      this.getProfile(userId),
      supabase.from("applications").select("status").eq("user_id", userId),
      supabase.from("activity_feed").select("id, title, status, date_label").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
      supabase
        .from("opportunities")
        .select("id, title, provider, summary, amount_label, amount_value, education_level, location, deadline_iso, opportunity_tags(tag)")
        .order("deadline_iso", { ascending: true })
        .limit(2)
    ]);

    if (applicationsResult.error) throw applicationsResult.error;
    if (activityResult.error) throw activityResult.error;
    if (recommendationsResult.error) throw recommendationsResult.error;

    const applications = (applicationsResult.data ?? []) as SupabaseApplicationRow[];
    const activity = ((activityResult.data ?? []) as SupabaseActivityRow[]).map((row) => ({
      id: String(row.id),
      title: row.title,
      status: row.status,
      dateLabel: row.date_label
    }));
    const fallbackRecommended = ((recommendationsResult.data ?? []) as SupabaseOpportunityRow[]).map(toOpportunity);

    return {
      stats: {
        inProgress: applications.filter((item) => item.status === "in-progress").length,
        submitted: applications.filter((item) => item.status === "submitted").length,
        awarded: applications.filter((item) => item.status === "awarded").length,
        profileCompletion: profile.profileCompletion
      },
      activity,
      recommended: saved.length > 0 ? saved : fallbackRecommended
    };
  }
}
