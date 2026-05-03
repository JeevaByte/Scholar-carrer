import { postgres } from "./postgresClient.js";
const toOpportunity = (row) => ({
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
export class PostgresRepository {
    async listOpportunities(filters) {
        const where = [];
        const values = [];
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
        const orderBy = filters.sort === "amount"
            ? "order by amount_value desc"
            : filters.sort === "deadline"
                ? "order by deadline_iso asc"
                : "order by title asc";
        const countResult = await postgres.query(`select count(*)::text as count from opportunities ${whereClause}`, values);
        values.push(filters.pageSize, (filters.page - 1) * filters.pageSize);
        const itemsResult = await postgres.query(`
        select id, title, provider, summary, amount_label, amount_value, education_level, location, deadline_iso, tags
        from opportunities
        ${whereClause}
        ${orderBy}
        limit $${values.length - 1}
        offset $${values.length}
      `, values);
        return {
            items: itemsResult.rows.map(toOpportunity),
            total: Number(countResult.rows[0]?.count ?? 0),
            page: filters.page,
            pageSize: filters.pageSize
        };
    }
    async getOpportunityById(id) {
        const result = await postgres.query(`
        select id, title, provider, summary, amount_label, amount_value, education_level, location, deadline_iso, tags
        from opportunities
        where id = $1
      `, [id]);
        return result.rows[0] ? toOpportunity(result.rows[0]) : null;
    }
    async saveOpportunity(userId, opportunityId) {
        await postgres.query(`
        insert into saved_opportunities (user_id, opportunity_id)
        values ($1, $2)
        on conflict (user_id, opportunity_id) do nothing
      `, [userId, opportunityId]);
    }
    async unsaveOpportunity(userId, opportunityId) {
        await postgres.query(`delete from saved_opportunities where user_id = $1 and opportunity_id = $2`, [userId, opportunityId]);
    }
    async listSavedOpportunities(userId) {
        const result = await postgres.query(`
        select o.id, o.title, o.provider, o.summary, o.amount_label, o.amount_value, o.education_level, o.location, o.deadline_iso, o.tags
        from saved_opportunities s
        join opportunities o on o.id = s.opportunity_id
        where s.user_id = $1
        order by s.created_at desc
      `, [userId]);
        return result.rows.map(toOpportunity);
    }
    async applyToOpportunity(userId, opportunityId, note) {
        await postgres.query(`insert into applications (user_id, opportunity_id, note) values ($1, $2, $3)`, [userId, opportunityId, note ?? null]);
    }
    async getDashboard(userId) {
        const [saved, statsResult, activityResult] = await Promise.all([
            this.listSavedOpportunities(userId),
            postgres.query(`
          select
            count(*) filter (where a.status = 'in-progress')::text as in_progress,
            count(*) filter (where a.status = 'submitted')::text as submitted,
            count(*) filter (where a.status = 'awarded')::text as awarded,
            max(p.profile_completion) as profile_completion
          from profiles p
          left join applications a on a.user_id = p.id
          where p.id = $1
        `, [userId]),
            postgres.query(`
          select id::text, title, status, date_label as "dateLabel"
          from activity_feed
          where user_id = $1
          order by created_at desc
          limit 5
        `, [userId])
        ]);
        const stats = statsResult.rows[0];
        return {
            stats: {
                inProgress: Number(stats?.in_progress ?? 0),
                submitted: Number(stats?.submitted ?? 0),
                awarded: Number(stats?.awarded ?? 0),
                profileCompletion: Number(stats?.profile_completion ?? 0)
            },
            activity: activityResult.rows,
            recommended: saved
        };
    }
}
