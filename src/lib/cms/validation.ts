// =============================================================================
// Stratifit Digital Agency — CMS Zod Validation Schemas
// Validates incoming CMS dynamic data payloads before component rendering.
// =============================================================================

import { z } from 'zod';

// -----------------------------------------------------------------------------
// Content Block Schemas
// -----------------------------------------------------------------------------

export const headingBlockDataSchema = z.object({
  text: z.string().min(1),
  level: z.enum(['h1', 'h2', 'h3']),
  align: z.enum(['left', 'center', 'right']),
});

export const richTextBlockDataSchema = z.object({
  html_content: z.string(),
  formatted: z.boolean(),
});

export const cardBlockDataSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  icon_name: z.string(),
  media_id: z.string().nullable(),
});

export const buttonBlockDataSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(['primary', 'secondary', 'outline']),
});

export const mediaEmbedBlockDataSchema = z.object({
  media_id: z.string().uuid(),
  caption: z.string().optional(),
  aspect_ratio: z.string(),
});

export const contentBlockDataSchema = z.union([
  headingBlockDataSchema,
  richTextBlockDataSchema,
  cardBlockDataSchema,
  buttonBlockDataSchema,
  mediaEmbedBlockDataSchema,
]);

export const contentBlockSchema = z.object({
  id: z.string().uuid(),
  section_id: z.string().uuid(),
  block_type: z.enum(['heading', 'rich_text', 'card', 'button', 'media_embed']),
  data: contentBlockDataSchema,
  display_order: z.number().int().min(0),
});

export const contentBlockArraySchema = z.array(contentBlockSchema);

// -----------------------------------------------------------------------------
// Section Schemas
// -----------------------------------------------------------------------------

export const sectionVisibilitySchema = z.object({
  device: z.enum(['all', 'mobile', 'desktop']).optional(),
});

export const sectionSchema = z.object({
  id: z.string().uuid(),
  page_id: z.string().uuid(),
  component_type: z.enum([
    'hero-primary',
    'feature-grid',
    'cta-banner',
    'pricing-table',
    'contact-form',
  ]),
  display_order: z.number().int().min(0),
  visibility: sectionVisibilitySchema,
  content_blocks: z.array(contentBlockSchema),
});

export const sectionArraySchema = z.array(sectionSchema);

// -----------------------------------------------------------------------------
// Page Schema
// -----------------------------------------------------------------------------

export const pageMetaDataSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z.string().optional(),
  canonical_url: z.string().optional(),
});

export const pageSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']),
  meta_data: pageMetaDataSchema,
  sections: z.array(sectionSchema),
});

// -----------------------------------------------------------------------------
// Page Query Result Schema (what Supabase returns including translations)
// -----------------------------------------------------------------------------

export const pageQueryResultSchema = z.object({
  page: pageSchema.optional(),
  translations: z
    .array(
      z.object({
        entity_type: z.enum(['pages', 'sections', 'content_blocks']),
        entity_id: z.string().uuid(),
        locale: z.enum(['en', 'de']),
        translated_fields: z.record(z.unknown()),
      })
    )
    .optional(),
});

// -----------------------------------------------------------------------------
// Helper: Infer types from schemas
// -----------------------------------------------------------------------------

export type ParsedPage = z.infer<typeof pageSchema>;
export type ParsedSection = z.infer<typeof sectionSchema>;
export type ParsedContentBlock = z.infer<typeof contentBlockSchema>;
export type ParsedContentBlockData = z.infer<typeof contentBlockDataSchema>;
