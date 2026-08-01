import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicSiteSettings {
  site_name: string;
  site_description_translations: Record<string, string> | null;
  contact_email: string | null;
  contact_phone: string | null;
  address_translations: Record<string, string> | null;
  default_locale: string;
  social_links: Record<string, string> | null;
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "site_name, site_description_translations, contact_email, contact_phone, address_translations, default_locale, social_links"
    )
    .single();

  if (error) {
    return null;
  }

  return {
    ...(data as Omit<PublicSiteSettings, "social_links">),
    social_links: (data.social_links as Record<string, string> | null) ?? null,
  };
}
