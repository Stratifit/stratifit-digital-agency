import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isDetailPageIconKey } from "./icons";

export type DetailPageBlockType =
  | "heading"
  | "subheading"
  | "paragraph"
  | "list"
  | "panel"
  | "note";

export interface DetailPageListItem {
  text_translations: Record<string, string> | null;
}

export type DetailPageBlock =
  | { type: "heading"; icon?: string; text_translations: Record<string, string> | null }
  | {
      type: "subheading";
      divider?: boolean;
      text_translations: Record<string, string> | null;
    }
  | { type: "paragraph"; text_translations: Record<string, string> | null }
  | { type: "list"; items: DetailPageListItem[] }
  | {
      type: "panel";
      title_translations: Record<string, string> | null;
      tag_translations: Record<string, string> | null;
      body_translations: Record<string, string> | null;
    }
  | { type: "note"; text_translations: Record<string, string> | null };

export interface PublicDetailPage {
  slug: string;
  eyebrow_translations: Record<string, string> | null;
  title_translations: Record<string, string> | null;
  description_translations: Record<string, string> | null;
  subtitle_translations: Record<string, string> | null;
  content: DetailPageBlock[];
  is_visible: boolean;
}

export interface AdminDetailPage extends PublicDetailPage {
  id: string;
  is_visible: boolean;
  updated_at: string;
}

const isTranslations = (value: unknown): value is Record<string, string> =>
  typeof value === "object" && value !== null;

function normalizeTextTranslations(
  value: unknown
): Record<string, string> | null {
  return isTranslations(value) ? value : null;
}

function normalizeBlock(raw: unknown): DetailPageBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const block = raw as Record<string, unknown>;
  const type = block.type;

  switch (type) {
    case "heading": {
      const text = normalizeTextTranslations(block.text_translations);
      if (!text) return null;
      return {
        type,
        icon: isDetailPageIconKey(block.icon) ? block.icon : undefined,
        text_translations: text,
      };
    }
    case "subheading": {
      const text = normalizeTextTranslations(block.text_translations);
      if (!text) return null;
      return {
        type,
        divider: block.divider === true,
        text_translations: text,
      };
    }
    case "paragraph": {
      const text = normalizeTextTranslations(block.text_translations);
      if (!text) return null;
      return { type, text_translations: text };
    }
    case "list": {
      const items = Array.isArray(block.items)
        ? (block.items as unknown[])
            .filter((item) => isTranslations(item))
            .map((item) => ({
              text_translations: normalizeTextTranslations(
                (item as Record<string, unknown>).text_translations
              ),
            }))
            .filter(
              (item): item is DetailPageListItem =>
                item.text_translations !== null
            )
        : [];
      return { type, items };
    }
    case "panel": {
      const title = normalizeTextTranslations(block.title_translations);
      const body = normalizeTextTranslations(block.body_translations);
      if (!title || !body) return null;
      return {
        type,
        title_translations: title,
        tag_translations: normalizeTextTranslations(block.tag_translations),
        body_translations: body,
      };
    }
    case "note": {
      const text = normalizeTextTranslations(block.text_translations);
      if (!text) return null;
      return { type, text_translations: text };
    }
    default:
      return null;
  }
}

function normalizeContent(raw: unknown): DetailPageBlock[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[])
    .map((block) => normalizeBlock(block))
    .filter((block): block is DetailPageBlock => block !== null);
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
    .select(
      "slug, eyebrow_translations, title_translations, description_translations, subtitle_translations, content_translations, is_visible"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    slug: data.slug,
    eyebrow_translations:
      (data.eyebrow_translations as Record<string, string> | null) ?? null,
    title_translations:
      (data.title_translations as Record<string, string> | null) ?? null,
    description_translations:
      (data.description_translations as Record<string, string> | null) ?? null,
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
    .select(
      "id, slug, eyebrow_translations, title_translations, description_translations, subtitle_translations, content_translations, is_visible, updated_at"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    eyebrow_translations:
      (data.eyebrow_translations as Record<string, string> | null) ?? null,
    title_translations:
      (data.title_translations as Record<string, string> | null) ?? null,
    description_translations:
      (data.description_translations as Record<string, string> | null) ?? null,
    subtitle_translations:
      (data.subtitle_translations as Record<string, string> | null) ?? null,
    content: normalizeContent(data.content_translations),
    is_visible: data.is_visible,
    updated_at: data.updated_at,
  };
}

export async function getAdminDetailPages(): Promise<
  Pick<
    AdminDetailPage,
    "slug" | "title_translations" | "is_visible" | "updated_at"
  >[]
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
