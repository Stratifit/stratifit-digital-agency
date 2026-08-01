"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  portfolioSchema,
  insightSchema,
  testimonialSchema,
  pricingSchema,
  faqSchema,
  type PortfolioFormValues,
  type InsightFormValues,
  type TestimonialFormValues,
  type PricingFormValues,
  type FaqFormValues,
} from "./schemas";

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

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

function formatError(error: { code?: string }) {
  if (error.code === "23505") {
    return "An item with this slug already exists.";
  }
  return "Failed to save. Please try again.";
}

export async function savePortfolio(
  input: PortfolioFormValues,
  slug?: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = portfolioSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const row = {
    slug: parsed.data.slug,
    client_name: parsed.data.client_name,
    title_translations: { en: parsed.data.title },
    summary_translations: { en: parsed.data.summary },
    status: parsed.data.status,
  };
  const { error } = slug
    ? await supabase.from("portfolio_projects").update(row).eq("slug", slug)
    : await supabase.from("portfolio_projects").insert(row);
  if (error) return { success: false, error: formatError(error) };
  revalidatePath("/admin/content/portfolio");
  revalidatePath("/");
  return { success: true };
}

export async function saveInsight(
  input: InsightFormValues,
  slug?: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = insightSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const row = {
    slug: parsed.data.slug,
    title_translations: { en: parsed.data.title },
    excerpt_translations: { en: parsed.data.excerpt },
    reading_time_minutes: parsed.data.reading_time_minutes,
    status: parsed.data.status,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  };
  const { error } = slug
    ? await supabase.from("insights").update(row).eq("slug", slug)
    : await supabase.from("insights").insert(row);
  if (error) return { success: false, error: formatError(error) };
  revalidatePath("/admin/content/insights");
  revalidatePath("/");
  return { success: true };
}

export async function saveTestimonial(
  input: TestimonialFormValues,
  id?: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const row = {
    person_name: parsed.data.person_name,
    quote_translations: { en: parsed.data.quote },
    company_name: parsed.data.company_name || null,
    is_visible: parsed.data.is_visible,
    is_verified: parsed.data.is_verified,
  };
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);
  if (error) return { success: false, error: formatError(error) };
  revalidatePath("/admin/content/testimonials");
  revalidatePath("/");
  return { success: true };
}

export async function savePricing(
  input: PricingFormValues,
  slug?: string
): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = pricingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const row = {
    slug: parsed.data.slug,
    name_translations: { en: parsed.data.name },
    price_label_translations: { en: parsed.data.price_label },
    display_order: parsed.data.display_order,
    is_visible: parsed.data.is_visible,
    is_featured: parsed.data.is_featured,
    status: parsed.data.status,
  };
  const { error } = slug
    ? await supabase.from("pricing_plans").update(row).eq("slug", slug)
    : await supabase.from("pricing_plans").insert(row);
  if (error) return { success: false, error: formatError(error) };
  revalidatePath("/admin/content/pricing");
  revalidatePath("/");
  return { success: true };
}

export async function saveFaq(input: FaqFormValues, id?: string): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const row = {
    question_translations: { en: parsed.data.question },
    answer_translations: { en: parsed.data.answer },
    category: parsed.data.category,
    display_order: parsed.data.display_order,
    is_visible: parsed.data.is_visible,
    is_ai_eligible: parsed.data.is_ai_eligible,
    status: parsed.data.status,
  };
  const { error } = id
    ? await supabase.from("faqs").update(row).eq("id", id)
    : await supabase.from("faqs").insert(row);
  if (error) return { success: false, error: formatError(error) };
  revalidatePath("/admin/content/faq");
  revalidatePath("/");
  return { success: true };
}
