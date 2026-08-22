"use server";

import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import { servicePageSchema, type ServicePageFormValues } from "./schemas";

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

export async function saveServicePage(
  slug: string,
  input: ServicePageFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = servicePageSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("service_pages")
    .update({
      is_visible: parsed.data.is_visible,
      hero_eyebrow_translations: parsed.data.hero_eyebrow_translations,
      hero_title_translations: parsed.data.hero_title_translations,
      hero_highlight_translations: parsed.data.hero_highlight_translations,
      hero_description_translations: parsed.data.hero_description_translations,
      hero_stats: parsed.data.hero_stats,
      why_title_translations: parsed.data.why_title_translations,
      why_description_translations: parsed.data.why_description_translations,
      why_badges: parsed.data.why_badges,
      capabilities_title_translations: parsed.data.capabilities_title_translations,
      capabilities_description_translations: parsed.data.capabilities_description_translations,
      capabilities: parsed.data.capabilities,
      deliverables_title_translations: parsed.data.deliverables_title_translations,
      deliverables: parsed.data.deliverables,
      process_title_translations: parsed.data.process_title_translations,
      process: parsed.data.process,
      toolkit_title_translations: parsed.data.toolkit_title_translations,
      toolkit: parsed.data.toolkit,
      cta_title_translations: parsed.data.cta_title_translations,
      cta_subtitle_translations: parsed.data.cta_subtitle_translations,
      cta_button_label_translations: parsed.data.cta_button_label_translations,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    return { success: false, error: "Failed to save the service page." };
  }

  await recordAuditLog({
    action: "save",
    target_table: "service_pages",
    metadata: { slug },
  });

  revalidatePath(`/services/${slug}`);
  revalidatePath("/");
  revalidatePath("/admin/content/service-pages");
  return { success: true };
}
