"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { aboutPageSchema, type AboutPageFormValues } from "./schemas";

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

export async function updateAboutPage(
  input: AboutPageFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = aboutPageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("about_page")
    .update({
      eyebrow_translations: parsed.data.eyebrow_translations,
      title_translations: parsed.data.title_translations,
      highlight_translations: parsed.data.highlight_translations,
      intro_translations: parsed.data.intro_translations,
      stats: parsed.data.stats,
      mission_translations: parsed.data.mission_translations,
      story_translations: parsed.data.story_translations,
      values: parsed.data.values,
      team_translations: parsed.data.team_translations,
      cta_title_translations: parsed.data.cta_title_translations,
      cta_highlight_translations: parsed.data.cta_highlight_translations,
      cta_description_translations: parsed.data.cta_description_translations,
      cta_label_translations: parsed.data.cta_label_translations,
      cta_url: parsed.data.cta_url || null,
      is_visible: parsed.data.is_visible,
    })
    .eq("singleton_key", true);

  if (error) {
    return { success: false, error: "Failed to save the About page." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "about_page",
    target_id: "singleton",
  });
  revalidatePath("/about");
  revalidatePath("/admin/content/about");
  return { success: true };
}
