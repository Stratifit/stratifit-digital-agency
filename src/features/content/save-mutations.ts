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
import { normalizeBrandGuidelines } from "@/features/portfolio/brand-guidelines";
import type { Json } from "@/types/database.types";

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

/**
 * Flattens a per-locale phase-document form value into the stored JSONB shape.
 * Each locale slice keeps only its non-empty string fields (and any non-empty
 * sub-font rows); locale slices that carry no content are dropped entirely, so
 * empty recurring edits never leave blank locales behind.
 */
function cleanPhaseLocales(
  raw:
    | Record<
        string,
        Record<string, unknown>
      >
    | undefined
): Record<string, Record<string, unknown>> {
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, Record<string, unknown>> = {};
  for (const locale of Object.keys(raw)) {
    const slice = raw[locale];
    if (!slice || typeof slice !== "object") continue;
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(slice)) {
      if (Array.isArray(value)) {
        // Sub-font rows: keep rows that carry a name or usage.
        const rows = value
          .map((row) => {
            const r = (row ?? {}) as Record<string, unknown>;
            const next: Record<string, unknown> = {};
            for (const [k, v] of Object.entries(r)) {
              const trimmed = typeof v === "string" ? v.trim() : v;
              if (trimmed !== "") next[k] = trimmed;
            }
            return Object.keys(next).length > 0 ? next : null;
          })
          .filter((r) => r !== null) as Record<string, unknown>[];
        if (rows.length > 0) cleaned[key] = rows;
      } else if (typeof value === "string" && value.trim() !== "") {
        cleaned[key] = value.trim();
      }
    }
    if (Object.keys(cleaned).length > 0) out[locale] = cleaned;
  }
  return out;
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
  const deliverables = (parsed.data.deliverables_translations ??
    {}) as Record<string, string[]>;
  const cleanedDeliverables = Object.fromEntries(
    Object.entries(deliverables).map(([key, list]) => [
      key,
      (list ?? []).map((item) => item.trim()).filter(Boolean),
    ])
  );
  const metrics = (parsed.data.metrics ?? [])
    .map((m) => ({
      value: m.value.trim(),
      label_translations: m.label_translations,
    }))
    .filter(
      (m) =>
        m.value ||
        Object.values(m.label_translations).some((label) => label.trim())
    );

  // Brand guidelines: run the raw JSONB through the normalizer so empty rows
  // (variants/colors/weights/components) never reach the database.
  const brandGuidelines = normalizeBrandGuidelines(parsed.data.brand_guidelines);

  // Phase documents: flatten the per-locale editors into the JSONB shape,
  // dropping empty locales and empty fields while preserving every populated
  // language.
  const strategyTranslations = cleanPhaseLocales(parsed.data.strategy_translations);
  const brandSystemTranslations = cleanPhaseLocales(
    parsed.data.brand_system_translations
  );
  const launchTranslations = cleanPhaseLocales(parsed.data.launch_translations);

  // Slot 1 of the card-image gallery is the cover — mirror it into the legacy
  // image_url column so every reader of image_url (admin list, detail hero
  // fallback) stays consistent with what the editor shows.
  const firstGalleryImage = (parsed.data.gallery ?? []).find((item) =>
    item.image_url.trim()
  )?.image_url.trim();

  const row = {
    slug: parsed.data.slug,
    client_name: parsed.data.client_name,
    title_translations: parsed.data.title_translations,
    summary_translations: parsed.data.summary_translations,
    deliverables_translations: cleanedDeliverables,
    brand_story_translations: parsed.data.brand_story_translations ?? {},
    brand_guidelines: brandGuidelines as unknown as Json,
    strategy_translations: strategyTranslations as unknown as Json,
    brand_system_translations: brandSystemTranslations as unknown as Json,
    launch_translations: launchTranslations as unknown as Json,
    challenge_translations: parsed.data.challenge_translations ?? {},
    solution_translations: parsed.data.solution_translations ?? {},
    results_translations: parsed.data.results_translations ?? {},
    metrics,
    year: parsed.data.year?.trim() ? Number(parsed.data.year) : null,
    testimonial_id: parsed.data.testimonial_id?.trim()
      ? parsed.data.testimonial_id
      : null,
    image_url: firstGalleryImage || parsed.data.image_url.trim() || null,
    seo_title_translations: parsed.data.seo_title_translations ?? {},
    seo_description_translations: parsed.data.seo_description_translations ?? {},
    status: parsed.data.status,
  };
  const { error } = slug
    ? await supabase.from("portfolio_projects").update(row).eq("slug", slug)
    : await supabase.from("portfolio_projects").insert(row);
  if (error) return { success: false, error: formatError(error) };

  // Resolve the project id for the join rows (needed for both new and edit).
  const { data: projectRow } = await supabase
    .from("portfolio_projects")
    .select("id")
    .eq("slug", parsed.data.slug)
    .single();
  const projectId = projectRow?.id as string | undefined;
  if (projectId) {
    // Category: replace the service link with the selected service (if any).
    const { error: linkClearError } = await supabase
      .from("portfolio_service_links")
      .delete()
      .eq("portfolio_id", projectId);
    if (linkClearError) {
      return { success: false, error: "Failed to save the project category." };
    }
    const serviceSlug = parsed.data.service_slug?.trim();
    if (serviceSlug) {
      const { data: serviceRow } = await supabase
        .from("services")
        .select("id")
        .eq("slug", serviceSlug)
        .single();
      if (serviceRow?.id) {
        const { error: linkError } = await supabase
          .from("portfolio_service_links")
          .insert({ portfolio_id: projectId, service_id: serviceRow.id });
        if (linkError) {
          return { success: false, error: "Failed to save the project category." };
        }
      }
    }

    // Gallery: replace rows so ordering and removals stay consistent.
    const { error: galleryClearError } = await supabase
      .from("portfolio_media")
      .delete()
      .eq("portfolio_id", projectId);
    if (galleryClearError) {
      return { success: false, error: "Failed to save the project gallery." };
    }
    const galleryRows = (parsed.data.gallery ?? [])
      .map((item, index) => ({
        portfolio_id: projectId,
        media_id: item.media_id?.trim() ? item.media_id : null,
        image_url: item.image_url.trim() || null,
        caption_translations: {},
        display_order: index + 1,
        is_featured: index === 0,
      }))
      .filter((g) => g.image_url);
    if (galleryRows.length > 0) {
      const { error: galleryError } = await supabase
        .from("portfolio_media")
        .insert(galleryRows);
      if (galleryError) {
        return { success: false, error: "Failed to save the project gallery." };
      }
    }
  }

  await recordAuditLog({
    action: parsed.data.status === "published" ? "publish" : "save",
    target_table: "portfolio_projects",
    target_id: slug ?? null,
    metadata: { slug: parsed.data.slug, status: parsed.data.status },
  });
  revalidatePath("/admin/content/portfolio");
  revalidatePath("/");
  revalidatePath(`/work/${parsed.data.slug}`);
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
    title_translations: parsed.data.title_translations,
    excerpt_translations: parsed.data.excerpt_translations,
    reading_time_minutes: parsed.data.reading_time_minutes,
    seo_title_translations: parsed.data.seo_title_translations ?? {},
    seo_description_translations: parsed.data.seo_description_translations ?? {},
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
  revalidatePath(`/insights/${parsed.data.slug}`);
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
    quote_translations: parsed.data.quote_translations,
    person_role_translations: parsed.data.person_role_translations ?? {},
    company_name: parsed.data.company_name || null,
    source: parsed.data.source,
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
  const row = {
    slug: parsed.data.slug,
    name_translations: parsed.data.name_translations,
    description_translations: parsed.data.description_translations ?? {},
    price_label_translations: parsed.data.price_label_translations,
    billing_label_translations: parsed.data.billing_label_translations ?? {},
    features_translations: parsed.data.features_translations ?? {},
    cta_label_translations: parsed.data.cta_label_translations ?? {},
    cta_url: parsed.data.cta_url?.trim() || null,
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
  const row = {
    question_translations: parsed.data.question_translations,
    answer_translations: parsed.data.answer_translations,
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
