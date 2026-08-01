import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicFinalCta {
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  primary_cta_label_translations: Record<string, string> | null;
  primary_cta_url: string | null;
  secondary_cta_label_translations: Record<string, string> | null;
  secondary_cta_url: string | null;
}

export async function getPublicFinalCta(): Promise<PublicFinalCta | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("final_cta")
    .select(
      "title_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url"
    )
    .eq("is_visible", true)
    .single();

  if (error) {
    return null;
  }

  return data as PublicFinalCta;
}
