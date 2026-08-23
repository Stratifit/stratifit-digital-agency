import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AdminPortfolioRow {
  id: string;
  slug: string;
  client_name: string;
  title_translations: Record<string, string> | null;
  status: string;
  /** Primary category label (first linked service, EN title or slug). */
  category: string | null;
}

export interface AdminServiceOption {
  slug: string;
  label: string;
}

/** Published services for the portfolio category dropdown (EN label). */
export async function getAdminServices(): Promise<AdminServiceOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("services")
    .select("slug, title_translations")
    .eq("status", "published")
    .eq("is_visible", true)
    .order("display_order", { ascending: true });
  if (error) return [];
  return (data ?? []).map((s) => ({
    slug: s.slug as string,
    label:
      ((s.title_translations as Record<string, string> | null)?.en as
        | string
        | undefined) ?? (s.slug as string),
  }));
}

export interface AdminInsightRow {
  id: string;
  slug: string;
  title_translations: Record<string, string> | null;
  status: string;
}

export interface AdminTestimonialRow {
  id: string;
  person_name: string;
  quote_translations: Record<string, string> | null;
  is_visible: boolean;
  is_verified: boolean;
}

export interface AdminPricingRow {
  id: string;
  slug: string;
  name_translations: Record<string, string> | null;
  status: string;
  is_visible: boolean;
}

export interface AdminFaqRow {
  id: string;
  question_translations: Record<string, string> | null;
  category: string;
  status: string;
  is_visible: boolean;
}

export async function getAdminPortfolio(): Promise<AdminPortfolioRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("id, slug, client_name, title_translations, status")
    .order("created_at", { ascending: false });
  if (error || !data) return [];

  const { data: linkRows } = await supabase
    .from("portfolio_service_links")
    .select("portfolio_id, service_id");

  const serviceIds = [
    ...new Set((linkRows ?? []).map((l) => l.service_id)),
  ] as string[];
  const { data: servicesData } = serviceIds.length
    ? await supabase
        .from("services")
        .select("id, slug, title_translations")
        .in("id", serviceIds)
    : { data: [] };
  const servicesResult = servicesData ?? [];

  const serviceByProject = new Map<string, string | null>();
  const rows = data as (typeof data)[number][];
  for (const row of rows) {
    const pid = row.id as string;
    const firstServiceId = (linkRows ?? []).find(
      (l) => l.portfolio_id === pid
    )?.service_id;
    const service = firstServiceId
      ? servicesResult.find((s) => s.id === firstServiceId)
      : undefined;
    serviceByProject.set(
      pid,
      service
        ? (((service.title_translations as Record<string, string> | null)?.en as
            | string
            | undefined) ?? service.slug)
        : null
    );
  }

  return rows.map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    client_name: row.client_name as string,
    title_translations: row.title_translations as Record<string, string> | null,
    status: row.status as string,
    category: serviceByProject.get(row.id as string) ?? null,
  }));
}

export interface AdminPortfolioCardImage {
  media_id: string | null;
  image_url: string | null;
}

export interface AdminPortfolioCard {
  slug: string;
  client_name: string;
  title_translations: Record<string, string> | null;
  /** Gallery images in display order (up to 6). */
  images: AdminPortfolioCardImage[];
}

/**
 * Published portfolio projects with their gallery rows, used by the Our Work
 * section editor to manage the 6-slot image grid shown on each homepage card.
 * Matches the public query order so the editor mirrors what the site renders.
 */
export async function getAdminPortfolioCards(
  limit = 8
): Promise<AdminPortfolioCard[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("id, slug, client_name, title_translations")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];

  const ids = data.map((p) => p.id as string);
  const { data: galleryRows } = await supabase
    .from("portfolio_media")
    .select("portfolio_id, media_id, image_url")
    .in("portfolio_id", ids)
    .order("display_order", { ascending: true });

  const imagesByProject = new Map<string, AdminPortfolioCardImage[]>();
  for (const row of galleryRows ?? []) {
    const pid = row.portfolio_id as string;
    const list = imagesByProject.get(pid) ?? [];
    list.push({
      media_id: (row.media_id as string | null) ?? null,
      image_url: (row.image_url as string | null) ?? null,
    });
    imagesByProject.set(pid, list);
  }

  return data.map((p) => ({
    slug: p.slug as string,
    client_name: p.client_name as string,
    title_translations: p.title_translations as Record<string, string> | null,
    images: imagesByProject.get(p.id as string) ?? [],
  }));
}

export async function getAdminInsights(): Promise<AdminInsightRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("insights")
    .select("id, slug, title_translations, status")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as AdminInsightRow[];
}

export async function getAdminTestimonials(): Promise<AdminTestimonialRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, person_name, quote_translations, is_visible, is_verified")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as AdminTestimonialRow[];
}

export async function getAdminPricing(): Promise<AdminPricingRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("pricing_plans")
    .select("id, slug, name_translations, status, is_visible")
    .order("display_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as AdminPricingRow[];
}

export async function getAdminFaqs(): Promise<AdminFaqRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question_translations, category, status, is_visible")
    .order("display_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as AdminFaqRow[];
}
