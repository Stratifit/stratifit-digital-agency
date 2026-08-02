import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

export interface AuditLogInput {
  action: string;
  target_table: string;
  target_id?: string | null;
  previous_data?: Json;
  new_data?: Json;
  metadata?: Json;
}

/**
 * Records a high-value action in audit_logs.
 * Never throws: audit failures must not break the primary operation.
 */
export async function recordAuditLog(input: AuditLogInput): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("audit_logs").insert({
      actor_user_id: user?.id ?? null,
      action: input.action,
      target_table: input.target_table,
      target_id: input.target_id ?? null,
      previous_data: input.previous_data ?? null,
      new_data: input.new_data ?? null,
      metadata: input.metadata ?? {},
    });
  } catch (error) {
    console.error("Audit log error:", error instanceof Error ? error.message : error);
  }
}
