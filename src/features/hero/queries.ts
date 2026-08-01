import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicHero {
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  highlight_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  primary_cta_label_translations: Record<string, string> | null;
  primary_cta_url: string | null;
  secondary_cta_label_translations: Record<string, string> | null;
  secondary_cta_url: string | null;
  metrics: unknown[] | null;
}

export async function getPublicHero(): Promise<PublicHero | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("hero")
    .select(
      "eyebrow_translations, title_translations, highlight_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, metrics"
    )
    .eq("is_visible", true)
    .single();

  if (error) {
    return null;
  }

  return data as PublicHero;
}
