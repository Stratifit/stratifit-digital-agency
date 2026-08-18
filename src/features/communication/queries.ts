import { createSupabaseServerClient } from "@/lib/supabase/server";
import { pickTranslation } from "./language";
import type {
  AutomationTriggerRecord,
  EmailLogRecord,
  EmailScheduleRecord,
  EmailTemplateRecord,
  TemplateCategory,
  TemplateType,
} from "./types";

const TEMPLATE_SELECT =
  "id, key, template_type, category, name_translations, subject_translations, body_translations, description, trigger_event, is_enabled, display_order";

function mapTemplate(row: Record<string, unknown>): EmailTemplateRecord {
  return {
    id: row.id as string,
    key: row.key as string,
    template_type: row.template_type as TemplateType,
    category: row.category as TemplateCategory,
    name_translations: row.name_translations as EmailTemplateRecord["name_translations"],
    subject_translations: row.subject_translations as EmailTemplateRecord["subject_translations"],
    body_translations: row.body_translations as EmailTemplateRecord["body_translations"],
    description: (row.description as string | null) ?? null,
    trigger_event: row.trigger_event as EmailTemplateRecord["trigger_event"],
    is_enabled: row.is_enabled as boolean,
    display_order: row.display_order as number,
  };
}

/** All templates, optionally filtered by type/category (admin; RLS-gated). */
export async function getEmailTemplatesForAdmin(input?: {
  templateType?: TemplateType;
  category?: TemplateCategory;
}): Promise<EmailTemplateRecord[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("email_templates")
    .select(TEMPLATE_SELECT)
    .order("display_order", { ascending: true });

  if (input?.templateType) {
    query = query.eq("template_type", input.templateType);
  }
  if (input?.category) {
    query = query.eq("category", input.category);
  }

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map((row) => mapTemplate(row as Record<string, unknown>));
}

/** Enabled templates only (composer pickers, previews). */
export async function getEnabledEmailTemplates(): Promise<
  EmailTemplateRecord[]
> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("email_templates")
    .select(TEMPLATE_SELECT)
    .eq("is_enabled", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => mapTemplate(row as Record<string, unknown>));
}

/** Template display name in the requested language (English fallback). */
export function templateLabel(
  template: Pick<EmailTemplateRecord, "name_translations" | "key">,
  language = "en"
): string {
  return pickTranslation(template.name_translations, language) || template.key;
}

/** Recent email_logs (admin; RLS-gated). */
export async function getEmailLogs(limit = 100): Promise<EmailLogRecord[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("email_logs")
    .select(
      "id, template_key, recipient_email, sender_email, subject, language, status, error_message, created_at, sent_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as unknown as EmailLogRecord[];
}

/** All schedules (admin; RLS-gated). */
export async function getEmailSchedules(): Promise<EmailScheduleRecord[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("email_schedules")
    .select(
      "id, template_key, recipient_email, recipient_name, language, send_at, status, data, error_message, created_at"
    )
    .order("send_at", { ascending: true });

  if (error || !data) return [];
  return data as unknown as EmailScheduleRecord[];
}

/** All automation triggers with their template name (admin; RLS-gated). */
export async function getAutomationTriggers(): Promise<
  (AutomationTriggerRecord & { template_name: string | null })[]
> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("automation_triggers")
    .select(
      "id, event_type, template_key, enabled, display_order, email_templates(name_translations)"
    )
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    const related = row.email_templates as unknown as
      | { name_translations: Record<string, string> | null }
      | null;
    return {
      id: row.id,
      event_type: row.event_type as AutomationTriggerRecord["event_type"],
      template_key: row.template_key,
      enabled: row.enabled,
      display_order: row.display_order,
      template_name: related
        ? pickTranslation(related.name_translations, "en") || row.template_key
        : row.template_key,
    };
  });
}
