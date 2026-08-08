"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";
import { detailPageSchema, type DetailPageFormValues } from "./schemas";

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

export async function updateDetailPage(
  slug: string,
  input: DetailPageFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = detailPageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("detail_pages")
    .update({
      eyebrow_translations: parsed.data.eyebrow_translations,
      title_translations: parsed.data.title_translations,
      description_translations: parsed.data.description_translations,
      subtitle_translations: parsed.data.subtitle_translations,
      content_translations: parsed.data.content,
      seo_title_translations: parsed.data.seo_title_translations ?? {},
      seo_description_translations: parsed.data.seo_description_translations ?? {},
      is_visible: parsed.data.is_visible,
    })
    .eq("slug", slug);

  if (error) {
    return { success: false, error: "Failed to save the page." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "detail_pages",
    target_id: slug,
    metadata: { slug },
  });
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/content/pages");
  revalidatePath(`/admin/content/pages/${slug}/edit`);
  return { success: true };
}
