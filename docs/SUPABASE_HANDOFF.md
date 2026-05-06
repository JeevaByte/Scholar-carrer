# Supabase Handoff Checklist

## Implemented alignment

- API repository modes: mock, postgres, and supabase
- Request-scoped user resolution via `x-user-id` header with `DEMO_USER_ID` fallback
- Shared profile contract used by API and web
- Opportunity tags resolved through the `opportunity_tags` junction table
- Dashboard/profile/application/saved flows now read from repository implementations instead of static route payloads
- SQL migrations now include concrete RLS ownership policies instead of placeholder comments

## Expected tables

- `profiles`
- `opportunities`
- `opportunity_tags`
- `saved_opportunities`
- `applications`
- `activity_feed`
- `todos` (demo-only smoke-test page)

## Current code assumptions

1. `profiles.id` maps to the authenticated user ID.
2. `opportunity_tags` stores one row per tag and is joined back into opportunities.
3. `saved_opportunities` uses a unique `(user_id, opportunity_id)` pair.
4. `applications.status` is one of `in-progress`, `submitted`, or `awarded`.
5. `activity_feed.date_label` is already formatted for UI display.

## Files to update if schema changes

- `apps/api/src/repositories/supabase/supabaseRepository.ts`
- `apps/api/src/repositories/postgres/postgresRepository.ts`
- `packages/shared/src/types.ts`
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_app_seed_and_todos.sql`

## Runtime setup

1. Set:
   - `DATA_SOURCE=supabase`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - optional `DEMO_USER_ID`
2. Apply:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_app_seed_and_todos.sql`
3. Start the API and web app from the repo root.

## Quick verification

1. `GET /health` returns `dataSource: supabase`
2. `GET /api/v1/profile` returns the current profile
3. `GET /api/v1/opportunities` returns opportunities with `tags`
4. `GET /api/v1/dashboard` returns profile-based stats and activity
5. Set `VITE_ENABLE_SUPABASE_TODOS=true` only if you want the demo `/todos` page enabled

## Remaining external decisions

1. Whether `profiles.id` should be managed directly from `auth.users`
2. Whether `activity_feed.date_label` should stay presentation-ready or move to timestamps
3. Whether dashboard recommendations should eventually come from ranking logic instead of saved/latest fallbacks
