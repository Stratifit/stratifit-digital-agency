import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicPricingPlan {
  slug: string;
  name_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  price_label_translations: Record<string, string> | null;
  billing_label_translations: Record<string, string> | null;
  features_translations: Record<string, unknown> | null;
  cta_label_translations: Record<string, string> | null;
  cta_url: string | null;
  is_featured: boolean;
}

export async function getPublicPricingPlans(): Promise<PublicPricingPlan[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("pricing_plans")
    .select(
      "slug, name_translations, description_translations, price_label_translations, billing_label_translations, features_translations, cta_label_translations, cta_url, is_featured"
    )
    .eq("status", "published")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as PublicPricingPlan[];
}
