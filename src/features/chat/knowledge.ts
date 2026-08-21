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

const STOP_WORDS = new Set([
  "what", "is", "your", "how", "do", "does", "can", "are", "the", "a", "an",
  "to", "for", "of", "from", "with", "my", "i", "we", "you", "on", "in",
  "at", "about", "and", "or", "it", "this", "that", "me", "us", "not",
  "have", "has", "would", "will", "should", "please", "tell", "need",
  "want", "much", "many", "was", "were", "be", "being", "been", "by",
]);

function tokenize(text: string): Set<string> {
  const tokens = new Set<string>();
  for (const word of text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)) {
    if (word.length <= 2 || STOP_WORDS.has(word)) continue;
    // Light stemming for common noun plural/singular pairs.
    tokens.add(word.endsWith("ies") ? `${word.slice(0, -3)}y` : word);
  }
  return tokens;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let overlap = 0;
  for (const token of a) {
    if (b.has(token)) overlap += 1;
  }
  return overlap / (a.size + b.size - overlap);
}

/**
 * FAQ entries are historically the main knowledge source, but the manual
 * chatbot_knowledge rows are richer. When a manual entry covers the same
 * topic (same or near-identical question, or heavy answer overlap), skip
 * the FAQ so the prompt stays small and the AI answers from the more
 * complete manual entry.
 */
function isCoveredByManualEntry(
  faq: { question: string; answer: string; category: string },
  manual: KnowledgeEntry[]
): boolean {
  const questionTokens = tokenize(faq.question);
  const answerTokens = tokenize(faq.answer);
  if (questionTokens.size === 0 && answerTokens.size === 0) return false;
  for (const entry of manual) {
    const manualTitleTokens = tokenize(entry.title ?? "");
    if (
      questionTokens.size > 0 &&
      manualTitleTokens.size > 0 &&
      jaccard(questionTokens, manualTitleTokens) >= 0.35
    ) {
      return true;
    }
    if (entry.category !== faq.category) continue;
    const manualContentTokens = tokenize(entry.content ?? "");
    if (
      answerTokens.size > 0 &&
      manualContentTokens.size > 0 &&
      jaccard(answerTokens, manualContentTokens) >= 0.5
    ) {
      return true;
    }
  }
  return false;
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

  const manualEntries: KnowledgeEntry[] = (manualResult.data ?? []).map(
    (item) => ({
      title: resolveTranslation(
        translations(item.title_translations),
        locale
      ),
      content: resolveTranslation(
        translations(item.content_translations),
        locale
      ),
      category: item.category,
    })
  );

  for (const faq of faqsResult.data ?? []) {
    const entry = {
      question: resolveTranslation(
        translations(faq.question_translations),
        locale
      ),
      answer: resolveTranslation(
        translations(faq.answer_translations),
        locale
      ),
      category: faq.category,
    };
    if (isCoveredByManualEntry(entry, manualEntries)) continue;
    entries.push(entry);
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

  entries.push(...manualEntries);

  return entries.filter((e) => e.question || e.title);
}
