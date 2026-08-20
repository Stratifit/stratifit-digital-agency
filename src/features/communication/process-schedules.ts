import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { AutoFillContext } from "./auto-fill";
import { sendTemplateEmail } from "./send-template";

/**
 * Schedule processor: finds `email_schedules` rows that are due (pending and
 * `send_at` in the past), sends them through the standard pipeline
 * (load → auto-fill → render → SMTP send → log → thread), and marks each row
 * `sent` or `failed`. Intended for a cron trigger (Vercel cron → the
 * `/api/email/schedules/process` route) but safe to call from anywhere —
 * sends are idempotent by `idempotencyKey`, so concurrent or repeated runs
 * never double-send.
 */

export interface ScheduleProcessResult {
  processed: number;
  sent: number;
  failed: number;
  errors: string[];
}

const BATCH_LIMIT = 50;

export async function processDueSchedules(): Promise<ScheduleProcessResult> {
  const supabase = createSupabaseServiceRoleClient();
  const now = new Date().toISOString();

  const { data: due, error } = await supabase
    .from("email_schedules")
    .select(
      "id, template_key, recipient_email, recipient_name, language, data"
    )
    .eq("status", "pending")
    .lte("send_at", now)
    .order("send_at", { ascending: true })
    .limit(BATCH_LIMIT);

  if (error) {
    console.error("Schedule processor: could not load due schedules:", error.message);
    return { processed: 0, sent: 0, failed: 0, errors: [error.message] };
  }

  if (!due || due.length === 0) {
    return { processed: 0, sent: 0, failed: 0, errors: [] };
  }

  const result: ScheduleProcessResult = {
    processed: due.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  for (const schedule of due) {
    // The schedule row stores the recipient name separately; merge it into the
    // auto-fill context so {{name}} always resolves for scheduled sends.
    const variables = (schedule.data ?? {}) as Record<string, string>;
    const context: AutoFillContext = {
      ...variables,
      name: schedule.recipient_name || variables.name || null,
      customer_email: variables.customer_email || schedule.recipient_email,
      date: variables.date || new Date().toISOString().slice(0, 10),
    };

    const outcome = await sendTemplateEmail({
      templateKey: schedule.template_key,
      language: schedule.language,
      toEmail: schedule.recipient_email,
      context,
      idempotencyKey: `schedule:${schedule.id}`,
      relatedType: "schedule",
      relatedId: schedule.id,
    });

    if (outcome.sent) {
      result.sent += 1;
      await supabase
        .from("email_schedules")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", schedule.id)
        .eq("status", "pending");
    } else {
      result.failed += 1;
      const message = outcome.error ?? "Scheduled email could not be sent.";
      result.errors.push(`${schedule.template_key} → ${schedule.recipient_email}: ${message}`);
      await supabase
        .from("email_schedules")
        .update({
          status: "failed",
          error_message: message,
        })
        .eq("id", schedule.id)
        .eq("status", "pending");
    }
  }

  return result;
}
