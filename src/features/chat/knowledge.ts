import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface KnowledgeEntry {
  question?: string;
  answer?: string;
  title?: string;
  content?: string;
  category: string;
}

export interface ChatbotSettings {
  is_enabled: boolean;
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
      "is_enabled, welcome_message_translations, offline_message_translations, escalation_message_translations, fallback_message_translations, lead_capture_mode, human_support_enabled"
    )
    .single();
  if (error) return null;
  return data as ChatbotSettings;
}

export async function getApprovedKnowledge(): Promise<KnowledgeEntry[]> {
  const supabase = await createSupabaseServerClient();
  const entries: KnowledgeEntry[] = [];

  const [{ data: faqs }, { data: services }] = await Promise.all([
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
  ]);

  for (const faq of faqs ?? []) {
    entries.push({
      question: (faq.question_translations as Record<string, string> | null)?.en,
      answer: (faq.answer_translations as Record<string, string> | null)?.en,
      category: faq.category,
    });
  }

  for (const service of services ?? []) {
    entries.push({
      title: (service.title_translations as Record<string, string> | null)?.en,
      content: (service.short_description_translations as Record<string, string> | null)?.en,
      category: "services",
    });
  }

  return entries.filter((e) => e.question || e.title);
}
