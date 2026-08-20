import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";

export interface KnowledgeEntry {
  question?: string;
  answer?: string;
  title?: string;
  content?: string;
  category: string;
}

export interface ChatbotSettings {
  is_enabled: boolean;
  response_style: string;
  welcome_message_translations: Record<string, string> | null;
  offline_message_translations: Record<string, string> | null;
  escalation_message_translations: Record<string, string> | null;
  fallback_message_translations: Record<string, string> | null;
  lead_capture_mode: string;
  human_support_enabled: boolean;
}

export async function getChatbotSettings(): Promise<ChatbotSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("chatbot_settings")
    .select(
      "is_enabled, response_style, welcome_message_translations, offline_message_translations, escalation_message_translations, fallback_message_translations, lead_capture_mode, human_support_enabled"
    )
    .single();
  if (error) return null;
  return data as ChatbotSettings;
}

function translations(
  value: unknown
): Record<string, string> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, string>;
}

export async function getApprovedKnowledge(
  locale = "en"
): Promise<KnowledgeEntry[]> {
  const supabase = await createSupabaseServerClient();
  const entries: KnowledgeEntry[] = [];

  const [faqsResult, servicesResult, manualResult] = await Promise.all([
    supabase
      .from("faqs")
      .select("question_translations, answer_translations, category")
      .eq("status", "published")
      .eq("is_visible", true)
      .eq("is_ai_eligible", true),
    supabase
      .from("services")
      .select("title_translations, short_description_translations, slug")
      .eq("status", "published")
      .eq("is_visible", true),
    supabase
      .from("chatbot_knowledge")
      .select("title_translations, content_translations, category, priority")
      .eq("is_enabled", true)
      .eq("is_ai_eligible", true)
      .order("priority", { ascending: false }),
  ]);

  for (const faq of faqsResult.data ?? []) {
    entries.push({
      question: resolveTranslation(
        translations(faq.question_translations),
        locale
      ),
      answer: resolveTranslation(
        translations(faq.answer_translations),
        locale
      ),
      category: faq.category,
    });
  }

  for (const service of servicesResult.data ?? []) {
    entries.push({
      title: resolveTranslation(
        translations(service.title_translations),
        locale
      ),
      content: resolveTranslation(
        translations(service.short_description_translations),
        locale
      ),
      category: "services",
    });
  }

  for (const item of manualResult.data ?? []) {
    entries.push({
      title: resolveTranslation(
        translations(item.title_translations),
        locale
      ),
      content: resolveTranslation(
        translations(item.content_translations),
        locale
      ),
      category: item.category,
    });
  }

  return entries.filter((e) => e.question || e.title);
}
