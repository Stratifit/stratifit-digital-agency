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
  social_twitter: string;
  social_linkedin: string;
  social_github: string;
  social_instagram: string;
}

export async function updateSiteSettings(
  values: SiteSettingsFormValues
): Promise<SettingsActionResult> {
  const supabase = await createSupabaseServerClient();

  const social_links: Record<string, string> = {};
  if (values.social_twitter) social_links.twitter = values.social_twitter;
  if (values.social_linkedin) social_links.linkedin = values.social_linkedin;
  if (values.social_github) social_links.github = values.social_github;
  if (values.social_instagram) social_links.instagram = values.social_instagram;

  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: values.site_name,
      site_description_translations: {
        en: values.site_description_en,
      },
      contact_email: values.contact_email || null,
      contact_phone: values.contact_phone || null,
      address_translations: {
        en: values.address_en,
      },
      default_locale: values.default_locale,
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