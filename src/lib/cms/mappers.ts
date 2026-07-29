// ============================================================================
// Stratifit — Supabase Row → Domain Type Mappers
// Converts snake_case database rows to camelCase domain types.
// ============================================================================

import type {
  CmsPage,
  CmsSection,
  CmsContentBlock,
  CmsTranslation,
  CmsMedia,
  CmsSettings,
} from "@/lib/types/cms";
import type { Database } from "@/lib/supabase/database.types";

type PageRow = Database["public"]["Tables"]["pages"]["Row"];
type SectionRow = Database["public"]["Tables"]["sections"]["Row"];
type BlockRow = Database["public"]["Tables"]["content_blocks"]["Row"];
type TranslationRow = Database["public"]["Tables"]["translations"]["Row"];
type MediaRow = Database["public"]["Tables"]["media"]["Row"];
type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];

// ============================================================================
// Mapping helpers
// ============================================================================

export function mapPage(row: PageRow): CmsPage {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    language: row.language,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    published: row.published,
    sections: [],
    translations: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapSection(row: SectionRow): CmsSection {
  return {
    id: row.id,
    pageId: row.page_id,
    componentType: row.component_type,
    displayOrder: row.display_order,
    payload: row.payload,
    contentBlocks: [],
    translations: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapContentBlock(row: BlockRow): CmsContentBlock {
  return {
    id: row.id,
    sectionId: row.section_id,
    blockType: row.block_type,
    displayOrder: row.display_order,
    payload: row.payload,
    translations: [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTranslation(row: TranslationRow): CmsTranslation {
  return {
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    language: row.language,
    fieldPath: row.field_path,
    translatedText: row.translated_text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMedia(row: MediaRow): CmsMedia {
  return {
    id: row.id,
    filename: row.filename,
    altText: row.alt_text,
    url: row.url,
    mimeType: row.mime_type,
    width: row.width,
    height: row.height,
    createdAt: row.created_at,
  };
}

export function mapSettings(row: SettingsRow): CmsSettings {
  return {
    id: row.id,
    siteName: row.site_name,
    logoMediaId: row.logo_media_id,
    primaryLanguage: row.primary_language,
    availableLanguages: row.available_languages as CmsSettings["availableLanguages"],
    socialLinks: row.social_links,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
