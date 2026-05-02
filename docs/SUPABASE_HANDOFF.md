# Supabase Handoff Checklist

## What is already done in code
- Repository pattern implemented in API:
  - Mock mode: `MockRepository`
  - Supabase mode: `SupabaseRepository`
- Data source switch via `DATA_SOURCE=mock|supabase`
- SQL baseline template created in `supabase/migrations/001_initial_schema.sql`
- API expects these logical entities:
  - profiles
  - opportunities
  - opportunity_tags
  - saved_opportunities
  - applications
  - activity_feed

## Confirm with database owner
1. Final table names and column names.
2. Primary key type (UUID vs bigint) for each table.
3. Relationship and foreign key directions.
4. Auth model (`auth.users` mapping to `profiles.id`).
5. RLS policy behavior for public vs authenticated reads.

## Mapping checklist
1. If column names differ, update mapping in:
   - `apps/api/src/repositories/supabase/supabaseRepository.ts`
2. If junction/table structure differs, update:
   - `listSavedOpportunities`
   - `saveOpportunity`
   - `applyToOpportunity`
3. If dashboard stats are computed in SQL, replace static stats in:
   - `getDashboard`

## Runtime setup
1. Set env values:
   - `DATA_SOURCE=supabase`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Apply SQL migration.
3. Seed minimum opportunities rows.
4. Start API and open `/docs` for endpoint validation.
