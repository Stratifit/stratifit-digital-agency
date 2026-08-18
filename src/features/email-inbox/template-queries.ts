import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import type {
  TemplateCategory,
  TemplateTrigger,
} from "./template-schemas";

export interface EmailTemplateRecord {
  id: string;
  key: string;
  category: TemplateCategory;
  name_translations: Record<string, string> | null;
  subject_translations: Record<string, string> | null;
  body_translations: Record<string, string> | null;
  description: string | null;
  trigger_event: TemplateTrigger | null;
  is_enabled: boolean;
  display_order: number;
}

const SELECT_FIELDS =
  "id, key, category, name_translations, subject_translations, body_translations, description, trigger_event, is_enabled, display_order";

/** All templates ordered by display_order (admin; RLS-gated). */
export async function getEmailTemplatesForAdmin(
  category?: string
): Promise<EmailTemplateRecord[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("email_templates")
    .select(SELECT_FIELDS)
    .order("display_order", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    key: row.key,
    category: row.category as TemplateCategory,
    name_translations: row.name_translations as Record<string, string> | null,
    subject_translations:
      row.subject_translations as Record<string, string> | null,
    body_translations: row.body_translations as Record<string, string> | null,
    description: row.description,
    trigger_event: row.trigger_event as TemplateTrigger | null,
    is_enabled: row.is_enabled,
    display_order: row.display_order,
  }));
}

/** Template name in English (for dropdowns / lists). */
export function templateLabel(template: EmailTemplateRecord): string {
  return (
    resolveTranslation(template.name_translations, "en") || template.key
  );
}

/** Enabled templates only, for section editor dropdowns (admin; RLS-gated). */
export async function getEnabledEmailTemplates(): Promise<
  EmailTemplateRecord[]
> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("email_templates")
    .select(SELECT_FIELDS)
    .eq("is_enabled", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    key: row.key,
    category: row.category as TemplateCategory,
    name_translations: row.name_translations as Record<string, string> | null,
    subject_translations:
      row.subject_translations as Record<string, string> | null,
    body_translations: row.body_translations as Record<string, string> | null,
    description: row.description,
    trigger_event: row.trigger_event as TemplateTrigger | null,
    is_enabled: row.is_enabled,
    display_order: row.display_order,
  }));
}
