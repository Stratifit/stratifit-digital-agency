import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicTestimonial {
  quote_translations: Record<string, string> | null;
  person_name: string;
  person_role_translations: Record<string, string> | null;
  company_name: string | null;
  is_verified: boolean;
  source: "website" | "google";
}

const TESTIMONIAL_BASE_SELECT =
  "quote_translations, person_name, person_role_translations, company_name, is_verified";

/**
 * Seeded reviewers that migration 00056 marks as Google-sourced. When a
 * database hasn't applied that migration (no `source` column), the fallback
 * query mirrors the seed so some cards still show the Google icon. Once the
 * migration is applied, the database column is the source of truth and this
 * name-based mapping is ignored.
 */
const GOOGLE_SOURCE_NAMES = new Set([
  "Marcus Weber",
  "Daniel Okafor",
  "Emma Lindqvist",
  "James Carter",
]);

export async function getPublicTestimonials(
  limit = 3
): Promise<PublicTestimonial[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select(`${TESTIMONIAL_BASE_SELECT}, source`)
    .eq("is_visible", true)
    .eq("is_verified", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    // Graceful fallback for databases that haven't applied migration 00056
    // (testimonials.source) yet: retry without the column so the section keeps
    // rendering. The Google icon appears once the migration is applied.
    const { data: legacyData, error: legacyError } = await supabase
      .from("testimonials")
      .select(TESTIMONIAL_BASE_SELECT)
      .eq("is_visible", true)
      .eq("is_verified", true)
      .order("display_order", { ascending: true })
      .limit(limit);
    if (legacyError) return [];
    return (legacyData ?? []).map((row) => ({
      ...row,
      source: GOOGLE_SOURCE_NAMES.has(row.person_name)
        ? ("google" as const)
        : ("website" as const),
    })) as PublicTestimonial[];
  }

  return (data ?? []) as PublicTestimonial[];
}
