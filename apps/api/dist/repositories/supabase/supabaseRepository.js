import { supabase } from "./supabaseClient.js";
export class SupabaseRepository {
    async listOpportunities(filters) {
        let query = supabase
            .from("opportunities")
            .select("*", { count: "exact" })
            .range((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize - 1);
        if (filters.search)
            query = query.ilike("title", `%${filters.search}%`);
        if (filters.educationLevel)
            query = query.eq("education_level", filters.educationLevel);
        if (filters.location)
            query = query.eq("location", filters.location);
        if (filters.minAmount !== undefined)
            query = query.gte("amount_value", filters.minAmount);
        if (filters.maxAmount !== undefined)
            query = query.lte("amount_value", filters.maxAmount);
        if (filters.sort === "amount")
            query = query.order("amount_value", { ascending: false });
        if (filters.sort === "deadline")
            query = query.order("deadline_iso", { ascending: true });
        const { data, count, error } = await query;
        if (error)
            throw error;
        const items = (data ?? []).map((row) => ({
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
        }));
        return {
            items,
            total: count ?? items.length,
            page: filters.page,
            pageSize: filters.pageSize
        };
    }
    async getOpportunityById(id) {
        const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).single();
        if (error)
            return null;
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
        };
    }
    async saveOpportunity(userId, opportunityId) {
        await supabase.from("saved_opportunities").insert({ user_id: userId, opportunity_id: opportunityId });
    }
    async unsaveOpportunity(userId, opportunityId) {
        await supabase
            .from("saved_opportunities")
            .delete()
            .eq("user_id", userId)
            .eq("opportunity_id", opportunityId);
    }
    async listSavedOpportunities(userId) {
        const { data, error } = await supabase
            .from("saved_opportunities")
            .select("opportunities(*)")
            .eq("user_id", userId);
        if (error)
            throw error;
        return (data ?? [])
            .map((row) => row.opportunities)
            .filter(Boolean)
            .map((op) => ({
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
    async applyToOpportunity(userId, opportunityId, note) {
        await supabase.from("applications").insert({ user_id: userId, opportunity_id: opportunityId, note: note ?? null });
    }
    async getDashboard(userId) {
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
