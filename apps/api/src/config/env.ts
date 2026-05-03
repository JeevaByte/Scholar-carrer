import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Support running from either monorepo root or apps/api directly.
// Wrap in try-catch to handle missing files gracefully in serverless environments
try {
  dotenv.config({ path: path.resolve(__dirname, "../../.env") });
  dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
} catch {
  // Silently fail - environment variables should be set in the deployment environment
}

type DataSource = "mock" | "supabase" | "postgres";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.API_PORT ?? 4000),
  dataSource: (process.env.DATA_SOURCE as DataSource) ?? "mock",
  databaseUrl: process.env.DATABASE_URL ?? "",
  databaseSslMode: process.env.PGSSLMODE ?? "require",
  supabaseUrl: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey:
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
};
