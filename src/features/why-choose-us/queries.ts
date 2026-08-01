import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicWhyChooseUs {
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  items: unknown[] | null;
}

export async function getPublicWhyChooseUs(): Promise<PublicWhyChooseUs | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("why_choose_us")
    .select("eyebrow_translations, title_translations, description_translations, items")
    .eq("is_visible", true)
    .single();

  if (error) {
    return null;
  }

  return data as PublicWhyChooseUs;
}
