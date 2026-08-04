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

export const navItemSchema = z.object({
  location: z.enum(["header", "footer"]),
  label_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English label is required"
  ),
  href: z.string().min(1, "Link is required"),
  is_external: z.boolean(),
  open_in_new_tab: z.boolean(),
  display_order: z.number().int().min(0).max(1000),
  is_visible: z.boolean(),
});

export type NavItemFormValues = z.infer<typeof navItemSchema>;

export async function createNavItem(input: NavItemFormValues): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = navItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase
    .from("navigation_items")
    .insert({
      location: parsed.data.location,
      label_translations: parsed.data.label_translations,
      href: parsed.data.href,
      is_external: parsed.data.is_external,
      open_in_new_tab: parsed.data.open_in_new_tab,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: "Failed to create navigation item." };
  }

  await recordAuditLog({
    action: "create",
    target_table: "navigation_items",
    target_id: data.id,
  });
  revalidatePath("/admin/content/navigation");
  revalidatePath("/");
  return { success: true };
}

export async function updateNavItem(
  id: string,
  input: NavItemFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = navItemSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("navigation_items")
    .update({
      location: parsed.data.location,
      label_translations: parsed.data.label_translations,
      href: parsed.data.href,
      is_external: parsed.data.is_external,
      open_in_new_tab: parsed.data.open_in_new_tab,
      display_order: parsed.data.display_order,
      is_visible: parsed.data.is_visible,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: "Failed to update navigation item." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "navigation_items",
    target_id: id,
  });
  revalidatePath("/admin/content/navigation");
  revalidatePath("/");
  return { success: true };
}

export async function deleteNavItem(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("navigation_items").delete().eq("id", id);
  await recordAuditLog({
    action: "delete",
    target_table: "navigation_items",
    target_id: id,
  });
  revalidatePath("/admin/content/navigation");
  revalidatePath("/");
}
