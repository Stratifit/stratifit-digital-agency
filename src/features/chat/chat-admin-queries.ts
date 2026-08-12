import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminKnowledgeEntry {
  id: string;
  slug: string;
  title_translations: Record<string, string> | null;
  content_translations: Record<string, string> | null;
  category: string;
  source_type: string;
  priority: number;
  is_enabled: boolean;
  is_ai_eligible: boolean;
  last_reviewed_at: string | null;
  updated_at: string;
}

const KNOWLEDGE_FIELDS =
  "id, slug, title_translations, content_translations, category, source_type, priority, is_enabled, is_ai_eligible, last_reviewed_at, updated_at";

export async function getAdminKnowledgeEntries(): Promise<
  AdminKnowledgeEntry[]
> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("chatbot_knowledge")
    .select(KNOWLEDGE_FIELDS)
    .order("priority", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as AdminKnowledgeEntry[];
}

export async function getAdminKnowledgeEntry(
  id: string
): Promise<AdminKnowledgeEntry | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("chatbot_knowledge")
    .select(KNOWLEDGE_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as AdminKnowledgeEntry;
}

export interface AdminChatbotSettings {
  is_enabled: boolean;
  response_style: string;
  lead_capture_mode: string;
  human_support_enabled: boolean;
  allowed_categories: string[];
  welcome_message_translations: Record<string, string> | null;
  offline_message_translations: Record<string, string> | null;
  escalation_message_translations: Record<string, string> | null;
  fallback_message_translations: Record<string, string> | null;
}

export async function getAdminChatbotSettings(): Promise<AdminChatbotSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("chatbot_settings")
    .select(
      "is_enabled, response_style, lead_capture_mode, human_support_enabled, allowed_categories, welcome_message_translations, offline_message_translations, escalation_message_translations, fallback_message_translations"
    )
    .eq("singleton_key", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as AdminChatbotSettings;
}

export interface AdminAiFaqSettings {
  is_enabled: boolean;
  intro_translations: Record<string, string> | null;
  fallback_translations: Record<string, string> | null;
  cta_label_translations: Record<string, string> | null;
  cta_url: string | null;
  suggested_questions: string[];
  allowed_categories: string[];
}

export async function getAdminAiFaqSettings(): Promise<AdminAiFaqSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_faq_settings")
    .select(
      "is_enabled, intro_translations, fallback_translations, cta_label_translations, cta_url, suggested_questions, allowed_categories"
    )
    .eq("singleton_key", true)
    .maybeSingle();

  if (error || !data) return null;
  return {
    ...data,
    suggested_questions: (data.suggested_questions ?? []) as string[],
  } as AdminAiFaqSettings;
}

export interface AdminFaqBotSettings {
  faq_bot_enabled: boolean;
  welcome_message_translations: Record<string, string> | null;
  suggested_question_translations: Record<string, string>[] | null;
  faq_bot_fallback_translations: Record<string, string> | null;
  faq_bot_allowed_categories: string[];
}

export async function getAdminFaqBotSettings(): Promise<AdminFaqBotSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_faq_settings")
    .select(
      "faq_bot_enabled, welcome_message_translations, suggested_question_translations, faq_bot_fallback_translations, faq_bot_allowed_categories"
    )
    .eq("singleton_key", true)
    .maybeSingle();

  if (error || !data) return null;
  return {
    ...data,
    suggested_question_translations: (data.suggested_question_translations ??
      []) as Record<string, string>[],
  } as AdminFaqBotSettings;
}
