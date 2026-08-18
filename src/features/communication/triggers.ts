import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { TRIGGER_EVENTS, type TriggerEvent } from "./types";

export { TRIGGER_EVENTS };
export type { TriggerEvent };

/** Human-readable labels for the triggers admin UI. */
export const TRIGGER_EVENT_LABELS: Record<TriggerEvent, string> = {
  lead_created: "Lead created",
  inbound_email: "Inbound email received",
  project_started: "Project started",
  milestone_reached: "Milestone reached",
  project_delayed: "Project delayed",
  problem_detected: "Problem detected",
  revision_requested: "Revision requested",
  project_completed: "Project completed",
  invoice_sent: "Invoice sent",
  payment_received: "Payment received",
  payment_failed: "Payment failed",
  payment_upcoming: "Upcoming payment",
  payment_overdue: "Payment overdue",
  meeting_scheduled: "Meeting scheduled",
  document_needed: "Document needed",
  approval_needed: "Approval needed",
  inactive_client: "Inactive client",
  file_uploaded: "File uploaded",
  form_submitted: "Form submitted",
};

/**
 * Default event → template mapping (used when no automation_triggers row
 * exists yet). Admins can override per event in the dashboard.
 */
export const DEFAULT_TRIGGER_MAP: Record<TriggerEvent, string> = {
  lead_created: "form_submission",
  inbound_email: "email_received",
  project_started: "project_start",
  milestone_reached: "milestone_reached",
  project_delayed: "delay_notification",
  problem_detected: "problem_detected",
  revision_requested: "revision_requested",
  project_completed: "project_completed",
  invoice_sent: "invoice_sent",
  payment_received: "payment_received",
  payment_failed: "payment_failed",
  payment_upcoming: "payment_upcoming",
  payment_overdue: "payment_overdue",
  meeting_scheduled: "meeting_reminder",
  document_needed: "document_needed",
  approval_needed: "approval_needed",
  inactive_client: "inactive_follow_up",
  file_uploaded: "file_upload",
  form_submitted: "form_submission",
};

/**
 * Resolve the template key for a business event. Prefers the admin-configured
 * `automation_triggers` row (when enabled), falls back to the defaults.
 * Returns null when the event has no enabled trigger.
 */
export async function resolveTriggerTemplateKey(
  eventType: TriggerEvent
): Promise<string | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data } = await supabase
    .from("automation_triggers")
    .select("template_key, enabled")
    .eq("event_type", eventType)
    .maybeSingle();

  if (data) {
    return data.enabled && data.template_key ? data.template_key : null;
  }
  // No row configured yet → fall back to the seed defaults (enabled).
  return DEFAULT_TRIGGER_MAP[eventType] ?? null;
}
