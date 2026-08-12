import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicFaqBotSettings {
  faq_bot_enabled: boolean;
  welcome_message_translations: Record<string, string> | null;
  suggested_question_translations: Record<string, string>[] | null;
  faq_bot_fallback_translations: Record<string, string> | null;
  faq_bot_allowed_categories: string[];
}

/**
 * Public FAQ-bot settings for the FAQ section bot. Reads via the server
 * client; the public SELECT policy on ai_faq_settings (migration 00052)
 * exposes only non-secret operational configuration.
 */
export async function getPublicFaqBotSettings(): Promise<PublicFaqBotSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ai_faq_settings")
    .select(
      "faq_bot_enabled, welcome_message_translations, suggested_question_translations, faq_bot_fallback_translations, faq_bot_allowed_categories"
    )
    .eq("singleton_key", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as PublicFaqBotSettings;
}
