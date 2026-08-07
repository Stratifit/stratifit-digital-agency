"use server";

import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import {
  acquisitionNicheSchema,
  type AcquisitionNicheFormValues,
} from "./niche-schemas";

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

export async function createAcquisitionNiche(
  input: AcquisitionNicheFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = acquisitionNicheSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from("acquisition_niches").insert(parsed.data);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A niche with this slug already exists." };
    }
    return { success: false, error: "Failed to create the niche." };
  }

  revalidatePath("/buy-business");
  revalidatePath("/admin/content/acquisition/niches");
  return { success: true };
}

export async function updateAcquisitionNiche(
  slug: string,
  input: AcquisitionNicheFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = acquisitionNicheSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from("acquisition_niches")
    .update(parsed.data)
    .eq("slug", slug);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A niche with this slug already exists." };
    }
    return { success: false, error: "Failed to update the niche." };
  }

  revalidatePath("/buy-business");
  revalidatePath(`/buy-business/niches/${slug}`);
  revalidatePath("/admin/content/acquisition/niches");
  return { success: true };
}

export async function deleteAcquisitionNiche(slug: string): Promise<void> {
  const supabase = await requireAdmin();

  await supabase.from("acquisition_niches").delete().eq("slug", slug);

  await recordAuditLog({
    action: "delete",
    target_table: "acquisition_niches",
    metadata: { slug },
  });

  revalidatePath("/buy-business");
  revalidatePath("/admin/content/acquisition/niches");
}

export async function toggleAcquisitionNicheVisibility(
  slug: string,
  visible: boolean
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("acquisition_niches")
    .update({ is_visible: visible })
    .eq("slug", slug);

  if (error) {
    return { success: false, error: "Failed to update niche visibility." };
  }

  await recordAuditLog({
    action: visible ? "niche.show" : "niche.hide",
    target_table: "acquisition_niches",
    metadata: { slug },
  });

  revalidatePath("/buy-business");
  revalidatePath(`/buy-business/niches/${slug}`);
  revalidatePath("/admin/content/acquisition/niches");
  return { success: true };
}
