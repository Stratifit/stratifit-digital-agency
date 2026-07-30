// ============================================================================
// Stratifit — Supabase Admin Client Helper
// ============================================================================

import { createSupabaseAdminClient } from "@/lib/supabase/client";

export function getAdminClient() {
  try {
    return createSupabaseAdminClient();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    throw new Error(`Supabase admin client failed: ${message}`);
  }
}
