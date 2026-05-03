# Master Prompt: Build Working Frontend + Backend + Supabase + GitHub

You are a senior full-stack engineer. Build a production-quality MVP from my existing design prototype and make it fully working end-to-end.

## Project Context
- I already have UI design and sample HTML templates for Scholar Career.
- Source design files are in the workspace under `scholar_carrer`.
- Goal: working frontend + backend + Supabase integration + GitHub push-ready project.
- My friend is creating the database in Supabase, so design for progressive integration: work now with mock data and switch cleanly to Supabase tables when schema is ready.

## Execution Mode
- Do the work directly in the workspace.
- Do not stop at planning. Implement, run, fix, verify.
- If blocked by missing schema details, continue with assumptions and document exactly what needs confirmation.
- Keep commits clean and meaningful.

## Technical Requirements
### 1. Architecture
- Create a monorepo with:
  - web app (frontend)
  - api service (backend)
  - shared package (types, validation schemas, constants)
- Use TypeScript everywhere.
- Add environment-based config and example env files.

### 2. Frontend
- Build responsive pages based on existing design language:
  - Landing
  - Opportunities listing with filters and search
  - Scholarship detail
  - User dashboard
  - Saved opportunities
- Reuse a consistent design system (colors, spacing, typography, component style).
- Add loading, empty, and error states.
- Add auth-aware navigation (signed in vs signed out).

### 3. Backend
- Create REST API with clear versioned routes, validation, and error handling.
- Minimum modules:
  - Auth/profile
  - Opportunities
  - Saved opportunities
  - Applications
  - Dashboard stats/activity
- Add pagination, filtering, and sorting for opportunities.
- Add API docs endpoint (OpenAPI/Swagger preferred).

### 4. Supabase Readiness
- Integrate Supabase client and auth flow.
- Implement repository pattern:
  - Mock repository for immediate development
  - Supabase repository for real data
- Switch data source using env flag.
- Prepare SQL migration scripts/templates for expected tables:
  - users/profile
  - opportunities
  - opportunity_tags
  - saved_opportunities
  - applications
  - activity_feed
- Add Row Level Security policy placeholders and document assumptions.
- Provide a handoff checklist for my friend to map final schema to code quickly.

### 5. Quality
- Add linting, formatting, and pre-commit hooks.
- Add unit tests for core backend services and frontend state logic.
- Add one integration test path (list opportunities -> save -> dashboard reflects change).
- Ensure no hardcoded secrets.

### 6. Dev Experience
- Add scripts for:
  - install
  - dev
  - build
  - test
  - lint
  - format
- Add seed data for local mock mode.
- Write a clear README with setup steps, architecture, env vars, and deployment notes.

## GitHub Workflow
- Initialize git if needed.
- Create a feature branch named `feat/fullstack-mvp`.
- Commit in logical chunks with clear commit messages.
- Push branch to GitHub remote.
- Generate a PR-ready summary including:
  - what was built
  - screenshots or page list
  - API route list
  - env vars required
  - test results
  - known gaps and next actions for Supabase schema finalization

## Definition of Done
- App runs locally without manual patching.
- Frontend is navigable and connected to backend endpoints.
- Mock mode works fully.
- Supabase mode is wired and documented with schema assumptions.
- Lint and tests pass.
- Branch is pushed and ready for PR.

## Output Format While Working
- Show short progress updates after each major milestone.
- At the end provide:
  1. Final architecture tree
  2. Commands to run locally
  3. Env variables list
  4. API endpoints summary
  5. Supabase integration status and pending schema confirmations
  6. Git branch and push status
