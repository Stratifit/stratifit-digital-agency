// ============================================================================
// Stratifit — Supabase Client
// Environment-based configuration with separate client helpers.
// ============================================================================

import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for browser / client components.
 * Uses the anon key — safe to expose.
 */
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
    );
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return key;
}

function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return key;
}

/** Public client — use in client components and server components for RLS-limited queries */
export function createSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}

/** Service-role client — use ONLY in server-side contexts (API routes, server actions, migrations) */
export function createSupabaseAdminClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey());
}
