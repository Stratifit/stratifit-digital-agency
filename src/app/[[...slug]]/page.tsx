// ============================================================================
// Stratifit — Catch-All Dynamic Page
// Fully CMS-driven server component: resolves slug + language, fetches
// content from Supabase, validates via Zod, resolves translations, renders
// sections in display_order via the section registry.
// ZERO hardcoded text, images, CTAs, or section order.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import { getSectionComponent } from "@/components/cms/sections/section-registry";
import { resolveEntityTranslations } from "@/lib/cms/translations";
import {
  pageSchema,
  sectionPayloadSchemas,
  blockPayloadSchemas,
} from "@/lib/cms/validation";
import {
  mapPage,
  mapSection,
  mapContentBlock,
  mapTranslation,
} from "@/lib/cms/mappers";
import type {
  CmsLanguage,
  CmsPage,
  CmsSection,
  CmsContentBlock,
  CmsTranslation,
  ResolvedBlock,
  ResolvedSection,
} from "@/lib/types/cms";

// ============================================================================
// Route segment config — no static generation, fully dynamic.
// ============================================================================
export const dynamic = "force-dynamic";
export const revalidate = 0;

// ============================================================================
// Helpers
// ============================================================================

/** Extract the first slug segment, defaulting to "home" for the root. */
function resolveSlug(slugSegments: string[] | undefined): string {
  if (!slugSegments || slugSegments.length === 0) return "home";
  return slugSegments[0];
}

/** Resolve the requested language from search params, falling back to "en". */
function resolveLanguage(searchParams: URLSearchParams): CmsLanguage {
  const lang = searchParams.get("lang");
  if (lang === "fr" || lang === "de" || lang === "es") return lang;
  return "en";
}

/**
 * Zod-validate a section payload against its component type's schema.
 * Falls back to the raw payload if validation fails (graceful degradation).
 */
function validateSectionPayload(
  componentType: string,
  payload: Record<string, unknown>
): Record<string, unknown> {
  const schema = sectionPayloadSchemas[componentType];
  if (!schema) return payload;

  const result = schema.safeParse(payload);
  return result.success ? (result.data as Record<string, unknown>) : payload;
}

/**
 * Zod-validate a content block payload against its block type's schema.
 * Falls back to the raw payload if validation fails (graceful degradation).
 */
function validateBlockPayload(
  blockType: string,
  payload: Record<string, unknown>
): Record<string, unknown> {
  const schema = blockPayloadSchemas[blockType];
  if (!schema) return payload;

  const result = schema.safeParse(payload);
  return result.success ? (result.data as Record<string, unknown>) : payload;
}

// ============================================================================
// Supabase Data Fetching (Server Component)
// ============================================================================

interface FetchedPageData {
  page: CmsPage;
  sections: CmsSection[];
  blocks: CmsContentBlock[];
  translations: CmsTranslation[];
}

/**
 * Fetch the full page tree from Supabase: page → sections → blocks → translations.
 */
