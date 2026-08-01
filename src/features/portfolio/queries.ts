import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface PublicPortfolioProject {
  slug: string;
  client_name: string;
  title_translations: Record<string, string> | null;
  summary_translations: Record<string, string> | null;
  featured_media_id: string | null;
}

export async function getPublicPortfolioProjects(
  limit = 3
): Promise<PublicPortfolioProject[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("slug, client_name, title_translations, summary_translations, featured_media_id")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    return [];
  }

  return (data ?? []) as PublicPortfolioProject[];
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

  return data as PublicPortfolioDetail;
}
