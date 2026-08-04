import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PublicServicePage } from "./types";

const PUBLIC_SELECT =
  "id, slug, is_visible, hero_eyebrow_translations, hero_title_translations, hero_highlight_translations, hero_description_translations, hero_stats, why_title_translations, why_description_translations, why_badges, capabilities_title_translations, capabilities, deliverables_title_translations, deliverables, process_title_translations, process, toolkit_title_translations, toolkit, cta_title_translations, cta_subtitle_translations, cta_button_label_translations, updated_at";

export async function getPublicServicePage(
  slug: string
): Promise<PublicServicePage | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_pages")
    .select(PUBLIC_SELECT)
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as PublicServicePage;
}

export async function getPublicServicePages(): Promise<PublicServicePage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_pages")
    .select(PUBLIC_SELECT)
    .eq("is_visible", true)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data as PublicServicePage[];
}

/** Lightweight variant for callers that only need to know which service
    slugs have a dedicated page — avoids pulling the heavy JSONB columns. */
export async function getPublicServicePageSlugs(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_pages")
    .select("slug")
    .eq("is_visible", true);
  if (error || !data) return [];
  return data.map((row) => row.slug);
}

export async function getAdminServicePage(
  slug: string
): Promise<PublicServicePage | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_pages")
    .select(PUBLIC_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as PublicServicePage;
}

export async function getAdminServicePages(): Promise<
  PublicServicePage[]
> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("service_pages")
    .select("id, slug, is_visible, hero_title_translations, updated_at")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data as PublicServicePage[];
}
