import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import { getDefaultFrom } from "@/features/communication/sender";
import { pickTranslation } from "@/features/communication/language";
import { pickSectionByLanguage } from "./routing";

// The send orchestration (load → render → SMTP send → log → thread message)
// lives in the Communication Engine. Re-export for the inbox.
export {
  recordOutboundMessage,
  recordEmailLog,
  sendTemplateEmail,
} from "@/features/communication/send-template";
export type {
  SendTemplateInput,
  SendTemplateResult,
} from "@/features/communication/send-template";

export interface SectionTemplateInfo {
  sectionId: string;
  sectionName: string;
  fromAddress: string | null;
  autoReplyTemplate: {
    subject_translations: Record<string, string> | null;
    body_translations: Record<string, string> | null;
  } | null;
}

/**
 * Resolve the inbox section mapped to a form source key plus its auto-reply
 * template (service-role: the lead flow runs with the anon session client).
 */
export async function getSectionTemplateForSource(
  source: string,
  language?: string | null
): Promise<SectionTemplateInfo | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data: sections } = await supabase
    .from("email_inbox_sections")
    .select(
      "id, name_translations, from_address, auto_reply_template_id, language, email_templates(subject_translations, body_translations)"
    )
    .eq("form_source_key", source);

  if (!sections || sections.length === 0) return null;

  // Prefer the language-specific section, then the language-agnostic default.
  const section = pickSectionByLanguage(sections, language);
  if (!section) return null;

  const related = section.email_templates as unknown as
    | {
        subject_translations: Record<string, string> | null;
        body_translations: Record<string, string> | null;
      }
    | null;

  return {
    sectionId: section.id,
    sectionName: pickTranslation(
      section.name_translations as Record<string, string> | null,
      "en"
    ),
    fromAddress: section.from_address ?? getDefaultFrom(),
    autoReplyTemplate: related
      ? {
          subject_translations: related.subject_translations,
          body_translations: related.body_translations,
        }
      : null,
  };
}
