import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/media";

export interface PublicInsight {
  slug: string;
  title_translations: Record<string, string> | null;
  excerpt_translations: Record<string, string> | null;
  featured_media_id: string | null;
  featured_media_url: string | null;
  category_slugs: string[];
  reading_time_minutes: number | null;
  published_at: string | null;
}

export async function getPublicInsights(limit = 4): Promise<PublicInsight[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("insights")
    .select(
      "id, slug, title_translations, excerpt_translations, featured_media_id, reading_time_minutes, published_at"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  const insights = data as (typeof data)[number][];
  const insightIds = insights.map((i) => i.id as string);

  const { data: linkRows } = await supabase
    .from("insight_category_links")
    .select("insight_id, category_id")
    .in("insight_id", insightIds);

  const categoryIds = [
    ...new Set((linkRows ?? []).map((l) => l.category_id)),
  ] as string[];

  let categoriesResult: { data: { id: string; slug: string }[] | null };
  if (categoryIds.length > 0) {
    categoriesResult = await supabase
      .from("insight_categories")
      .select("id, slug")
      .in("id", categoryIds);
  } else {
    categoriesResult = { data: [] };
  }

  const categorySlugById = new Map(
    (categoriesResult.data ?? []).map((c) => [c.id, c.slug])
  );

  const mediaIds = [
    ...new Set(
      insights
        .map((i) => i.featured_media_id as string | null)
        .filter(Boolean)
    ),
  ] as string[];

  let mediaResult: {
    data: { id: string; bucket_name: string; storage_path: string }[] | null;
  };
  if (mediaIds.length > 0) {
    mediaResult = await supabase
      .from("media_assets")
      .select("id, bucket_name, storage_path")
      .in("id", mediaIds);
  } else {
    mediaResult = { data: [] };
  }

  const mediaById = new Map(
    (mediaResult.data ?? []).map((m) => [
      m.id,
      getMediaPublicUrl(m.bucket_name, m.storage_path),
    ])
  );

  return insights.map((insight) => {
    const insightId = insight.id as string;
    const linkedCategoryIds = (linkRows ?? [])
      .filter((l) => l.insight_id === insightId)
      .map((l) => l.category_id);
    const mediaId = insight.featured_media_id as string | null;

    return {
      slug: insight.slug as string,
      title_translations:
        insight.title_translations as Record<string, string> | null,
      excerpt_translations:
        insight.excerpt_translations as Record<string, string> | null,
      featured_media_id: mediaId,
      featured_media_url: mediaId ? (mediaById.get(mediaId) ?? null) : null,
      category_slugs: linkedCategoryIds
        .map((id) => categorySlugById.get(id))
        .filter(Boolean) as string[],
      reading_time_minutes: insight.reading_time_minutes as number | null,
      published_at: insight.published_at as string | null,
    };
  });
}

export interface PublicInsightCategory {
  slug: string;
  name_translations: Record<string, string> | null;
}

export async function getPublicInsightCategories(): Promise<
  PublicInsightCategory[]
> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("insight_categories")
    .select("slug, name_translations");

  if (error || !data) {
    return [];
  }

  return data as PublicInsightCategory[];
}

export interface PublicInsightDetail {
  slug: string;
  title_translations: Record<string, string> | null;
  excerpt_translations: Record<string, string> | null;
  content_translations: Record<string, string> | null;
  featured_media_id: string | null;
  featured_media_url: string | null;
  category_slugs: string[];
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
      "id, slug, title_translations, excerpt_translations, content_translations, featured_media_id, reading_time_minutes, published_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    return null;
  }

  let featured_media_url: string | null = null;
  if (data.featured_media_id) {
    const { data: media } = await supabase
      .from("media_assets")
      .select("bucket_name, storage_path")
      .eq("id", data.featured_media_id)
      .single();
    if (media) {
      featured_media_url = getMediaPublicUrl(media.bucket_name, media.storage_path);
    }
  }

  const insightId = data.id as string;
  const { data: linkRows } = await supabase
    .from("insight_category_links")
    .select("category_id")
    .eq("insight_id", insightId);

  const categoryIds = (linkRows ?? []).map((l) => l.category_id) as string[];
  let category_slugs: string[] = [];
  if (categoryIds.length > 0) {
    const { data: categories } = await supabase
      .from("insight_categories")
      .select("slug")
      .in("id", categoryIds);
    category_slugs = (categories ?? []).map((c) => c.slug as string);
  }

  return {
    ...(data as Omit<PublicInsightDetail, "featured_media_url" | "category_slugs">),
    featured_media_url,
    category_slugs,
  };
}
