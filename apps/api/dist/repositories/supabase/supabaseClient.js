import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";
const fallbackUrl = "http://localhost:54321";
const fallbackKey = "mock-service-role-key";
export const supabase = createClient(env.supabaseUrl || fallbackUrl, env.supabaseServiceRoleKey || env.supabaseAnonKey || fallbackKey);
