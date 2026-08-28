"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function deletePortfolioProject(slug: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("portfolio_projects").delete().eq("slug", slug);
  await recordAuditLog({ action: "delete", target_table: "portfolio_projects", metadata: { slug } });
  revalidatePath("/admin/content/portfolio");
}

/**
 * Persists the project hero image immediately on upload/remove, mirroring
 * the Hero editor behaviour — the public page reflects the new image right
 * away without requiring a full Save Changes.
 */
export async function updatePortfolioHeroImage(
  slug: string,
  imageUrl: string | null
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const normalizedUrl = imageUrl?.trim() || null;
  const { error } = await supabase
    .from("portfolio_projects")
    .update({ image_url: normalizedUrl })
    .eq("slug", slug);
  if (error) {
    console.error("Failed to save portfolio hero image", {
      code: error.code,
      message: error.message,
    });
    return { success: false, error: "Could not save the hero image." };
  }
  await recordAuditLog({
    action: "save",
    target_table: "portfolio_projects",
    metadata: { slug, image_url: normalizedUrl },
  });
  revalidatePath("/");
  revalidatePath(`/work/${slug}`);
  revalidatePath("/admin/content/portfolio");
  return { success: true };
}

/**
 * Flips a project's public visibility. ON = published (shown on the public
 * site), OFF = draft (hidden everywhere). Public queries only read published
 * rows, so this is the single source of truth for show/hide.
 */
export async function setPortfolioVisibility(
  slug: string,
  visible: boolean
): Promise<void> {
  const supabase = await requireAdmin();
  await supabase
    .from("portfolio_projects")
    .update({ status: visible ? "published" : "draft" })
    .eq("slug", slug);
  await recordAuditLog({
    action: visible ? "publish" : "save",
    target_table: "portfolio_projects",
    metadata: { slug, status: visible ? "published" : "draft" },
  });
  revalidatePath("/admin/content/portfolio");
  revalidatePath("/");
  revalidatePath(`/work/${slug}`);
}

export async function deleteInsight(slug: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("insights").delete().eq("slug", slug);
  await recordAuditLog({ action: "delete", target_table: "insights", metadata: { slug } });
  revalidatePath("/admin/content/insights");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
  await recordAuditLog({ action: "delete", target_table: "testimonials", target_id: id });
  revalidatePath("/admin/content/testimonials");
}

export async function deletePricingPlan(slug: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("pricing_plans").delete().eq("slug", slug);
  await recordAuditLog({ action: "delete", target_table: "pricing_plans", metadata: { slug } });
  revalidatePath("/admin/content/pricing");
}

export async function deleteFaq(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("faqs").delete().eq("id", id);
  await recordAuditLog({ action: "delete", target_table: "faqs", target_id: id });
  revalidatePath("/admin/content/faq");
}
