"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import { cookieSettingsSchema, type CookieSettingsFormValues } from "./schemas";

export type CookieSettingsActionResult =
  | { success: true }
  | { success: false; error: string };

export async function updateCookieSettings(
  values: CookieSettingsFormValues
): Promise<CookieSettingsActionResult> {
  const parsed = cookieSettingsSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Please check the form for errors." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("cookie_settings")
    .upsert(
      {
        singleton_key: true,
        banner_enabled: parsed.data.banner_enabled,
        policy_url: parsed.data.policy_url,
        banner_title_translations: parsed.data.banner_title_translations,
        banner_text_translations: parsed.data.banner_text_translations,
        accept_all_label_translations: parsed.data.accept_all_label_translations,
        essential_only_label_translations: parsed.data.essential_only_label_translations,
        settings_label_translations: parsed.data.settings_label_translations,
        save_preferences_label_translations:
          parsed.data.save_preferences_label_translations,
        categories: parsed.data.categories,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "singleton_key" }
    );

  if (error) {
    console.error("Cookie settings upsert error:", error.message);
    return { success: false, error: "Failed to save cookie settings." };
  }

  await recordAuditLog({
    action: "settings.update",
    target_table: "cookie_settings",
    metadata: { banner_enabled: parsed.data.banner_enabled },
  });

  revalidatePath("/admin/cookie-settings");
  revalidatePath("/", "layout");
  return { success: true };
}
