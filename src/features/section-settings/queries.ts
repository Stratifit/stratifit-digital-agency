import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicSectionSettings {
  section_key: string;
  label: string;
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  highlight_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  /** Optional section-level disclaimer/footnote (pricing section). */
  footnote_translations?: Record<string, string> | null;
  /** Optional closing call-to-action (only populated for CTA-capable sections). */
  cta_label_translations?: Record<string, string> | null;
  cta_url?: string | null;
  /** Optional stats band (portfolio section / /work page). */
  stats?: {
    value: string;
    label_translations: Record<string, string> | null;
  }[] | null;
  /** Optional review summary band (testimonials section / /testimonials page). */
  review_summary?: {
    rating: string;
    verifiedReviews: number;
    googleRating: string;
    googleReviews: number;
    googleReviewsUrl: string;
  } | null;
  /** Optional tech-stack items (tech-stack section). */
  tech_stack?: {
    name: string;
    icon: string;
    media_id?: string | null;
    image_url?: string | null;
  }[] | null;
  /** Optional page SEO metadata (title + description). */
  seo_title_translations?: Record<string, string> | null;
  seo_description_translations?: Record<string, string> | null;
  is_visible: boolean;
}

const SELECT_FIELDS =
  "section_key, label, eyebrow_translations, title_translations, highlight_translations, description_translations, footnote_translations, cta_label_translations, cta_url, stats, review_summary, tech_stack, seo_title_translations, seo_description_translations, is_visible";

/** Same fields without `footnote_translations` and `tech_stack`, for databases
 *  that haven't applied migration 00080 / 00057 yet (the columns don't exist
 *  there). */
const LEGACY_SELECT_FIELDS = SELECT_FIELDS.replace(
  "footnote_translations, ",
  ""
).replace(
  "review_summary, tech_stack, seo_title_translations",
  "review_summary, seo_title_translations"
);

/**
 * Runs the query with the full field list; if that fails because a column is
 * missing (pending migration), retries without the new column so every
 * section keeps rendering. The database remains the source of truth once the
 * migration is applied.
 */
async function withLegacyFallback<T>(
  run: (
    fields: string
  ) => PromiseLike<{ data: T | null; error: { message: string } | null }>
): Promise<T | null> {
  const full = await run(SELECT_FIELDS);
  if (!full.error) return full.data;
  const legacy = await run(LEGACY_SELECT_FIELDS);
  if (legacy.error) return legacy.data;
  return legacy.data;
}

export async function getPublicSectionSetting(
  sectionKey: string
): Promise<PublicSectionSettings | null> {
  const supabase = await createSupabaseServerClient();

  const data = await withLegacyFallback((fields) =>
    supabase
      .from("section_settings")
      .select(fields)
      .eq("section_key", sectionKey)
      .eq("is_visible", true)
      .maybeSingle()
  );

  return data as PublicSectionSettings | null;
}

/**
 * Like `getPublicSectionSetting` but ignores `is_visible` so callers can
 * distinguish a paused section (row exists, hidden) from a missing row.
 */
export async function getPublicSectionSettingIncludingHidden(
  sectionKey: string
): Promise<PublicSectionSettings | null> {
  const supabase = await createSupabaseServerClient();

  const data = await withLegacyFallback((fields) =>
    supabase
      .from("section_settings")
      .select(fields)
      .eq("section_key", sectionKey)
      .maybeSingle()
  );

  return data as PublicSectionSettings | null;
}

export interface AdminSectionSettings extends PublicSectionSettings {
  display_order: number;
  updated_at: string;
}

export async function getAdminSectionSettings(): Promise<AdminSectionSettings[]> {
  const supabase = await createSupabaseServerClient();

  const data = await withLegacyFallback((fields) =>
    supabase
      .from("section_settings")
      .select(`${fields}, display_order, updated_at`)
      .order("display_order", { ascending: true })
  );

  return (data ?? []) as unknown as AdminSectionSettings[];
}

export async function getAdminSectionSetting(
  sectionKey: string
): Promise<AdminSectionSettings | null> {
  const supabase = await createSupabaseServerClient();

  const data = await withLegacyFallback((fields) =>
    supabase
      .from("section_settings")
      .select(`${fields}, display_order, updated_at`)
      .eq("section_key", sectionKey)
      .maybeSingle()
  );

  return data as unknown as AdminSectionSettings | null;
}
