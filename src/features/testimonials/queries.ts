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
      source: "website" as const,
    })) as PublicTestimonial[];
  }

  return (data ?? []) as PublicTestimonial[];
}
