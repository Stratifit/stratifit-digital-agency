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
  image_url: string | null;
  service_slugs: string[];
  /**
   * Up to 6 images for the card grid (cover first, then gallery rows by
   * display order). Rendered as a 3x2 grid of small thumbnails on the
   * homepage and work galleries.
   */
  card_images: string[];
}

export async function getPublicPortfolioProjects(
  limit = 8,
  serviceSlug?: string
): Promise<PublicPortfolioProject[]> {
  const supabase = await createSupabaseServerClient();

  // When a service is given, restrict to projects linked to that service so
  // each service page only shows its own work.
  let projectIds: string[] | undefined;
  if (serviceSlug) {
    const { data: service } = await supabase
      .from("services")
      .select("id")
      .eq("slug", serviceSlug)
      .maybeSingle();
    if (!service) return [];
    const { data: linkRows } = await supabase
      .from("portfolio_service_links")
      .select("portfolio_id")
      .eq("service_id", service.id);
    projectIds = [
      ...new Set((linkRows ?? []).map((l) => l.portfolio_id as string)),
    ];
    if (projectIds.length === 0) return [];
  }

  let query = supabase
    .from("portfolio_projects")
    .select(
      "id, slug, client_name, title_translations, summary_translations, deliverables_translations, metrics, featured_media_id, image_url"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (projectIds) {
    query = query.in("id", projectIds);
  }

  const { data, error } = await query.limit(limit);

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

  // Gallery rows (cover + up to six card images) for the fetched projects.
  const pageProjectIds = projects.map((p) => p.id as string);
  const { data: galleryRows } = await supabase
    .from("portfolio_media")
    .select("portfolio_id, image_url, media_id")
    .in("portfolio_id", pageProjectIds)
    .order("display_order", { ascending: true });

  const mediaIds = [
    ...new Set([
      ...projects
        .map((p) => p.featured_media_id as string | null)
        .filter(Boolean),
      ...(galleryRows ?? [])
        .map((g) => g.media_id as string | null)
        .filter(Boolean),
    ]),
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

  const galleryByProject = new Map<
    string,
    { image_url: string | null; media_id: string | null }[]
  >();
  for (const row of galleryRows ?? []) {
    const pid = row.portfolio_id as string;
    const list = galleryByProject.get(pid) ?? [];
    list.push({
      image_url: (row.image_url as string | null) ?? null,
      media_id: (row.media_id as string | null) ?? null,
    });
    galleryByProject.set(pid, list);
  }

  return projects.map((project) => {
    const projectId = project.id as string;
    const linkedServiceIds = (linkRows ?? [])
      .filter((l) => l.portfolio_id === projectId)
      .map((l) => l.service_id);
    const mediaId = project.featured_media_id as string | null;
    const metrics = normalizeMetrics(project.metrics ?? []);

    const directImageUrl = project.image_url as string | null;
    const featuredMediaUrl = directImageUrl
      ? directImageUrl
      : mediaId
        ? (mediaById.get(mediaId) ?? null)
        : null;

    // Cover first, then gallery rows by display order — deduped, capped at 6.
    const cardImages: string[] = [];
    const seen = new Set<string>();
    const pushCardImage = (url: string | null | undefined) => {
      if (!url || seen.has(url) || cardImages.length >= 6) return;
      seen.add(url);
      cardImages.push(url);
    };
    pushCardImage(featuredMediaUrl);
    for (const gallery of galleryByProject.get(projectId) ?? []) {
      pushCardImage(
        gallery.image_url ??
          (gallery.media_id ? mediaById.get(gallery.media_id) : null)
      );
    }

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
      featured_media_url: featuredMediaUrl,
      image_url: directImageUrl,
      service_slugs: linkedServiceIds
        .map((id) => serviceSlugById.get(id))
        .filter(Boolean) as string[],
      card_images: cardImages,
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
  image_url: string | null;
  gallery_urls: string[];
  published_at: string | null;
  year: number | null;
  service_slugs: string[];
  service_titles: Record<string, string> | null;
  seo_title_translations: Record<string, string> | null;
  seo_description_translations: Record<string, string> | null;
  testimonial: PublicPortfolioTestimonial | null;
}

export async function getPublicPortfolioDetail(
  slug: string
): Promise<PublicPortfolioDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select(
      "id, slug, client_name, title_translations, summary_translations, challenge_translations, approach_translations, solution_translations, deliverables_translations, results_translations, metrics, featured_media_id, image_url, testimonial_id, seo_title_translations, seo_description_translations, published_at, year"
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

  // Featured + gallery media. Direct image_url wins over media library.
  let featured_media_url: string | null = (data.image_url as string | null) ?? null;
  if (!featured_media_url && data.featured_media_id) {
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
    .select("image_url, media_id")
    .eq("portfolio_id", projectId)
    .order("display_order", { ascending: true });

  const galleryMediaIds = [
    ...new Set(
      (galleryLinks ?? []).map((g) => g.media_id).filter(Boolean)
    ),
  ] as string[];

  let mediaUrlById = new Map<string, string>();
  if (galleryMediaIds.length > 0) {
    const { data: galleryMedia } = await supabase
      .from("media_assets")
      .select("id, bucket_name, storage_path")
      .in("id", galleryMediaIds);
    mediaUrlById = new Map(
      (galleryMedia ?? [])
        .map((m) => [m.id, getMediaPublicUrl(m.bucket_name, m.storage_path)] as const)
        .filter(([, url]) => Boolean(url)) as [string, string][]
    );
  }
  // Direct gallery URLs win over media-library lookups (matches the
  // portfolio_projects.image_url convention from migration 00029/00041).
  const gallery_urls = (galleryLinks ?? [])
    .map((g) => {
      if (g.image_url) return g.image_url;
      if (g.media_id) return mediaUrlById.get(g.media_id) ?? null;
      return null;
    })
    .filter((url): url is string => Boolean(url));

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
    image_url: (data.image_url as string | null) ?? null,
    gallery_urls,
    published_at: data.published_at as string | null,
    year: (data.year as number | null) ?? null,
    service_slugs,
    service_titles,
    seo_title_translations:
      (data.seo_title_translations as Record<string, string> | null) ?? null,
    seo_description_translations:
      (data.seo_description_translations as Record<string, string> | null) ?? null,
    testimonial,
  };
}