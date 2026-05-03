import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { ZodError } from "zod";
import { env } from "./config/env.js";
import { registerOpportunityRoutes } from "./modules/opportunities.js";
import { registerSavedRoutes } from "./modules/saved.js";
import { registerApplicationRoutes } from "./modules/applications.js";
import { registerDashboardRoutes } from "./modules/dashboard.js";
import { registerProfileRoutes } from "./modules/profile.js";
import { MockRepository } from "./repositories/mock/mockRepository.js";
import { PostgresRepository } from "./repositories/postgres/postgresRepository.js";
import { SupabaseRepository } from "./repositories/supabase/supabaseRepository.js";
const openApiDoc = {
    openapi: "3.0.0",
    info: {
        title: "Scholar Career API",
        version: "1.0.0"
    },
    servers: [{ url: "http://localhost:4000/api/v1" }],
    paths: {
        "/opportunities": { get: { summary: "List opportunities" } },
        "/opportunities/{id}": { get: { summary: "Get opportunity detail" } },
        "/saved": { get: { summary: "List saved opportunities" }, post: { summary: "Save opportunity" } },
        "/applications": { post: { summary: "Apply to opportunity" } },
        "/dashboard": { get: { summary: "Get dashboard" } }
    }
};
const repo = env.dataSource === "postgres"
    ? new PostgresRepository()
    : env.dataSource === "supabase"
        ? new SupabaseRepository()
        : new MockRepository();
export const app = express();
app.use(cors());
app.use(express.json());
app.use((req, _res, next) => {
    req.repo = repo;
    next();
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok", dataSource: env.dataSource, usesDatabaseUrl: Boolean(env.databaseUrl) });
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
const api = express.Router();
registerOpportunityRoutes(api);
registerSavedRoutes(api);
registerApplicationRoutes(api);
registerDashboardRoutes(api);
registerProfileRoutes(api);
app.use("/api/v1", api);
app.use((error, _req, res, _next) => {
    if (error instanceof ZodError) {
        res.status(400).json({ message: "Validation failed", issues: error.flatten() });
        return;
    }
    const message = typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : String(error);
    const code = typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : undefined;
    const details = typeof error === "object" && error !== null && "details" in error
        ? error.details
        : undefined;
    res.status(500).json({ message: "Internal error", error: message, code, details });
});
