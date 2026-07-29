// =============================================================================
// Stratifit Digital Agency — CMS Type Definitions
// Strict TypeScript types for dynamic Page, Section, and ContentBlock payloads.
// No `any` — every CMS data shape is explicitly typed.
// =============================================================================

// -----------------------------------------------------------------------------
// Content Block Types
// -----------------------------------------------------------------------------

export type HeadingBlockData = {
  text: string;
  level: 'h1' | 'h2' | 'h3';
  align: 'left' | 'center' | 'right';
};

export type RichTextBlockData = {
  html_content: string;
  formatted: boolean;
};

export type CardBlockData = {
  title: string;
  description: string;
  icon_name: string;
  media_id: string | null;
};

export type ButtonBlockData = {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
};

export type MediaEmbedBlockData = {
  media_id: string;
  caption?: string;
  aspect_ratio: string;
};

export type ContentBlockData =
  | HeadingBlockData
  | RichTextBlockData
  | CardBlockData
  | ButtonBlockData
  | MediaEmbedBlockData;

export type ContentBlockType =
  | 'heading'
  | 'rich_text'
  | 'card'
  | 'button'
  | 'media_embed';

export type ContentBlock = {
  id: string;
  section_id: string;
  block_type: ContentBlockType;
  data: ContentBlockData;
  display_order: number;
};

// -----------------------------------------------------------------------------
// Section Types
// -----------------------------------------------------------------------------

export type SectionVisibility = {
  device?: 'all' | 'mobile' | 'desktop';
};

export type SectionComponentType =
  | 'hero-primary'
  | 'feature-grid'
  | 'cta-banner'
  | 'pricing-table'
  | 'contact-form';

export type Section = {
  id: string;
  page_id: string;
  component_type: SectionComponentType;
  display_order: number;
  visibility: SectionVisibility;
  content_blocks: ContentBlock[];
};

// -----------------------------------------------------------------------------
// Page Types
// -----------------------------------------------------------------------------

export type PageStatus = 'draft' | 'published' | 'archived';

export type PageMetaData = {
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  meta_data: PageMetaData;
  sections: Section[];
};

// -----------------------------------------------------------------------------
// Navigation Types
// -----------------------------------------------------------------------------

export type MenuType = 'header' | 'footer' | 'sidebar';

export type NavigationItem = {
  id: string;
  page_id: string | null;
  label: string;
  target_url: string;
  menu_type: MenuType;
  display_order: number;
};

// -----------------------------------------------------------------------------
// Translation Types
// -----------------------------------------------------------------------------

export type EntityType = 'pages' | 'sections' | 'content_blocks';

export type Locale = 'en' | 'de';

export type Translation = {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  locale: Locale;
  translated_fields: Record<string, unknown>;
};

// -----------------------------------------------------------------------------
// Settings Types
// -----------------------------------------------------------------------------

export type SocialLinks = {
  github?: string;
  twitter?: string;
  linkedin?: string;
};

export type SiteSettings = {
  site_name: string;
  site_description: string;
  default_locale: Locale;
  supported_locales: Locale[];
  social_links: SocialLinks;
};

// -----------------------------------------------------------------------------
// Media Types
// -----------------------------------------------------------------------------

export type MediaDimensions = {
  width?: number;
  height?: number;
  aspect_ratio?: string;
};

export type Media = {
  id: string;
  storage_path: string;
  public_url: string;
  alt_text: string;
  mime_type: string;
  dimensions: MediaDimensions;
};

// -----------------------------------------------------------------------------
// AI Log Types
// -----------------------------------------------------------------------------

export type AiLog = {
  id: string;
  agent_role: string;
  action: string;
  input_payload: Record<string, unknown>;
  output_payload: Record<string, unknown>;
  created_at: string;
};
