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

const businessSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Lowercase letters, numbers, and dashes"),
  name: z.string().min(1, "Name is required"),
  domain: z.string().min(1, "Domain is required"),
  emoji: z.string(),
  category: z.string().min(1, "Category is required"),
  tagline: z.string(),
  tags: z.array(z.string()),
  accent: z.string(),
  price: z.string().min(1, "Price is required"),
  url: z.string().min(1, "URL is required"),
  action_label: z.string(),
  trust: z.array(z.string()),
  tiles: z.array(z.string()),
});

export const acquisitionSectionSchema = z.object({
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  description_translations: translations(),
  cta_label_translations: translations(),
  cta_url: z.string(),
  is_visible: z.boolean(),
  businesses: z.array(businessSchema),
});

export type AcquisitionSectionFormValues = z.infer<
  typeof acquisitionSectionSchema
>;

export async function updateAcquisitionSection(
  input: AcquisitionSectionFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = acquisitionSectionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("acquisition_section")
    .update({
      title_translations: parsed.data.title_translations,
      description_translations: parsed.data.description_translations,
      cta_label_translations: parsed.data.cta_label_translations,
      cta_url: parsed.data.cta_url || null,
      is_visible: parsed.data.is_visible,
      businesses: parsed.data.businesses,
    })
    .eq("singleton_key", true);

  if (error) {
    return { success: false, error: "Failed to save the acquisition section." };
  }

  await recordAuditLog({
    action: "update",
    target_table: "acquisition_section",
    target_id: "singleton",
  });
  revalidatePath("/");
  revalidatePath("/buy-business");
  revalidatePath("/admin/content/acquisition");
  return { success: true };
}
