"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { runImapFetch, type ImapFetchSummary } from "./fetch";
import type { ActionResult } from "@/types/action-result";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("user_id", user.id)
    .single();
  if (!admin || admin.status !== "active") {
    redirect("/admin/login");
  }
  return supabase;
}

/**
 * Dashboard \"Sync IMAP inbox\" button. Requires an active admin session,
 * runs one IMAP sweep, and returns the summary for inline feedback.
 */
export async function syncImapInboxAction(): Promise<
  ActionResult<{ summary: ImapFetchSummary }>
> {
  await requireAdmin();
  const summary = await runImapFetch();
  if (!summary.ok) {
    return {
      success: false,
      error: summary.error ?? "IMAP sync failed.",
    };
  }
  return { success: true, data: { summary } };
}
