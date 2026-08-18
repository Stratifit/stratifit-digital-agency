import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicHero {
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  highlight_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  primary_cta_label_translations: Record<string, string> | null;
  primary_cta_url: string | null;
  secondary_cta_label_translations: Record<string, string> | null;
  secondary_cta_url: string | null;
  metrics: unknown[] | null;
  trusted_by: unknown[] | null;
}

const SELECT_FIELDS =
  "eyebrow_translations, title_translations, highlight_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, metrics, trusted_by";

/** Same fields without `trusted_by`, for databases that haven't applied
 *  migration 00058 yet (the column doesn't exist there). */
const LEGACY_SELECT_FIELDS = SELECT_FIELDS.replace(", trusted_by", "");

/**
 * Runs the query with the full field list; if that fails because a column is
 * missing (pending migration), retries without the new column so the hero
 * keeps rendering. The database remains the source of truth once the
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
  return legacy.data;
}

export async function getPublicHero(): Promise<PublicHero | null> {
  const supabase = await createSupabaseServerClient();

  const data = await withLegacyFallback((fields) =>
    supabase
      .from("hero")
      .select(fields)
      .eq("is_visible", true)
      .single()
  );

  return data as PublicHero | null;
}