async function fetchPageData(
  slug: string,
  language: CmsLanguage
): Promise<FetchedPageData | null> {
  const supabase = createSupabaseClient();

  // 1. Fetch the page by slug + language (exact match)
  //    If not found, fallback to slug + "en"
  let { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("language", language)
    .eq("published", true)
    .single();

  if (!page && language !== "en") {
    const { data: fallbackPage } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("language", "en")
      .eq("published", true)
      .single();

    page = fallbackPage ?? null;
  }

  if (!page) return null;

  // Validate page shape with Zod
  const pageValidation = pageSchema.safeParse(page);
  if (!pageValidation.success) return null;

  const mappedPage = mapPage(page);
  const pageId = mappedPage.id;

  // 2. Fetch sections ordered by display_order
  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", pageId)
    .order("display_order", { ascending: true });

  const mappedSections = sections
    ? sections.map(mapSection)
    : [];

  if (mappedSections.length === 0) {
    return {
      page: mappedPage,
      sections: [],
      blocks: [],
      translations: [],
    };
  }

  const sectionIds = mappedSections.map((s) => s.id);

  // 3. Fetch all content blocks for these sections, ordered
  const { data: blocks } = await supabase
    .from("content_blocks")
    .select("*")
    .in("section_id", sectionIds)
    .order("display_order", { ascending: true });

  // 4. Fetch all translations for the page, sections, and blocks
  const blockIds = ((blocks ?? []) as { id: string }[]).map((b) => b.id);
  const entityFilters = [
    { entity_type: "page", entity_id: pageId },
    ...sectionIds.map((id) => ({ entity_type: "section" as const, entity_id: id })),
    ...blockIds.map((id) => ({ entity_type: "content_block" as const, entity_id: id })),
  ];

  // Build an OR filter: (entity_type=page,entity_id=X),(entity_type=section,entity_id=Y),...
  const orConditions = entityFilters.map(
    (f) => `and(entity_type.eq.${f.entity_type},entity_id.eq.${f.entity_id})`
  );
  const orFilter = orConditions.join(",");

  const { data: translations } = await supabase
    .from("translations")
    .select("*")
    .or(orFilter);

  const mappedBlocks = (blocks ?? []).map(mapContentBlock);
  const mappedTranslations = (translations ?? []).map(mapTranslation);

  return {
    page: mappedPage,
    sections: mappedSections,
    blocks: mappedBlocks,
    translations: mappedTranslations,
  };
}

/**
 * Assemble the final renderable section list by:
 *   1. Grouping blocks under their parent section
 *   2. Validating each payload via Zod
 *   3. Resolving translations for the target language
 *   4. Sorting by display_order
 */
function assembleResolvedSections(
  data: FetchedPageData,
  language: CmsLanguage
): ResolvedSection[] {
  // Group blocks by section_id
  const blocksBySection = new Map<string, CmsContentBlock[]>();
  for (const block of data.blocks) {
    const existing = blocksBySection.get(block.sectionId) ?? [];
    existing.push(block);
    blocksBySection.set(block.sectionId, existing);
  }

  // Group translations by (entity_type + entity_id)
  const translationsByEntity = new Map<string, CmsTranslation[]>();
  for (const t of data.translations) {
    const key = `${t.entityType}:${t.entityId}`;
    const existing = translationsByEntity.get(key) ?? [];
    existing.push(t);
    translationsByEntity.set(key, existing);
  }

  const resolvedSections: ResolvedSection[] = [];

  for (const section of data.sections) {
    // Section translations
    const sectionTKey = `section:${section.id}`;
    const sectionTranslations = translationsByEntity.get(sectionTKey) ?? [];

    // Validate and resolve section payload
    const validatedPayload = validateSectionPayload(
      section.componentType,
      section.payload
    );
    const resolvedPayload = resolveEntityTranslations(
      validatedPayload,
      sectionTranslations,
      language
    );

    // Resolve blocks for this section
    const sectionBlocks = blocksBySection.get(section.id) ?? [];
    const resolvedBlocks: ResolvedBlock[] = sectionBlocks.map((block) => {
      const blockTKey = `content_block:${block.id}`;
      const blockTranslations = translationsByEntity.get(blockTKey) ?? [];

      const validatedBlockPayload = validateBlockPayload(
        block.blockType,
        block.payload
      );
      const resolvedBlockPayload = resolveEntityTranslations(
        validatedBlockPayload,
        blockTranslations,
        language
      );

      return {
        block,
        resolvedPayload: resolvedBlockPayload,
      };
    });

    resolvedSections.push({
      section,
      resolvedPayload,
      resolvedBlocks,
    });
  }

  // Sort sections by display_order (already sorted from DB, but ensure safety)
  resolvedSections.sort((a, b) => a.section.displayOrder - b.section.displayOrder);

  return resolvedSections;
}

// ============================================================================
// Page Component
// ============================================================================

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatchAllPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slug = resolveSlug(resolvedParams.slug);
  const searchParamsObj = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (typeof value === "string") {
      searchParamsObj.set(key, value);
    }
  }
  const language = resolveLanguage(searchParamsObj);

  // Fetch all content
  let data: FetchedPageData | null = null;
  try {
    data = await fetchPageData(slug, language);
  } catch (error) {
    console.error("[CatchAllPage] Failed to fetch page data:", error);
  }

  if (!data) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-surface-dark px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-display-md text-white mb-4">
            Content Unavailable
          </h1>
          <p className="font-body text-body-lg text-neutral-400 mb-6">
            The CMS content could not be loaded.{" "}
            <span className="text-neutral-500">
              Make sure your Supabase project is configured and the seed data
              has been applied.
            </span>
          </p>
          <code className="block text-left text-caption text-neutral-500 bg-surface-darkCard p-4 rounded-xl border border-surface-darkBorder overflow-auto">
            {`1. Create a Supabase project
2. Run: supabase migration up
3. Run: supabase db reset
4. Add credentials to .env.local`}
          </code>
        </div>
      </main>
    );
  }

  // Assemble resolved sections
  const resolvedSections = assembleResolvedSections(data, language);

  // Render sections
  return (
    <main>
      {resolvedSections.map((resolvedSection, index) => {
        const Component = getSectionComponent(
          resolvedSection.section.componentType
        );

        return (
          <Component
            key={`${resolvedSection.section.id}`}
            payload={resolvedSection.resolvedPayload}
            blocks={resolvedSection.resolvedBlocks}
            locale={language}
          />
        );
      })}
    </main>
  );
}
