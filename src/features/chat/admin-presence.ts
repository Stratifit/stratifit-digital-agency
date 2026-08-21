import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import {
  ADMIN_ONLINE_WINDOW_MS,
  isWithinOnlineWindow,
} from "./admin-presence-utils";

export { ADMIN_ONLINE_WINDOW_MS, isWithinOnlineWindow };

/**
 * True when at least one admin has pinged presence within the freshness
 * window. Used by the chatbot to decide whether a human handoff is possible.
 * Best-effort: on any failure the bot assumes nobody is online rather than
 * promising a team member who may not be there.
 */
export async function isAnyAdminOnline(): Promise<boolean> {
  try {
    const supabase = createSupabaseServiceRoleClient();
    const since = new Date(Date.now() - ADMIN_ONLINE_WINDOW_MS).toISOString();
    const { data, error } = await supabase
      .from("chat_admin_presence")
      .select("user_id")
      .gte("last_seen_at", since)
      .limit(1);
    return !error && (data?.length ?? 0) > 0;
  } catch {
    return false;
  }
}
