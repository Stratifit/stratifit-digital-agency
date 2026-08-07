import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJsonArray } from "@/lib/json";

export interface AdminBusinessListing {
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

export interface AdminAcquisitionSection {
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  benefits: unknown[] | null;
  cta_label_translations: Record<string, string> | null;
  cta_url: string | null;
  is_visible: boolean;
  businesses: AdminBusinessListing[];
}

export async function getAdminAcquisitionSection(): Promise<AdminAcquisitionSection | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("acquisition_section")
    .select(
      "title_translations, description_translations, benefits, cta_label_translations, cta_url, is_visible, businesses"
    )
    .eq("singleton_key", true)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...(data as Omit<AdminAcquisitionSection, "businesses">),
    businesses: parseJsonArray<AdminBusinessListing>(data.businesses) ?? [],
  };
}
