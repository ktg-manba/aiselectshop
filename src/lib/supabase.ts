import { createClient } from "@supabase/supabase-js";

const url = process.env.MEMFIREDB_URL;
const anonKey = process.env.MEMFIREDB_ANON_KEY;
const serviceKey = process.env.MEMFIREDB_SERVICE_KEY;

export function createAdminSupabaseClient() {
  if (!url || !serviceKey) {
    throw new Error("MEMFIREDB_URL or MEMFIREDB_SERVICE_KEY is not set");
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export function createPublicSupabaseClient() {
  if (!url || !anonKey) {
    throw new Error("MEMFIREDB_URL or MEMFIREDB_ANON_KEY is not set");
  }
  return createClient(url, anonKey, { auth: { persistSession: false } });
}
