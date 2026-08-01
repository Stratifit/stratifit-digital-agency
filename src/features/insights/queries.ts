import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicInsight {
  slug: string;
  title_translations: Record<string, string> | null;
  excerpt_translations: Record<string, string> | null;
  featured_media_id: string | null;
}

export async function getPublicInsights(limit = 3): Promise<PublicInsight[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("insights")
    .select("slug, title_translations, excerpt_translations, featured_media_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return (data ?? []) as PublicInsight[];
}

export interface PublicInsightDetail {
  slug: string;
  title_translations: Record<string, string> | null;
  excerpt_translations: Record<string, string> | null;
  content_translations: Record<string, string> | null;
  featured_media_id: string | null;
  reading_time_minutes: number | null;
  published_at: string | null;
}

export async function getPublicInsightDetail(
  slug: string
): Promise<PublicInsightDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("insights")
    .select(
      "slug, title_translations, excerpt_translations, content_translations, featured_media_id, reading_time_minutes, published_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    return null;
  }

  return data as PublicInsightDetail;
}
