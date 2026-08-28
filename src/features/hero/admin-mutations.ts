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

export async function updateHeroMainImage(mediaId: string | null): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const normalizedMediaId = mediaId?.trim() || null;
  const { data: heroRow, error: lookupError } = await supabase
    .from("hero")
    .select("singleton_key")
    .eq("singleton_key", true)
    .maybeSingle();

  if (lookupError) {
    console.error("Failed to find hero for image save", {
      code: lookupError.code,
      message: lookupError.message,
    });
    return { success: false, error: "Could not save the Hero image." };
  }

  const result = heroRow
    ? await supabase
        .from("hero")
        .update({ media_id: normalizedMediaId })
        .eq("singleton_key", true)
    : await supabase
        .from("hero")
        .insert({ singleton_key: true, media_id: normalizedMediaId });
  const { error } = result;

  if (error) {
    console.error("Failed to save hero image", {
      code: error.code,
      message: error.message,
    });
    return { success: false, error: "Could not save the Hero image." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "hero",
    target_id: "singleton",
    metadata: { media_id: normalizedMediaId },
  });
  revalidatePath("/");
  revalidatePath("/admin/content/hero");
  return { success: true };
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

  // Upsert so saving also creates the singleton row when it is missing
  // (e.g. a database that hasn't been seeded). A plain update on a missing
  // row would silently update nothing and still report success.
  //
  // `image_url` is a display-only convenience resolved at read time; the
  // database stores the `media_id` reference and never a raw URL.
  const trustedBy = parsed.data.trusted_by.map((item) => ({
    name: item.name,
    icon: item.icon,
    media_id: item.media_id || null,
  }));
  const heroPayload = {
    singleton_key: true,
    media_id: parsed.data.media_id || null,
    eyebrow_translations: parsed.data.eyebrow_translations,
    title_translations: parsed.data.title_translations,
    highlight_translations: parsed.data.highlight_translations,
    description_translations: parsed.data.description_translations,
    primary_cta_label_translations: parsed.data.primary_cta_label_translations,
    primary_cta_url: parsed.data.primary_cta_url || null,
    secondary_cta_label_translations: parsed.data.secondary_cta_label_translations,
    secondary_cta_url: parsed.data.secondary_cta_url || null,
    metrics: parsed.data.metrics,
    trusted_by: trustedBy,
    trusted_by_label_translations: parsed.data.trusted_by_label_translations,
    is_visible: parsed.data.is_visible,
  };

  const { error } = await supabase
    .from("hero")
    .upsert(
      {
        ...heroPayload,
      },
      { onConflict: "singleton_key" }
    );

  if (error) {
    console.error("Failed to save hero", { code: error.code, message: error.message });
    return { success: false, error: "Failed to save hero. Please check the Hero fields and try again." };
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
