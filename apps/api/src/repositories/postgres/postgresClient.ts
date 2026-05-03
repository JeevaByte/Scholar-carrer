import { Pool } from "pg";
import { env } from "../../config/env.js";

export const postgres = new Pool({
  connectionString: env.databaseUrl || undefined,
  ssl: env.databaseUrl && env.databaseSslMode !== "disable" ? { rejectUnauthorized: false } : false
});