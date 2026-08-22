import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "de", "fr", "es"] as const;

const translations = () =>
  z.object({
    en: z.string(),
    de: z.string(),
    fr: z.string(),
    es: z.string(),
  });

/** Empty value = hidden row (the editor invites leaving rows blank). */
const statsItem = z.object({
  value: z.string(),
  label_translations: translations(),
});

const techStackItem = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string(),
  /** Optional uploaded logo image — overrides the code-side brand icon. */
  media_id: z.string().optional(),
  image_url: z.string().optional(),
});

/**
 * Review summary band shown on /testimonials. Untouched (all-empty) data is
 * valid so sections that don't use the band never fail validation; once any
 * field is filled, the two ratings become required.
 */
const reviewSummary = z
  .object({
    rating: z.string(),
    verifiedReviews: z.number().int().min(0),
    googleRating: z.string(),
    googleReviews: z.number().int().min(0),
    googleReviewsUrl: z.string(),
  })
  .superRefine((summary, ctx) => {
    const touched =
      [summary.rating, summary.googleRating, summary.googleReviewsUrl].some(
        (value) => value.trim().length > 0
      ) ||
      summary.verifiedReviews > 0 ||
      summary.googleReviews > 0;
    if (!touched) return;

    if (summary.rating.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rating"],
        message: "Rating is required",
      });
    }
    if (summary.googleRating.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["googleRating"],
        message: "Rating is required",
      });
    }
  });

export const sectionSettingsSchema = z.object({
  eyebrow_translations: translations(),
  title_translations: translations().refine(
    (t) => t.en.trim().length > 0,
    "English title is required"
  ),
  highlight_translations: translations(),
  description_translations: translations(),
  /** Optional section-level disclaimer/footnote (pricing section). */
  footnote_translations: translations().optional(),
  /** Optional closing call-to-action (CTA-capable sections only). */
  cta_label_translations: translations().optional(),
  cta_url: z.string().optional(),
  /** Optional stats band (used by the /work page via the portfolio section). */
  stats: z.array(statsItem).optional(),
  /** Optional review summary band (used by the /testimonials page). */
  review_summary: reviewSummary.optional(),
  /** Optional tech-stack marquee items (used by the tech-stack section). */
  tech_stack: z.array(techStackItem).optional(),
  /** Optional page SEO metadata (title + description, all locales). */
  seo_title_translations: translations().optional(),
  seo_description_translations: translations().optional(),
  is_visible: z.boolean(),
});

export type SectionSettingsFormValues = z.infer<
  typeof sectionSettingsSchema
>;
