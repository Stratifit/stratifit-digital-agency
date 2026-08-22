import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseJsonArray } from "@/lib/json";
import {
  resolveTrustedByImages,
  type TrustedByMediaItem,
} from "./media";

export interface HeroMetric {
  value: string;
  label_translations: Record<string, string> | null;
}

export type HeroTrustedByItem = TrustedByMediaItem;

export interface AdminHero {
  is_visible: boolean;
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  highlight_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  primary_cta_label_translations: Record<string, string> | null;
  primary_cta_url: string | null;
  secondary_cta_label_translations: Record<string, string> | null;
  secondary_cta_url: string | null;
  metrics: HeroMetric[] | null;
  trusted_by: HeroTrustedByItem[] | null;
  trusted_by_label_translations: Record<string, string> | null;
}

const SELECT_FIELDS =
  "is_visible, eyebrow_translations, title_translations, highlight_translations, description_translations, primary_cta_label_translations, primary_cta_url, secondary_cta_label_translations, secondary_cta_url, metrics, trusted_by, trusted_by_label_translations";

/** Same fields without `trusted_by` / `trusted_by_label_translations`, for
 *  databases that haven't applied migration 00058 / 00085 yet (the columns
 *  don't exist there). */
const LEGACY_SELECT_FIELDS = SELECT_FIELDS
  .replace(", trusted_by_label_translations", "")
  .replace(", trusted_by", "");

export async function getAdminHero(): Promise<AdminHero | null> {
  const supabase = await createSupabaseServerClient();

  // Retry without the new column while migration 00058 is pending, so the
  // editor opens instead of failing when the hero row exists.
  const full = await supabase
    .from("hero")
    .select(SELECT_FIELDS)
    .eq("singleton_key", true)
    .single();

  let data: AdminHero | null = null;
  if (!full.error) {
    data = full.data as unknown as AdminHero;
  } else {
    const legacy = await supabase
      .from("hero")
      .select(LEGACY_SELECT_FIELDS)
      .eq("singleton_key", true)
      .single();
    if (!legacy.error) {
      data = legacy.data as unknown as AdminHero;
    }
  }

  if (!data) {
    return null;
  }

  const trustedBy = parseJsonArray<HeroTrustedByItem>(data.trusted_by);

  return {
    ...data,
    metrics: parseJsonArray<HeroMetric>(data.metrics) ?? [],
    trusted_by: trustedBy
      ? await resolveTrustedByImages(supabase, trustedBy)
      : null,
  };
}
