"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";

export type SettingsActionResult =
  | { success: true }
  | { success: false; error: string };

export interface SiteSettingsFormValues {
  site_name: string;
  site_description_en: string;
  contact_email: string;
  contact_phone: string;
  address_en: string;
  default_locale: string;
  seo_title_en: string;
  seo_description_en: string;
  social_linkedin: string;
  social_instagram: string;
  social_facebook: string;
  social_tiktok: string;
}

export async function updateSiteSettings(
  values: SiteSettingsFormValues
): Promise<SettingsActionResult> {
  const supabase = await createSupabaseServerClient();

  const social_links: Record<string, string> = {};
  if (values.social_linkedin) social_links.linkedin = values.social_linkedin;
  if (values.social_instagram) social_links.instagram = values.social_instagram;
  if (values.social_facebook) social_links.facebook = values.social_facebook;
  if (values.social_tiktok) social_links.tiktok = values.social_tiktok;

  // Merge English into existing translations so de/fr/es are preserved on edit.
  const { data: existing } = await supabase
    .from("site_settings")
    .select("site_description_translations, address_translations, default_seo")
    .eq("singleton_key", true)
    .single();
  const existingDescription =
    (existing?.site_description_translations as Record<string, string> | null) ?? {};
  const existingAddress =
    (existing?.address_translations as Record<string, string> | null) ?? {};
  const existingSeo = (existing?.default_seo as
    | Record<string, { title?: string; description?: string }>
    | null) ?? {};
  const existingEnSeo = existingSeo.en ?? {};
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: values.site_name,
      site_description_translations: {
        ...existingDescription,
        en: values.site_description_en,
      },
      contact_email: values.contact_email || null,
      contact_phone: values.contact_phone || null,
      address_translations: {
        ...existingAddress,
        en: values.address_en,
      },
      default_locale: values.default_locale,
      default_seo: {
        ...existingSeo,
        en: {
          ...existingEnSeo,
          title: values.seo_title_en,
          description: values.seo_description_en,
        },
      },
      social_links,
      updated_at: new Date().toISOString(),
    })
    .eq("singleton_key", true);

  if (error) {
    return { success: false, error: "Failed to update site settings." };
  }

  await recordAuditLog({
    action: "settings.update",
    target_table: "site_settings",
    metadata: { site_name: values.site_name },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}