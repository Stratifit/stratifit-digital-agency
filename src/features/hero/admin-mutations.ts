"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { heroSchema, type HeroFormValues } from "./admin-schemas";

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

export async function updateHero(input: HeroFormValues): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = heroSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("hero")
    .update({
      eyebrow_translations: parsed.data.eyebrow_translations,
      title_translations: parsed.data.title_translations,
      highlight_translations: parsed.data.highlight_translations,
      description_translations: parsed.data.description_translations,
      primary_cta_label_translations: parsed.data.primary_cta_label_translations,
      primary_cta_url: parsed.data.primary_cta_url || null,
      secondary_cta_label_translations: parsed.data.secondary_cta_label_translations,
      secondary_cta_url: parsed.data.secondary_cta_url || null,
      metrics: parsed.data.metrics,
      trusted_by: parsed.data.trusted_by,
      is_visible: parsed.data.is_visible,
    })
    .eq("singleton_key", true);

  if (error) {
    return { success: false, error: "Failed to save hero." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "hero",
    target_id: "singleton",
  });
  revalidatePath("/");
  revalidatePath("/admin/content/hero");
  return { success: true };
}
