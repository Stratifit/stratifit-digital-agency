import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/media";

export interface PublicPortfolioProject {
  slug: string;
  client_name: string;
  title_translations: Record<string, string> | null;
  summary_translations: Record<string, string> | null;
  featured_media_id: string | null;
  featured_media_url: string | null;
  service_slugs: string[];
}

export async function getPublicPortfolioProjects(
  limit = 8
): Promise<PublicPortfolioProject[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("id, slug, client_name, title_translations, summary_translations, featured_media_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  const projects = data as (typeof data)[number][];

  const { data: linkRows } = await supabase
    .from("portfolio_service_links")
    .select("portfolio_id, service_id");

  const serviceIds = [
    ...new Set((linkRows ?? []).map((l) => l.service_id)),
  ] as string[];

  let servicesResult: { data: { id: string; slug: string }[] | null };
  if (serviceIds.length > 0) {
    servicesResult = await supabase
      .from("services")
      .select("id, slug")
      .in("id", serviceIds);
  } else {
    servicesResult = { data: [] };
  }

  const serviceSlugById = new Map(
    (servicesResult.data ?? []).map((s) => [s.id, s.slug])
  );

  const mediaIds = [
    ...new Set(
      projects
        .map((p) => p.featured_media_id as string | null)
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

  return projects.map((project) => {
    const projectId = project.id as string;
    const linkedServiceIds = (linkRows ?? [])
      .filter((l) => l.portfolio_id === projectId)
      .map((l) => l.service_id);
    const mediaId = project.featured_media_id as string | null;

    return {
      slug: project.slug as string,
      client_name: project.client_name as string,
      title_translations:
        project.title_translations as Record<string, string> | null,
      summary_translations:
        project.summary_translations as Record<string, string> | null,
      featured_media_id: mediaId,
      featured_media_url: mediaId ? (mediaById.get(mediaId) ?? null) : null,
      service_slugs: linkedServiceIds
        .map((id) => serviceSlugById.get(id))
        .filter(Boolean) as string[],
    };
  });
}

export interface PublicPortfolioDetail {
  slug: string;
  client_name: string;
  title_translations: Record<string, string> | null;
  summary_translations: Record<string, string> | null;
  challenge_translations: Record<string, string> | null;
  approach_translations: Record<string, string> | null;
  solution_translations: Record<string, string> | null;
  deliverables_translations: Record<string, unknown> | null;
  results_translations: Record<string, string> | null;
  metrics: unknown[] | null;
  featured_media_id: string | null;
  featured_media_url: string | null;
  published_at: string | null;
}

export async function getPublicPortfolioDetail(
  slug: string
): Promise<PublicPortfolioDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(
      "slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, featured_media_id, published_at"
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

  return { ...(data as Omit<PublicPortfolioDetail, "featured_media_url">), featured_media_url };
}