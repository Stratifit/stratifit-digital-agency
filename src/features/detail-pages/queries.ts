import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DetailPageBlockType = "heading" | "paragraph" | "note";

export interface DetailPageBlock {
  type: DetailPageBlockType;
  text_translations: Record<string, string> | null;
}

export interface PublicDetailPage {
  slug: string;
  title_translations: Record<string, string> | null;
  subtitle_translations: Record<string, string> | null;
  content: DetailPageBlock[];
  is_visible: boolean;
}

export interface AdminDetailPage extends PublicDetailPage {
  id: string;
  is_visible: boolean;
  updated_at: string;
}

function normalizeContent(
  raw: unknown
): DetailPageBlock[] {
  if (!Array.isArray(raw)) return [];
  return (raw as DetailPageBlock[]).filter(
    (block) =>
      block &&
      (block.type === "heading" ||
        block.type === "paragraph" ||
        block.type === "note") &&
      block.text_translations &&
      typeof block.text_translations === "object"
  );
}

/**
 * Public lookup including hidden rows so callers can distinguish
 * "row exists but is hidden" (render nothing / 404) from
 * "row is missing" (render the static fallback).
 */
export async function getPublicDetailPageIncludingHidden(
  slug: string
): Promise<PublicDetailPage | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("detail_pages")
    .select("slug, title_translations, subtitle_translations, content_translations, is_visible")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    slug: data.slug,
    title_translations: (data.title_translations as Record<string, string> | null) ?? null,
    subtitle_translations:
      (data.subtitle_translations as Record<string, string> | null) ?? null,
    content: normalizeContent(data.content_translations),
    is_visible: data.is_visible,
  };
}

export async function getPublicDetailPage(
  slug: string
): Promise<PublicDetailPage | null> {
  const page = await getPublicDetailPageIncludingHidden(slug);
  if (!page || !page.is_visible) {
    return null;
  }
  return page;
}

/** Visible detail page slugs for sitemaps and link generation. */
export async function getPublicDetailPageSlugs(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("detail_pages")
    .select("slug")
    .eq("is_visible", true);
  if (error || !data) return [];
  return data.map((row) => row.slug);
}

export async function getAdminDetailPage(
  slug: string
): Promise<AdminDetailPage | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("detail_pages")
    .select("id, slug, title_translations, subtitle_translations, content_translations, is_visible, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title_translations: (data.title_translations as Record<string, string> | null) ?? null,
    subtitle_translations:
      (data.subtitle_translations as Record<string, string> | null) ?? null,
    content: normalizeContent(data.content_translations),
    is_visible: data.is_visible,
    updated_at: data.updated_at,
  };

}

export async function getAdminDetailPages(): Promise<
  Pick<AdminDetailPage, "slug" | "title_translations" | "is_visible" | "updated_at">[]
> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("detail_pages")
    .select("slug, title_translations, is_visible, updated_at")
    .order("slug", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as Pick<
    AdminDetailPage,
    "slug" | "title_translations" | "is_visible" | "updated_at"
  >[];
}
