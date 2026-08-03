"use server";
import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
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
  // Merge English into existing translations so de/fr/es are preserved on edit.
  const titleEn = parsed.data.title;
  const summaryEn = parsed.data.summary;
  let titleTranslations: Record<string, string> = { en: titleEn };
  let summaryTranslations: Record<string, string> = { en: summaryEn };
  if (slug) {
    const { data: existing } = await supabase
      .from("portfolio_projects")
      .select("title_translations, summary_translations")
      .eq("slug", slug)
      .single();
    if (existing) {
      titleTranslations = {
        ...((existing.title_translations as Record<string, string> | null) ?? {}),
        en: titleEn,
      };
      summaryTranslations = {
        ...((existing.summary_translations as Record<string, string> | null) ?? {}),
        en: summaryEn,
      };
    }
  }
  const row = {
    slug: parsed.data.slug,
    client_name: parsed.data.client_name,
    title_translations: titleTranslations,
    summary_translations: summaryTranslations,
    status: parsed.data.status,
  };
  const { error } = slug
    ? await supabase.from("portfolio_projects").update(row).eq("slug", slug)
    : await supabase.from("portfolio_projects").insert(row);
  if (error) return { success: false, error: formatError(error) };
  await recordAuditLog({
    action: parsed.data.status === "published" ? "publish" : "save",
    target_table: "portfolio_projects",
    target_id: slug ?? null,
    metadata: { slug: parsed.data.slug, status: parsed.data.status },
  });
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
  const titleEn = parsed.data.title;
  const excerptEn = parsed.data.excerpt;
  let titleTranslations: Record<string, string> = { en: titleEn };
  let excerptTranslations: Record<string, string> = { en: excerptEn };
  if (slug) {
    const { data: existing } = await supabase
      .from("insights")
      .select("title_translations, excerpt_translations")
      .eq("slug", slug)
      .single();
    if (existing) {
      titleTranslations = {
        ...((existing.title_translations as Record<string, string> | null) ?? {}),
        en: titleEn,
      };
      excerptTranslations = {
        ...((existing.excerpt_translations as Record<string, string> | null) ?? {}),
        en: excerptEn,
      };
    }
  }
  const row = {
    slug: parsed.data.slug,
    title_translations: titleTranslations,
    excerpt_translations: excerptTranslations,
    reading_time_minutes: parsed.data.reading_time_minutes,
    status: parsed.data.status,
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  };
  const { error } = slug
    ? await supabase.from("insights").update(row).eq("slug", slug)
    : await supabase.from("insights").insert(row);
  if (error) return { success: false, error: formatError(error) };
  await recordAuditLog({
    action: parsed.data.status === "published" ? "publish" : "save",
    target_table: "insights",
    target_id: slug ?? null,
    metadata: { slug: parsed.data.slug, status: parsed.data.status },
  });
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
  const quoteEn = parsed.data.quote;
  let quoteTranslations: Record<string, string> = { en: quoteEn };
  if (id) {
    const { data: existing } = await supabase
      .from("testimonials")
      .select("quote_translations")
      .eq("id", id)
      .single();
    if (existing) {
      quoteTranslations = {
        ...((existing.quote_translations as Record<string, string> | null) ?? {}),
        en: quoteEn,
      };
    }
  }
  const row = {
    person_name: parsed.data.person_name,
    quote_translations: quoteTranslations,
    company_name: parsed.data.company_name || null,
    is_visible: parsed.data.is_visible,
    is_verified: parsed.data.is_verified,
  };
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);
  if (error) return { success: false, error: formatError(error) };
  await recordAuditLog({
    action: "save",
    target_table: "testimonials",
    target_id: id ?? null,
    metadata: { person_name: parsed.data.person_name, is_visible: parsed.data.is_visible },
  });
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
  const nameEn = parsed.data.name;
  const priceLabelEn = parsed.data.price_label;
  let nameTranslations: Record<string, string> = { en: nameEn };
  let priceLabelTranslations: Record<string, string> = { en: priceLabelEn };
  if (slug) {
    const { data: existing } = await supabase
      .from("pricing_plans")
      .select("name_translations, price_label_translations")
      .eq("slug", slug)
      .single();
    if (existing) {
      nameTranslations = {
        ...((existing.name_translations as Record<string, string> | null) ?? {}),
        en: nameEn,
      };
      priceLabelTranslations = {
        ...((existing.price_label_translations as Record<string, string> | null) ?? {}),
        en: priceLabelEn,
      };
    }
  }
  const row = {
    slug: parsed.data.slug,
    name_translations: nameTranslations,
    price_label_translations: priceLabelTranslations,
    display_order: parsed.data.display_order,
    is_visible: parsed.data.is_visible,
    is_featured: parsed.data.is_featured,
    status: parsed.data.status,
  };
  const { error } = slug
    ? await supabase.from("pricing_plans").update(row).eq("slug", slug)
    : await supabase.from("pricing_plans").insert(row);
  if (error) return { success: false, error: formatError(error) };
  await recordAuditLog({
    action: parsed.data.status === "published" ? "publish" : "save",
    target_table: "pricing_plans",
    target_id: slug ?? null,
    metadata: { slug: parsed.data.slug, status: parsed.data.status },
  });
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
  const questionEn = parsed.data.question;
  const answerEn = parsed.data.answer;
  let questionTranslations: Record<string, string> = { en: questionEn };
  let answerTranslations: Record<string, string> = { en: answerEn };
  if (id) {
    const { data: existing } = await supabase
      .from("faqs")
      .select("question_translations, answer_translations")
      .eq("id", id)
      .single();
    if (existing) {
      questionTranslations = {
        ...((existing.question_translations as Record<string, string> | null) ?? {}),
        en: questionEn,
      };
      answerTranslations = {
        ...((existing.answer_translations as Record<string, string> | null) ?? {}),
        en: answerEn,
      };
    }
  }
  const row = {
    question_translations: questionTranslations,
    answer_translations: answerTranslations,
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
  await recordAuditLog({
    action: parsed.data.status === "published" ? "publish" : "save",
    target_table: "faqs",
    target_id: id ?? null,
    metadata: { status: parsed.data.status },
  });
  revalidatePath("/admin/content/faq");
  revalidatePath("/");
  return { success: true };
}
