import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJsonArray } from "@/lib/json";

export interface HeroMetric {
  value: string;
  label_translations: Record<string, string> | null;
}

export interface AdminHero {
  is_visible: boolean;
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  highlight_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  primary_cta_label_translations: Record<string, string> | null;
  primary_cta_url: string | null;
  secondary_cta_label_translations: Record<string, string> | null;
  secondary_cta_url: string | null;
  metrics: HeroMetric[] | null;
}

export async function getAdminHero(): Promise<AdminHero | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("hero")
    .select(
      "is_visible, eyebrow_translations, title_translations, highlight_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, metrics"
    )
    .eq("singleton_key", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...(data as Omit<AdminHero, "metrics">),
    metrics: parseJsonArray<HeroMetric>(data.metrics) ?? [],
  };
}
