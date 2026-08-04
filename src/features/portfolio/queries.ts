import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMediaPublicUrl } from "@/lib/media";

export interface PublicPortfolioMetric {
  value: string;
  label_translations: Record<string, string> | null;
}

function normalizeMetrics(raw: unknown): PublicPortfolioMetric[] {
  const metricsRaw = (Array.isArray(raw) ? raw : []) as unknown[];
  return metricsRaw
    .filter(
      (m): m is { value: string; label_translations: Record<string, string> | null } =>
        Boolean(
          m &&
            typeof m === "object" &&
            "value" in m &&
            typeof (m as { value: unknown }).value === "string" &&
            (!("label_translations" in m) ||
              (m as { label_translations: unknown }).label_translations ===
                null ||
              typeof (m as { label_translations: unknown })
                .label_translations === "object")
        )
    )
    .map((m) => ({
      value: m.value,
      label_translations: m.label_translations ?? null,
    }));
}

export interface PublicPortfolioProject {
  slug: string;
  client_name: string;
  title_translations: Record<string, string> | null;
  summary_translations: Record<string, string> | null;
  deliverables_translations: Record<string, string[]> | null;
  metrics: PublicPortfolioMetric[];
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
    .select(
      "id, slug, client_name, title_translations, summary_translations, deliverables_translations, metrics, featured_media_id"
    )
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
    const metrics = normalizeMetrics(project.metrics ?? []);

    return {
      slug: project.slug as string,
      client_name: project.client_name as string,
      title_translations:
        project.title_translations as Record<string, string> | null,
      summary_translations:
        project.summary_translations as Record<string, string> | null,
      deliverables_translations:
        project.deliverables_translations as Record<string, string[]> | null,
      metrics,
      featured_media_id: mediaId,
      featured_media_url: mediaId ? (mediaById.get(mediaId) ?? null) : null,
      service_slugs: linkedServiceIds
        .map((id) => serviceSlugById.get(id))
        .filter(Boolean) as string[],
    };
  });
}

export interface PublicPortfolioTestimonial {
  person_name: string;
  quote_translations: Record<string, string> | null;
  person_role_translations: Record<string, string> | null;
  company_name: string | null;
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
  metrics: PublicPortfolioMetric[];
  featured_media_id: string | null;
  featured_media_url: string | null;
  gallery_urls: string[];
  published_at: string | null;
  service_slugs: string[];
  service_titles: Record<string, string> | null;
  testimonial: PublicPortfolioTestimonial | null;
}

export async function getPublicPortfolioDetail(
  slug: string
): Promise<PublicPortfolioDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(
      "id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, featured_media_id, testimonial_id, published_at"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  const projectId = data.id as string;

  // Linked services (for the category badge and Services fact).
  const { data: linkRows } = await supabase
    .from("portfolio_service_links")
    .select("service_id")
    .eq("portfolio_id", projectId);

  const serviceIds = [
    ...new Set((linkRows ?? []).map((l) => l.service_id)),
  ] as string[];

  let service_slugs: string[] = [];
  let service_titles: Record<string, string> | null = null;
  if (serviceIds.length > 0) {
    const { data: serviceRows } = await supabase
      .from("services")
      .select("slug, title_translations")
      .in("id", serviceIds);
    service_slugs = (serviceRows ?? []).map((s) => s.slug as string);
    service_titles =
      (serviceRows?.[0]?.title_translations as Record<string, string> | null) ?? null;
  }

  // Featured + gallery media.
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

  const { data: galleryLinks } = await supabase
    .from("portfolio_media")
    .select("media_id")
    .eq("portfolio_id", projectId)
    .order("display_order", { ascending: true });

  const galleryMediaIds = [
    ...new Set((galleryLinks ?? []).map((g) => g.media_id)),
  ] as string[];

  let gallery_urls: string[] = [];
  if (galleryMediaIds.length > 0) {
    const { data: galleryMedia } = await supabase
      .from("media_assets")
      .select("id, bucket_name, storage_path")
      .in("id", galleryMediaIds);
    const urlById = new Map(
      (galleryMedia ?? []).map((m) => [
        m.id,
        getMediaPublicUrl(m.bucket_name, m.storage_path),
      ])
    );
    gallery_urls = galleryMediaIds
      .map((id) => urlById.get(id))
      .filter((url): url is string => Boolean(url));
  }

  // Linked testimonial.
  let testimonial: PublicPortfolioTestimonial | null = null;
  if (data.testimonial_id) {
    const { data: t } = await supabase
      .from("testimonials")
      .select(
        "person_name, quote_translations, person_role_translations, company_name"
      )
      .eq("id", data.testimonial_id)
      .eq("is_visible", true)
      .single();
    if (t) {
      testimonial = t as PublicPortfolioTestimonial;
    }
  }

  return {
    slug: data.slug as string,
    client_name: data.client_name as string,
    title_translations: data.title_translations as Record<string, string> | null,
    summary_translations:
      data.summary_translations as Record<string, string> | null,
    challenge_translations:
      data.challenge_translations as Record<string, string> | null,
    approach_translations:
      data.approach_translations as Record<string, string> | null,
    solution_translations:
      data.solution_translations as Record<string, string> | null,
    deliverables_translations:
      data.deliverables_translations as Record<string, unknown> | null,
    results_translations:
      data.results_translations as Record<string, string> | null,
    metrics: normalizeMetrics(data.metrics ?? []),
    featured_media_id: data.featured_media_id as string | null,
    featured_media_url,
    gallery_urls,
    published_at: data.published_at as string | null,
    service_slugs,
    service_titles,
    testimonial,
  };
}