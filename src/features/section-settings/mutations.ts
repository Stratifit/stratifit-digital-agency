"use server";
import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import { sectionSettingsSchema, type SectionSettingsFormValues } from "./schemas";

const SECTION_SETTINGS_KEYS = [
  "services",
  "process",
  "why-choose-us",
  "insights",
  "portfolio",
  "testimonials",
  "pricing",
  "faq",
  "contact",
  "acquisition-niches",
  "acquisition-cta",
] as const;

/** Normalizes an optional CTA label back to null when every locale is empty. */
function ctaLabelToJson(
  translations?: { en: string; de: string; fr: string; es: string }
) {
  if (!translations) return null;
  return Object.values(translations).some((v) => v.trim().length > 0)
    ? translations
    : null;
}


async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role, status")
    .eq("user_id", user.id)
    .single();
  if (!admin || admin.status !== "active") {
    redirect("/admin/login");
  }
  return supabase;
}

export async function updateSectionSettings(
  sectionKey: string,
  input: SectionSettingsFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = sectionSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("section_settings")
    .update({
      eyebrow_translations: parsed.data.eyebrow_translations,
      title_translations: parsed.data.title_translations,
      highlight_translations: parsed.data.highlight_translations,
      description_translations: parsed.data.description_translations,
      cta_label_translations: ctaLabelToJson(
        parsed.data.cta_label_translations
      ),
      cta_url: parsed.data.cta_url?.trim() || null,
      is_visible: parsed.data.is_visible,
    })
    .eq("section_key", sectionKey);

  if (error) {
    return { success: false, error: "Failed to save section settings." };
  }

  revalidatePath("/");
  revalidatePath("/buy-business");
  revalidatePath("/admin/content/sections");
  return { success: true };
}

/**
 * Pause or resume a frontend section from the admin manager.
 * Routes to the right table: section_settings, hero, or final_cta.
 */
export async function toggleSectionVisibility(
  sectionKey: string,
  visible: boolean
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  if (sectionKey === "hero") {
    const { error } = await supabase
      .from("hero")
      .update({ is_visible: visible })
      .eq("singleton_key", true);
    if (error) return { success: false, error: "Failed to update hero." };
    await recordAuditLog({
      action: visible ? "section.resume" : "section.pause",
      target_table: "hero",
      metadata: { sectionKey },
    });
  } else if (sectionKey === "finalCta") {
    const { error } = await supabase
      .from("final_cta")
      .update({ is_visible: visible })
      .eq("singleton_key", true);
    if (error) return { success: false, error: "Failed to update final CTA." };
    await recordAuditLog({
      action: visible ? "section.resume" : "section.pause",
      target_table: "final_cta",
      metadata: { sectionKey },
    });
  } else if (
    SECTION_SETTINGS_KEYS.includes(sectionKey as (typeof SECTION_SETTINGS_KEYS)[number])
  ) {
    const { error } = await supabase
      .from("section_settings")
      .update({ is_visible: visible })
      .eq("section_key", sectionKey);
    if (error) return { success: false, error: "Failed to update section." };
    await recordAuditLog({
      action: visible ? "section.resume" : "section.pause",
      target_table: "section_settings",
      target_id: sectionKey,
      metadata: { sectionKey },
    });
  } else {
    return { success: false, error: "Unknown section." };
  }

  revalidatePath("/");
  revalidatePath("/buy-business");
  revalidatePath("/admin/content/sections");
  return { success: true };
}
