import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicTestimonial {
  quote_translations: Record<string, string> | null;
  person_name: string;
  person_role_translations: Record<string, string> | null;
  company_name: string | null;
  is_verified: boolean;
}

export async function getPublicTestimonials(
  limit = 3
): Promise<PublicTestimonial[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "quote_translations, person_name, person_role_translations, company_name, is_verified"
    )
    .eq("is_visible", true)
    .eq("is_verified", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    return [];
  }

  return (data ?? []) as PublicTestimonial[];
}
