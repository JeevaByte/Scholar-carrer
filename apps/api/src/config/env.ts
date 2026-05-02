import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

type DataSource = "mock" | "supabase";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.API_PORT ?? 4000),
  dataSource: (process.env.DATA_SOURCE as DataSource) ?? "mock",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
};
