# Scholar Career Fullstack MVP

Scholar Career is a TypeScript monorepo with a React frontend, an Express API, shared contracts, and Supabase-ready schema/migrations.

## Architecture

- `apps/web` — React + Vite frontend
- `apps/api` — Express API with repository-backed modules and Swagger docs
- `packages/shared` — shared types and Zod validation schemas
- `supabase/migrations` — baseline schema, RLS policies, and demo seed data
- `docs/SUPABASE_HANDOFF.md` — Supabase/runtime integration notes
- `.github/workflows` — CI and deployment validation workflows

## Current product scope

- Opportunity discovery with search, filters, sorting, and pagination
- Opportunity detail with save/apply actions
- Saved opportunities management
- Dashboard stats, activity, and recommendations
- Profile endpoint and profile-aware top navigation
- Mock, Postgres, and Supabase repository modes

## Demo-ready vs production-ready

### Demo-ready behavior

- API falls back to a demo user when no `x-user-id` header is supplied
- Mock repository provides deterministic profile, saved, application, and dashboard data
- `/todos` is a Supabase smoke-test page and is disabled unless explicitly enabled

### Production-oriented improvements now included

- Real workspace typecheck/format scripts replaced placeholder commands
- Route-level API tests and shared/web test coverage added
- CI workflows validate format, typecheck, build, test, and deployment builds
- Supabase and Postgres repositories align with the `opportunity_tags` junction table
- RLS migration templates now include concrete ownership policies

## Environment

Copy `/home/runner/work/Scholar-carrer/Scholar-carrer/.env.example` and set the values you need.

Important variables:

- `DATA_SOURCE=mock|postgres|supabase`
- `API_PORT`
- `DATABASE_URL`
- `PGSSLMODE`
- `DEMO_USER_ID`
- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_ENABLE_SUPABASE_TODOS`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Local development

1. Install dependencies
   ```bash
   npm install
   ```
2. Run the shared build once
   ```bash
   npm run build -w @scholar-career/shared
   ```
3. Start the API
   ```bash
   npm run dev -w @scholar-career/api
   ```
4. Start the web app in another terminal
   ```bash
   npm run dev -w @scholar-career/web
   ```

## Validation commands

```bash
npm run format
npm run typecheck
npm run build
npm run test
```

## Deployment assumptions

- `apps/web/vercel.json` builds the shared package and web app for a static Vite deploy
- `apps/api/vercel.json` builds the shared package and API, then serves `apps/api/dist/app.js`
- Vercel and GitHub Actions expect workspace installs from the repository root
- Supabase credentials should be provided through deployment environment variables, not committed files

## API surface

- `GET /health`
- `GET /docs`
- `GET /api/v1/profile`
- `GET /api/v1/opportunities`
- `GET /api/v1/opportunities/:id`
- `GET /api/v1/saved`
- `POST /api/v1/saved`
- `DELETE /api/v1/saved/:id`
- `POST /api/v1/applications`
- `GET /api/v1/dashboard`
