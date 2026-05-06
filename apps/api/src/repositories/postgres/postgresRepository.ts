import type {
  ActivityItem,
  DashboardPayload,
  Opportunity,
  OpportunityFilterInput,
  PaginatedResponse,
  Profile
} from "@scholar-career/shared";
import type { QueryResultRow } from "pg";
import { postgres } from "./postgresClient.js";
import type { DataRepository } from "../contracts.js";

type OpportunityRow = QueryResultRow & {
  id: string;
  title: string;
  provider: string;
  summary: string;
  amount_label: string;
  amount_value: number;
  education_level: Opportunity["educationLevel"];
  location: Opportunity["location"];
  deadline_iso: string | Date;
  tags: Opportunity["tags"] | null;
};

const toOpportunity = (row: OpportunityRow): Opportunity => ({
  id: row.id,
  title: row.title,
  provider: row.provider,
  summary: row.summary,
  amountLabel: row.amount_label,
  amountValue: Number(row.amount_value),
  educationLevel: row.education_level,
  location: row.location,
  deadlineISO: row.deadline_iso instanceof Date ? row.deadline_iso.toISOString().slice(0, 10) : String(row.deadline_iso),
  tags: row.tags ?? []
});

export class PostgresRepository implements DataRepository {
  async listOpportunities(filters: OpportunityFilterInput): Promise<PaginatedResponse<Opportunity>> {
    const where: string[] = [];
    const values: unknown[] = [];

    if (filters.search) {
      values.push(`%${filters.search.trim()}%`);
      const index = values.length;
      where.push(`(title ILIKE $${index} OR provider ILIKE $${index} OR summary ILIKE $${index})`);
    }
    if (filters.educationLevel) {
      values.push(filters.educationLevel);
      where.push(`education_level = $${values.length}`);
    }
    if (filters.location) {
      values.push(filters.location);
      where.push(`location = $${values.length}`);
    }
    if (filters.minAmount !== undefined) {
      values.push(filters.minAmount);
      where.push(`amount_value >= $${values.length}`);
    }
    if (filters.maxAmount !== undefined) {
      values.push(filters.maxAmount);
      where.push(`amount_value <= $${values.length}`);
    }

    const whereClause = where.length > 0 ? `where ${where.join(" and ")}` : "";
    const orderBy =
      filters.sort === "amount"
        ? "order by amount_value desc"
        : filters.sort === "deadline"
          ? "order by deadline_iso asc"
          : "order by title asc";

    const countResult = await postgres.query<{ count: string }>(
      `select count(*)::text as count from opportunities ${whereClause}`,
      values
    );

    values.push(filters.pageSize, (filters.page - 1) * filters.pageSize);
    const itemsResult = await postgres.query<OpportunityRow>(
      `
        select
          id,
          title,
          provider,
          summary,
          amount_label,
          amount_value,
          education_level,
          location,
          deadline_iso,
          coalesce(
            (
              select array_agg(tag order by tag)
              from opportunity_tags
              where opportunity_id = opportunities.id
            ),
            '{}'
          ) as tags
        from opportunities
        ${whereClause}
        ${orderBy}
        limit $${values.length - 1}
        offset $${values.length}
      `,
      values
    );

    return {
      items: itemsResult.rows.map(toOpportunity),
      total: Number(countResult.rows[0]?.count ?? 0),
      page: filters.page,
      pageSize: filters.pageSize
    };
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    const result = await postgres.query<OpportunityRow>(
      `
        select
          id,
          title,
          provider,
          summary,
          amount_label,
          amount_value,
          education_level,
          location,
          deadline_iso,
          coalesce(
            (
              select array_agg(tag order by tag)
              from opportunity_tags
              where opportunity_id = opportunities.id
            ),
            '{}'
          ) as tags
        from opportunities
        where id = $1
      `,
      [id]
    );

    return result.rows[0] ? toOpportunity(result.rows[0]) : null;
  }

