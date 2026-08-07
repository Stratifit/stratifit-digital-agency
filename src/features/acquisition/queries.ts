import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJsonArray } from "@/lib/json";

export interface AcquisitionBusiness {
  slug: string;
  name: string;
  domain: string;
  emoji: string;
  category: string;
  tagline: string;
  tags: string[];
  accent: string;
  price: string;
  url: string;
  action_label: string;
  trust: string[];
  tiles: string[];
}

export interface PublicAcquisitionSection {
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  benefits: unknown[] | null;
  cta_label_translations: Record<string, string> | null;
  cta_url: string | null;
  businesses: AcquisitionBusiness[] | null;
}

export async function getPublicAcquisitionSection(): Promise<PublicAcquisitionSection | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("acquisition_section")
    .select(
      "title_translations, description_translations, benefits, cta_label_translations, cta_url, businesses"
    )
    .eq("is_visible", true)
    .single();

  if (error) {
    return null;
  }

  return {
    ...data,
    businesses: parseJsonArray<AcquisitionBusiness>(data.businesses) ?? null,
  } as PublicAcquisitionSection;
}
