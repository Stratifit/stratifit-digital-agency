import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicAcquisitionSection {
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  benefits: unknown[] | null;
  cta_label_translations: Record<string, string> | null;
  cta_url: string | null;
}

export async function getPublicAcquisitionSection(): Promise<PublicAcquisitionSection | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("acquisition_section")
    .select(
      "title_translations, description_translations, benefits, cta_label_translations, cta_url"
    )
    .eq("is_visible", true)
    .single();

  if (error) {
    return null;
  }

  return data as PublicAcquisitionSection;
}
