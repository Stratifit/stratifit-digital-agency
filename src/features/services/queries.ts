import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicService {
  id: string;
  slug: string;
  title_translations: Record<string, string> | null;
  short_description_translations: Record<string, string> | null;
  icon_name: string | null;
  display_order: number;
}

export interface PublicServiceDetail extends PublicService {
  full_description_translations: Record<string, string> | null;
  deliverables_translations: Record<string, unknown> | null;
  cta_label_translations: Record<string, string> | null;
  cta_url: string | null;
}

export async function getPublicServices(): Promise<PublicServiceDetail[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, title_translations, short_description_translations, full_description_translations, deliverables_translations, icon_name, cta_label_translations, cta_url, display_order"
    )
    .eq("status", "published")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    return [];
  }

  return (data ?? []) as PublicServiceDetail[];
}

export async function getPublicServiceBySlug(
  slug: string
): Promise<PublicServiceDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("services")
    .select(
      "id, slug, title_translations, short_description_translations, full_description_translations, deliverables_translations, icon_name, cta_label_translations, cta_url, display_order"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_visible", true)
    .single();

  if (error) {
    return null;
  }

  return data as PublicServiceDetail;
}
