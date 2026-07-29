// ============================================================================
// Stratifit — CMS Type Definitions
// Strict TypeScript types (no `any`) for the multilingual CMS data model.
// ============================================================================

/** Supported content languages */
export type CmsLanguage = "en" | "fr" | "de" | "es";

/** Social links stored as a JSONB object in settings */
export type SocialLinks = Record<string, string>;

/** Overrides for a single field path in a given language */
export interface CmsTranslation {
  id: string;
  entityType: "page" | "section" | "content_block";
  entityId: string;
  language: CmsLanguage;
  fieldPath: string;
  translatedText: string;
  createdAt: string;
  updatedAt: string;
}

/** A content block belongs to a section (e.g. a single service, stat, testimonial) */
export interface CmsContentBlock {
  id: string;
  sectionId: string;
  blockType: string;
  displayOrder: number;
  payload: Record<string, unknown>;
  translations: CmsTranslation[];
  createdAt: string;
  updatedAt: string;
}

/** A section is a template mapped to a React component (e.g. HeroSection) */
export interface CmsSection {
  id: string;
  pageId: string;
  componentType: string;
  displayOrder: number;
  payload: Record<string, unknown>;
  contentBlocks: CmsContentBlock[];
  translations: CmsTranslation[];
  createdAt: string;
  updatedAt: string;
}

/** A page is the top-level CMS entity, identified by slug + language */
export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  language: CmsLanguage;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  sections: CmsSection[];
  translations: CmsTranslation[];
  createdAt: string;
  updatedAt: string;
}

/** A media asset stored in Supabase Storage */
export interface CmsMedia {
  id: string;
  filename: string;
  altText: string | null;
  url: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}

/** Site-wide settings */
export interface CmsSettings {
  id: string;
  siteName: string;
  logoMediaId: string | null;
  primaryLanguage: CmsLanguage;
  availableLanguages: CmsLanguage[];
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

/** AI content generation audit log */
export interface AiLog {
  id: string;
  prompt: string;
  response: string;
  model: string;
  tokensUsed: number | null;
  durationMs: number | null;
  createdAt: string;
}

/** Shape of the resolved page data after applying translations */
export interface ResolvedPage {
  page: CmsPage;
  resolvedSections: ResolvedSection[];
}

/** A section with all its block payloads resolved against translations */
export interface ResolvedSection {
  section: CmsSection;
  resolvedPayload: Record<string, unknown>;
  resolvedBlocks: ResolvedBlock[];
}

/** A content block with its payload resolved against translations */
export interface ResolvedBlock {
  block: CmsContentBlock;
  resolvedPayload: Record<string, unknown>;
}

// ============================================================================
// Section component type constants
// ============================================================================
export const SECTION_COMPONENTS = [
  "HeroSection",
  "ServicesSection",
  "StatsSection",
  "TestimonialsSection",
  "CtaSection",
] as const;

export type SectionComponentType = (typeof SECTION_COMPONENTS)[number];
