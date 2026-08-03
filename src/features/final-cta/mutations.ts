"use server";
import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import { finalCtaSchema, type FinalCtaFormValues } from "./schemas";

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

export async function updateFinalCta(
  input: FinalCtaFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = finalCtaSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("final_cta")
    .update({
      title_translations: parsed.data.title_translations,
      description_translations: parsed.data.description_translations,
      primary_cta_label_translations: parsed.data.primary_cta_label_translations,
      primary_cta_url: parsed.data.primary_cta_url,
      secondary_cta_label_translations: parsed.data.secondary_cta_label_translations,
      secondary_cta_url: parsed.data.secondary_cta_url,
      is_visible: parsed.data.is_visible,
    })
    .eq("singleton_key", true);

  if (error) {
    return { success: false, error: "Failed to save the final CTA." };
  }

  await recordAuditLog({
    action: "save",
    target_table: "final_cta",
    metadata: { is_visible: parsed.data.is_visible },
  });

  revalidatePath("/");
  revalidatePath("/admin/content/final-cta");
  return { success: true };
}
