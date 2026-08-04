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

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

export const footerGroupSchema = z.object({
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  display_order: z.number().int().min(0).max(1000),
  is_visible: z.boolean(),
});

export type FooterGroupFormValues = z.infer<typeof footerGroupSchema>;

export const footerLinkSchema = z.object({
  group_id: z.string().uuid(),
  label_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English label is required"
  ),
  href: z.string().min(1, "Link is required"),
  is_external: z.boolean(),
  display_order: z.number().int().min(0).max(1000),
  is_visible: z.boolean(),
});

export type FooterLinkFormValues = z.infer<typeof footerLinkSchema>;

export async function createFooterGroup(input: FooterGroupFormValues): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = footerGroupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from("footer_groups")
    .insert({
      title_translations: parsed.data.title_translations,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: "Failed to create group." };
  }

  await recordAuditLog({
    action: "create",
    target_table: "footer_groups",
    target_id: data.id,
  });
  revalidatePath("/admin/content/footer");
  revalidatePath("/");
  return { success: true };
}

export async function deleteFooterGroup(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("footer_groups").delete().eq("id", id);
  await recordAuditLog({
    action: "delete",
    target_table: "footer_groups",
    target_id: id,
  });
  revalidatePath("/admin/content/footer");
  revalidatePath("/");
}

export async function createFooterLink(input: FooterLinkFormValues): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = footerLinkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from("footer_links")
    .insert({
      group_id: parsed.data.group_id,
      label_translations: parsed.data.label_translations,
      href: parsed.data.href,
      is_external: parsed.data.is_external,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: "Failed to create link." };
  }

  await recordAuditLog({
    action: "create",
    target_table: "footer_links",
    target_id: data.id,
  });
  revalidatePath("/admin/content/footer");
  revalidatePath("/");
  return { success: true };
}

export async function deleteFooterLink(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("footer_links").delete().eq("id", id);
  await recordAuditLog({
    action: "delete",
    target_table: "footer_links",
    target_id: id,
  });
  revalidatePath("/admin/content/footer");
  revalidatePath("/");
}
