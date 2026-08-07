import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJsonArray } from "@/lib/json";

export interface AboutStat {
  icon: string;
  value: string;
  label_translations: Record<string, string> | null;
}

export interface AboutValue {
  icon: string;
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
}

export interface PublicAboutPage {
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  highlight_translations: Record<string, string> | null;
  intro_translations: Record<string, string> | null;
  stats: AboutStat[] | null;
  mission_translations: Record<string, string> | null;
  story_translations: Record<string, string> | null;
  values: AboutValue[] | null;
  team_translations: Record<string, string> | null;
  cta_title_translations: Record<string, string> | null;
  cta_highlight_translations: Record<string, string> | null;
  cta_description_translations: Record<string, string> | null;
  cta_label_translations: Record<string, string> | null;
  cta_url: string | null;
}

export async function getPublicAboutPage(): Promise<PublicAboutPage | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("about_page")
    .select(
      "eyebrow_translations, title_translations, highlight_translations, intro_translations, stats, mission_translations, story_translations, values, team_translations, cta_title_translations, cta_highlight_translations, cta_description_translations, cta_label_translations, cta_url"
    )
    .eq("is_visible", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...(data as Omit<PublicAboutPage, "stats" | "values">),
    stats: parseJsonArray<AboutStat>(data.stats) ?? [],
    values: parseJsonArray<AboutValue>(data.values) ?? [],
  };
}

export interface AdminAboutPage extends PublicAboutPage {
  is_visible: boolean;
}

export async function getAdminAboutPage(): Promise<AdminAboutPage | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("about_page")
    .select(
      "eyebrow_translations, title_translations, highlight_translations, intro_translations, stats, mission_translations, story_translations, values, team_translations, cta_title_translations, cta_highlight_translations, cta_description_translations, cta_label_translations, cta_url, is_visible"
    )
    .eq("singleton_key", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...(data as Omit<AdminAboutPage, "stats" | "values">),
    stats: parseJsonArray<AboutStat>(data.stats) ?? [],
    values: parseJsonArray<AboutValue>(data.values) ?? [],
  };
}
