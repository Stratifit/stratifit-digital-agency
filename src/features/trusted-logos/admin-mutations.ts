"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import type { ActionResult } from "@/types/action-result";

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

const logoSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  media_id: z.string().uuid("Select an image").optional().or(z.literal("")),
  image_url: z.string(),
  href: z.string(),
  display_order: z.number().int().min(0).max(1000),
  is_visible: z.boolean(),
  is_verified: z.boolean(),
});

export type TrustedLogoInput = z.infer<typeof logoSchema>;

export async function createTrustedLogo(
  input: TrustedLogoInput
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = logoSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from("trusted_logos")
    .insert({
      name: parsed.data.name,
      media_id: parsed.data.media_id || null,
      image_url: parsed.data.image_url.trim() || null,
      href: parsed.data.href || null,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
      is_verified: parsed.data.is_verified,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: "Failed to create logo." };
  }

  await recordAuditLog({
    action: "create",
    target_table: "trusted_logos",
    target_id: data.id,
  });
  revalidatePath("/admin/content/trusted-logos");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTrustedLogo(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("trusted_logos").delete().eq("id", id);
  await recordAuditLog({
    action: "delete",
    target_table: "trusted_logos",
    target_id: id,
  });
  revalidatePath("/admin/content/trusted-logos");
  revalidatePath("/");
}

export async function toggleTrustedLogo(
  id: string,
  visible: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("trusted_logos")
    .update({ is_visible: visible })
    .eq("id", id);
  if (error) return { success: false, error: "Failed to update logo." };
  revalidatePath("/admin/content/trusted-logos");
  revalidatePath("/");
  return { success: true };
}
