import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicSectionSettings {
  section_key: string;
  label: string;
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  highlight_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  is_visible: boolean;
}

const SELECT_FIELDS =
  "section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, is_visible";

export async function getPublicSectionSetting(
  sectionKey: string
): Promise<PublicSectionSettings | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("section_settings")
    .select(SELECT_FIELDS)
    .eq("section_key", sectionKey)
    .eq("is_visible", true)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as PublicSectionSettings;
}

export interface AdminSectionSettings extends PublicSectionSettings {
  display_order: number;
  updated_at: string;
}

export async function getAdminSectionSettings(): Promise<AdminSectionSettings[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("section_settings")
    .select(`${SELECT_FIELDS}, display_order, updated_at`)
    .order("display_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as AdminSectionSettings[];
}

export async function getAdminSectionSetting(
  sectionKey: string
): Promise<AdminSectionSettings | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("section_settings")
    .select(`${SELECT_FIELDS}, display_order, updated_at`)
    .eq("section_key", sectionKey)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as AdminSectionSettings;
}
