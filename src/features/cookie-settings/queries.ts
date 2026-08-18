import { createSupabaseServerClient } from "@/lib/supabase/server";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import type { Database } from "@/types/database.types";

type CookieSettingsRow = Database["public"]["Tables"]["cookie_settings"]["Row"];

export interface CookieCategoryView {
  key: string;
  essential: boolean;
  enabled: boolean;
  name: string;
  description: string;
}

export interface PublicCookieSettings {
  banner_enabled: boolean;
  policy_url: string;
  title: string;
  text: string;
  acceptAllLabel: string;
  essentialOnlyLabel: string;
  settingsLabel: string;
  savePreferencesLabel: string;
  /** Enabled categories only (essential always included). */
  categories: CookieCategoryView[];
}

export interface AdminCookieSettings {
  banner_enabled: boolean;
  policy_url: string;
  banner_title_translations: Record<string, string>;
  banner_text_translations: Record<string, string>;
  accept_all_label_translations: Record<string, string>;
  essential_only_label_translations: Record<string, string>;
  settings_label_translations: Record<string, string>;
  save_preferences_label_translations: Record<string, string>;
  categories: CookieSettingsRow["categories"];
}

interface RawCategory {
  key?: string;
  essential?: boolean;
  enabled?: boolean;
  name_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
}

function toAdminShape(row: CookieSettingsRow | null): AdminCookieSettings | null {
  if (!row) {
    return null;
  }
  return {
    banner_enabled: row.banner_enabled,
    policy_url: row.policy_url,
    banner_title_translations: (row.banner_title_translations as Record<string, string>) ?? {},
    banner_text_translations: (row.banner_text_translations as Record<string, string>) ?? {},
    accept_all_label_translations: (row.accept_all_label_translations as Record<string, string>) ?? {},
    essential_only_label_translations: (row.essential_only_label_translations as Record<string, string>) ?? {},
    settings_label_translations: (row.settings_label_translations as Record<string, string>) ?? {},
    save_preferences_label_translations: (row.save_preferences_label_translations as Record<string, string>) ?? {},
    categories: row.categories,
  };
}

export async function getAdminCookieSettings(): Promise<AdminCookieSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cookie_settings")
    .select("*")
    .eq("singleton_key", true)
    .single();
  if (error) {
    return null;
  }
  return toAdminShape(data);
}

export async function getPublicCookieSettings(
  locale: string
): Promise<PublicCookieSettings | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cookie_settings")
    .select("*")
    .eq("singleton_key", true)
    .single();
  if (error || !data) {
    return null;
  }

  const categories = (data.categories as RawCategory[] | null) ?? [];
  return {
    banner_enabled: data.banner_enabled,
    policy_url: data.policy_url,
    title: resolveTranslation(data.banner_title_translations as Record<string, string>, locale),
    text: resolveTranslation(data.banner_text_translations as Record<string, string>, locale),
    acceptAllLabel: resolveTranslation(data.accept_all_label_translations as Record<string, string>, locale),
    essentialOnlyLabel: resolveTranslation(data.essential_only_label_translations as Record<string, string>, locale),
    settingsLabel: resolveTranslation(data.settings_label_translations as Record<string, string>, locale),
    savePreferencesLabel: resolveTranslation(data.save_preferences_label_translations as Record<string, string>, locale),
    categories: categories
      .filter((c) => c.essential || c.enabled)
      .map((c) => ({
        key: c.key ?? "",
        essential: c.essential ?? false,
        enabled: c.enabled ?? true,
        name: resolveTranslation(c.name_translations ?? {}, locale),
        description: resolveTranslation(c.description_translations ?? {}, locale),
      })),
  };
}
