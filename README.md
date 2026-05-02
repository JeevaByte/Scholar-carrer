# Scholar Career Fullstack MVP

This workspace now includes a TypeScript monorepo that implements a working frontend and backend with Supabase-ready architecture.

## Monorepo structure
- `apps/web`: React + Vite frontend
- `apps/api`: Express API with validation, route modules, and Swagger docs
- `packages/shared`: Shared types and validation schemas
- `supabase/migrations`: SQL templates and RLS placeholders
- `docs/SUPABASE_HANDOFF.md`: Database integration checklist

## Features delivered
- Frontend pages:
  - Landing
  - Opportunities list with filtering and search
  - Opportunity detail + apply action
  - Saved opportunities
  - Dashboard stats + activity + recommendations
- Backend modules:
  - Profile
  - Opportunities
  - Saved opportunities
  - Applications
  - Dashboard
- Mock and Supabase repository switching by env
- Shared contracts via `@scholar-career/shared`
- Unit/integration-style tests for filtering and flow

## API endpoints
- `GET /health`
- `GET /docs`
- `GET /api/v1/opportunities`
- `GET /api/v1/opportunities/:id`
- `GET /api/v1/saved`
- `POST /api/v1/saved`
- `DELETE /api/v1/saved/:id`
- `POST /api/v1/applications`
- `GET /api/v1/dashboard`
- `GET /api/v1/profile`

## Environment variables
Copy `.env.example` at workspace root and set values:
- `NODE_ENV`
- `DATA_SOURCE`
- `API_PORT`
- `VITE_API_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Local run
Node and npm are required.

1. Install dependencies
```bash
npm install
```

2. Build shared package
```bash
npm run build -w @scholar-career/shared
```

3. Start backend
```bash
npm run dev -w @scholar-career/api
```

4. Start frontend (new terminal)
```bash
npm run dev -w @scholar-career/web
```

## Testing
```bash
npm run test
```

## Notes
- Current environment here did not have Node/npm installed, so runtime verification could not be executed in this session.
- Once Node is installed, run install/build/test and then push to GitHub.
