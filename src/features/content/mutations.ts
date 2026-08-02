"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
  revalidatePath("/admin/content/portfolio");
}

export async function deleteInsight(slug: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("insights").delete().eq("slug", slug);
  revalidatePath("/admin/content/insights");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/admin/content/testimonials");
}

export async function deletePricingPlan(slug: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("pricing_plans").delete().eq("slug", slug);
  revalidatePath("/admin/content/pricing");
}

export async function deleteFaq(id: string): Promise<void> {
  const supabase = await requireAdmin();
  await supabase.from("faqs").delete().eq("id", id);
  revalidatePath("/admin/content/faq");
}
