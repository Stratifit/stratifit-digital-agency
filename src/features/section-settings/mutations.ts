"use server";
import type { ActionResult } from "@/types/action-result";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { recordAuditLog } from "@/lib/audit";
import {
  reviewSummarySchema,
  sectionSettingsSchema,
  type ReviewSummaryFormValues,
  type SectionSettingsFormValues,
} from "./schemas";
import {
  isEditableSectionKey,
  SECTION_KEY_META,
} from "./defaults";

/** Normalizes an optional CTA label back to null when every locale is empty. */
function ctaLabelToJson(
  translations?: { en: string; de: string; fr: string; es: string }
) {
  if (!translations) return null;
  return Object.values(translations).some((v) => v.trim().length > 0)
    ? translations
    : null;
}


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

export async function updateSectionSettings(
  sectionKey: string,
  input: SectionSettingsFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  if (!isEditableSectionKey(sectionKey)) {
    return { success: false, error: "Unknown section." };
  }

  const parsed = sectionSettingsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Upsert so saving also creates a row when it is missing (for example the
  // tech-stack row before migration 00057 has been applied). Label and
  // display order come from the shared metadata; they are not form-editable.
  const meta = SECTION_KEY_META[sectionKey];
  const { error } = await supabase
    .from("section_settings")
    .upsert(
      {
        section_key: sectionKey,
        label: meta.label,
        display_order: meta.displayOrder,
        eyebrow_translations: parsed.data.eyebrow_translations,
        title_translations: parsed.data.title_translations,
        highlight_translations: parsed.data.highlight_translations,
        description_translations: parsed.data.description_translations,
        footnote_translations: parsed.data.footnote_translations ?? {},
        cta_label_translations: ctaLabelToJson(
          parsed.data.cta_label_translations
        ),
        cta_url: parsed.data.cta_url?.trim() || null,
        // Empty value = intentionally hidden row; don't persist blanks.
        stats: (parsed.data.stats ?? []).filter(
          (stat) => stat.value.trim().length > 0
        ),
        review_summary: parsed.data.review_summary
          ? {
              ...parsed.data.review_summary,
              googleReviewsUrl: parsed.data.review_summary.googleReviewsUrl.trim(),
            }
          : {},
        tech_stack: parsed.data.tech_stack ?? [],
        seo_title_translations: parsed.data.seo_title_translations ?? {},
        seo_description_translations:
          parsed.data.seo_description_translations ?? {},
        is_visible: parsed.data.is_visible,
      },
      { onConflict: "section_key" }
    );

  if (error) {
    return { success: false, error: "Failed to save section settings." };
  }

  // Portfolio card images are managed from this section editor and persist to
  // the portfolio_media gallery table (one row per image slot). Only the cards
  // submitted by the form are touched; other projects keep their galleries.
  if (sectionKey === "portfolio" && parsed.data.cards) {
    // Every card submitted by the editor is reconciled (its gallery rows are
    // replaced by the form's slots), so clearing all six slots also works.
    const { data: projects } = await supabase
      .from("portfolio_projects")
      .select("id, slug")
      .in(
        "slug",
        parsed.data.cards.map((card) => card.slug)
      );
    const idBySlug = new Map(
      (projects ?? []).map((p) => [p.slug as string, p.id as string])
    );

    for (const card of parsed.data.cards) {
      const portfolioId = idBySlug.get(card.slug);
      if (!portfolioId) continue;
      const images = (card.images ?? []).filter(
        (img) =>
          (img.image_url ?? "").trim().length > 0 ||
          (img.media_id ?? "").trim().length > 0
      );
      const { error: deleteError } = await supabase
        .from("portfolio_media")
        .delete()
        .eq("portfolio_id", portfolioId);
      if (deleteError) {
        return { success: false, error: "Failed to save card images." };
      }
      if (images.length > 0) {
        const { error: insertError } = await supabase
          .from("portfolio_media")
          .insert(
            images.map((img, index) => ({
              portfolio_id: portfolioId,
              media_id: (img.media_id ?? "").trim() || null,
              image_url: (img.image_url ?? "").trim() || null,
              caption_translations: {},
              display_order: index + 1,
              is_featured: index === 0,
            }))
          );
        if (insertError) {
          return { success: false, error: "Failed to save card images." };
        }
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/services");
  revalidatePath("/insights");
  revalidatePath("/contact");
  revalidatePath("/buy-business");
  revalidatePath("/testimonials");
  revalidatePath("/admin/content/sections");
  return { success: true };
}

/**
 * Focused save for the reviews summary band (ratings + review counts shown at
 * the top of the reviews page). Saves only the `review_summary` column on the
 * testimonials section row; everything else on the row is left untouched.
 */
export async function updateReviewSummary(
  input: ReviewSummaryFormValues
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  const parsed = reviewSummarySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const meta = SECTION_KEY_META["testimonials"];
  const { error } = await supabase
    .from("section_settings")
    .upsert(
      {
        section_key: "testimonials",
        label: meta.label,
        display_order: meta.displayOrder,
        review_summary: {
          ...parsed.data,
          googleReviewsUrl: parsed.data.googleReviewsUrl.trim(),
        },
      },
      { onConflict: "section_key" }
    );

  if (error) {
    return { success: false, error: "Failed to save review summary." };
  }

  revalidatePath("/");
  revalidatePath("/testimonials");
  revalidatePath("/admin/content/sections");
  revalidatePath("/admin/content/testimonials");
  return { success: true };
}

/**
 * Pause or resume a frontend section from the admin manager.
 * Routes to the right table: section_settings or hero.
 */
export async function toggleSectionVisibility(
  sectionKey: string,
  visible: boolean
): Promise<ActionResult> {
  const supabase = await requireAdmin();

  if (sectionKey === "hero") {
    const { error } = await supabase
      .from("hero")
      .update({ is_visible: visible })
      .eq("singleton_key", true);
    if (error) return { success: false, error: "Failed to update hero." };
    await recordAuditLog({
      action: visible ? "section.resume" : "section.pause",
      target_table: "hero",
      metadata: { sectionKey },
    });
  } else if (isEditableSectionKey(sectionKey)) {
    const meta = SECTION_KEY_META[sectionKey];
    // Upsert so pausing/resuming a section whose row is missing (pending
    // migration) creates it with the shared label/display order instead of
    // silently doing nothing.
    const { error } = await supabase
      .from("section_settings")
      .upsert(
        {
          section_key: sectionKey,
          label: meta.label,
          display_order: meta.displayOrder,
          is_visible: visible,
        },
        { onConflict: "section_key" }
      );
    if (error) return { success: false, error: "Failed to update section." };
    await recordAuditLog({
      action: visible ? "section.resume" : "section.pause",
      target_table: "section_settings",
      target_id: sectionKey,
      metadata: { sectionKey },
    });
  } else {
    return { success: false, error: "Unknown section." };
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/services");
  revalidatePath("/insights");
  revalidatePath("/contact");
  revalidatePath("/buy-business");
  revalidatePath("/testimonials");
  revalidatePath("/admin/content/sections");
  return { success: true };
}
