import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicAcquisitionNiches } from "@/features/acquisition/niche-queries";
import { FALLBACK_ACQUISITION_NICHES } from "@/features/acquisition/niche-fallbacks";
import { getPublicServicePageSlugs } from "@/features/service-pages/queries";
import { getPublicDetailPageSlugs } from "@/features/detail-pages/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createSupabaseServerClient();

  const [
    { data: portfolio },
    { data: insights },
    servicePageSlugs,
    detailPageSlugs,
    niches,
  ] = await Promise.all([
    supabase
      .from("portfolio_projects")
      .select("slug, published_at")
      .eq("status", "published"),
    supabase
      .from("insights")
      .select("slug, published_at")
      .eq("status", "published"),
    getPublicServicePageSlugs(),
    getPublicDetailPageSlugs(),
    getPublicAcquisitionNiches(),
  ]);

  // Niche pages render via the canonical fallback catalog when the DB table
  // has no rows, so the sitemap should list the same URLs in that case.
  const sitemapNiches =
    niches.length > 0 ? niches : FALLBACK_ACQUISITION_NICHES;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/services`, lastModified: new Date() },
    { url: `${BASE_URL}/work`, lastModified: new Date() },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date() },
    { url: `${BASE_URL}/insights`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/buy-business`, lastModified: new Date() },
    ...sitemapNiches.map((niche) => ({
      url: `${BASE_URL}/buy-business/niches/${niche.slug}`,
      lastModified: new Date(),
    })),
    { url: `${BASE_URL}/contact`, lastModified: new Date() },
    ...detailPageSlugs.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
    })),
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = (portfolio ?? []).map((p) => ({
    url: `${BASE_URL}/work/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : new Date(),
  }));

  const insightRoutes: MetadataRoute.Sitemap = (insights ?? []).map((i) => ({
    url: `${BASE_URL}/insights/${i.slug}`,
    lastModified: i.published_at ? new Date(i.published_at) : new Date(),
  }));

  const servicePageRoutes: MetadataRoute.Sitemap = servicePageSlugs.map((slug) => ({
    url: `${BASE_URL}/services/${slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...portfolioRoutes,
    ...insightRoutes,
    ...servicePageRoutes,
  ];
}