  async getProfile(userId: string): Promise<Profile> {
    const result = await postgres.query<
      QueryResultRow & {
        id: string;
        full_name: string;
        email: string;
        profile_completion: number;
        education_level: Profile["educationLevel"] | null;
        nationality: string | null;
      }
    >(
      `
        select id, full_name, email, profile_completion, education_level, nationality
        from profiles
        where id = $1
      `,
      [userId]
    );

    const row = result.rows[0];
    if (!row) {
      return {
        id: userId,
        fullName: "Demo User",
        email: "demo@example.com",
        profileCompletion: 0
      };
    }

    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      profileCompletion: Number(row.profile_completion),
      educationLevel: row.education_level ?? undefined,
      nationality: row.nationality ?? undefined
    };
  }

  async saveOpportunity(userId: string, opportunityId: string): Promise<void> {
    await postgres.query(
      `
        insert into saved_opportunities (user_id, opportunity_id)
        values ($1, $2)
        on conflict (user_id, opportunity_id) do nothing
      `,
      [userId, opportunityId]
    );
  }

  async unsaveOpportunity(userId: string, opportunityId: string): Promise<void> {
    await postgres.query(`delete from saved_opportunities where user_id = $1 and opportunity_id = $2`, [userId, opportunityId]);
  }

  async listSavedOpportunities(userId: string): Promise<Opportunity[]> {
    const result = await postgres.query<OpportunityRow>(
      `
        select
          o.id,
          o.title,
          o.provider,
          o.summary,
          o.amount_label,
          o.amount_value,
          o.education_level,
          o.location,
          o.deadline_iso,
          coalesce(
            (
              select array_agg(tag order by tag)
              from opportunity_tags
              where opportunity_id = o.id
            ),
            '{}'
          ) as tags
        from saved_opportunities s
        join opportunities o on o.id = s.opportunity_id
        where s.user_id = $1
        order by s.created_at desc
      `,
      [userId]
    );

    return result.rows.map(toOpportunity);
  }

  async applyToOpportunity(userId: string, opportunityId: string, note?: string): Promise<void> {
    await postgres.query(
      `insert into applications (user_id, opportunity_id, note) values ($1, $2, $3)`,
      [userId, opportunityId, note ?? null]
    );
  }

  async getDashboard(userId: string): Promise<DashboardPayload> {
    const [saved, profile, statsResult, activityResult, recommendedResult] = await Promise.all([
      this.listSavedOpportunities(userId),
      this.getProfile(userId),
      postgres.query<{
        in_progress: string;
        submitted: string;
        awarded: string;
        profile_completion: number | null;
      }>(
        `
          select
            count(*) filter (where a.status = 'in-progress')::text as in_progress,
            count(*) filter (where a.status = 'submitted')::text as submitted,
            count(*) filter (where a.status = 'awarded')::text as awarded,
            max(p.profile_completion) as profile_completion
          from profiles p
          left join applications a on a.user_id = p.id
          where p.id = $1
        `,
        [userId]
      ),
      postgres.query<ActivityItem & QueryResultRow>(
        `
          select id::text, title, status, date_label as "dateLabel"
          from activity_feed
          where user_id = $1
          order by created_at desc
          limit 5
        `,
        [userId]
      ),
      postgres.query<OpportunityRow>(
        `
          select
            id,
            title,
            provider,
            summary,
            amount_label,
            amount_value,
            education_level,
            location,
            deadline_iso,
            coalesce(
              (
                select array_agg(tag order by tag)
                from opportunity_tags
                where opportunity_id = opportunities.id
              ),
              '{}'
            ) as tags
          from opportunities
          order by deadline_iso asc
          limit 2
        `
      )
    ]);

    const stats = statsResult.rows[0];

    return {
      stats: {
        inProgress: Number(stats?.in_progress ?? 0),
        submitted: Number(stats?.submitted ?? 0),
        awarded: Number(stats?.awarded ?? 0),
        profileCompletion: profile.profileCompletion || Number(stats?.profile_completion ?? 0)
      },
      activity: activityResult.rows,
      recommended: saved.length > 0 ? saved : recommendedResult.rows.map(toOpportunity)
    };
  }
}
