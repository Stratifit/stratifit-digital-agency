"use server";
import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sectionSettingsSchema, type SectionSettingsFormValues } from "./schemas";


async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
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
      is_visible: parsed.data.is_visible,
    })
    .eq("section_key", sectionKey);

  if (error) {
    return { success: false, error: "Failed to save section settings." };
  }

  revalidatePath("/");
  revalidatePath("/admin/content/sections");
  return { success: true };
}
