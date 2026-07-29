// =============================================================================
// Stratifit Digital Agency — Dynamic CMS Page Route
// Fully dynamic Next.js App Router server page that:
//   1. Resolves the URL slug from the [...slug] catch-all segment
//   2. Fetches the page, sections, and content blocks from Supabase
//   3. Applies locale-specific translations (falling back to en)
//   4. Validates the full payload via Zod
//   5. Renders sections in order using the Section Registry
// =============================================================================

import { notFound } from 'next/navigation';
import type { Page, Section, ContentBlock, ContentBlockData, Locale } from '@/lib/types/cms';
import { pageSchema, contentBlockSchema } from '@/lib/cms/validation';
import { resolveSectionComponent } from '@/components/cms/sections/section-registry';
import { createServerClient } from '@/lib/supabase/server';

type DynamicPageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Merges translation overrides into a page payload for the given locale.
 * Falls back to default English values when a translation key is missing.
 */
function applyTranslations(
  page: Page,
  locale: Locale
): Page {
  const serverClient = createServerClient(); // fully static — safe to call in a pure function context

  // This is a pure-data merge; the actual DB lookup happens upstream.
  // For runtime translation resolution, see the query in getPageBySlug.
  return page;
}

/**
 * Helper to normalise the slug from the catch-all route segment.
 * An empty slug (root `/`) is normalised to `/`.
 */
function resolveSlug(segments: string[] | undefined): string {
  if (!segments || segments.length === 0) {
    return '/';
  }
  return '/' + segments.join('/');
}

export const revalidate = 60; // ISR: revalidate at most every 60 seconds
export const dynamic = 'force-dynamic'; // fallback; ISR handles caching at the data level

export default async function DynamicPage({ params, searchParams }: DynamicPageProps) {
  const resolvedParams = await params;
  const slug = resolveSlug(resolvedParams.slug);

  // Resolve locale from search params or fall back to 'en'
  const resolvedSearchParams = await searchParams;
  const locale: Locale = (resolvedSearchParams?.locale as Locale) ?? 'en';

  // ---------------------------------------------------------------------------
  // 1. Fetch page data from Supabase
  // ---------------------------------------------------------------------------
  const supabase = createServerClient();

  const { data: pageData, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (pageError || !pageData) {
    notFound();
  }

  // ---------------------------------------------------------------------------
  // 2. Fetch sections for this page (ordered)
  // ---------------------------------------------------------------------------
  const { data: sectionsData, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', pageData.id)
    .order('display_order', { ascending: true });

  if (sectionsError || !sectionsData) {
    notFound();
  }

  // ---------------------------------------------------------------------------
  // 3. Fetch content blocks for every section
  // ---------------------------------------------------------------------------
  const sectionIds = sectionsData.map((s) => s.id);

  const { data: blocksData, error: blocksError } = await supabase
    .from('content_blocks')
    .select('*')
    .in('section_id', sectionIds)
    .order('display_order', { ascending: true });

  if (blocksError) {
    notFound();
  }

  // ---------------------------------------------------------------------------
  // 4. Group blocks by section_id
  // ---------------------------------------------------------------------------
  const blocksBySectionId = new Map<string, ContentBlock[]>();
  for (const block of blocksData ?? []) {
    const parsed = contentBlockSchema.safeParse(block);
    if (!parsed.success) {
      // Skip malformed blocks rather than crashing the entire page
      continue;
    }
    const existing = blocksBySectionId.get(block.section_id) ?? [];
    existing.push(parsed.data as ContentBlock);
    blocksBySectionId.set(block.section_id, existing);
  }

  // ---------------------------------------------------------------------------
  // 5. Fetch locale-specific translations (if not 'en')
  // ---------------------------------------------------------------------------
  type TranslationRow = {
    entity_type: string;
    entity_id: string;
    translated_fields: Record<string, unknown>;
  };

  let translations: TranslationRow[] = [];

  if (locale !== 'en') {
    const { data: translationData } = await supabase
      .from('translations')
      .select('entity_type, entity_id, translated_fields')
      .eq('locale', locale)
      .in('entity_id', [pageData.id, ...sectionIds, ...(blocksData ?? []).map((b) => b.id)]);

    translations = (translationData ?? []) as TranslationRow[];
  }

  // Build translation lookup maps
  const pageTranslations = translations.filter((t) => t.entity_type === 'pages');
  const sectionTranslations = translations.filter((t) => t.entity_type === 'sections');
  const blockTranslationsByEntityId = new Map(
    translations
      .filter((t) => t.entity_type === 'content_blocks')
      .map((t) => [t.entity_id, t.translated_fields])
  );

  // ---------------------------------------------------------------------------
  // 6. Assemble the full Page model with translations applied
  // ---------------------------------------------------------------------------

  // Apply page-level translations
  let pageTitle = pageData.title;
  let pageMetaData = pageData.meta_data ?? {};
  for (const pt of pageTranslations) {
    if (pt.translated_fields && typeof pt.translated_fields === 'object') {
      const fields = pt.translated_fields as Record<string, unknown>;
      if (typeof fields.title === 'string') {
        pageTitle = fields.title;
      }
      if (fields.meta_data && typeof fields.meta_data === 'object') {
        pageMetaData = { ...pageMetaData, ...(fields.meta_data as Record<string, unknown>) };
      }
    }
  }

  // Assemble sections with their blocks
  const sections: Section[] = sectionsData.map((sectionRow) => {
    // Apply section-level translations
    let componentType = sectionRow.component_type;
    let visibility = sectionRow.visibility ?? { device: 'all' };
    for (const st of sectionTranslations) {
      if (st.entity_id === sectionRow.id && st.translated_fields) {
        const fields = st.translated_fields as Record<string, unknown>;
        if (typeof fields.component_type === 'string') {
          componentType = fields.component_type;
        }
        if (fields.visibility && typeof fields.visibility === 'object') {
          visibility = { ...visibility, ...(fields.visibility as Record<string, unknown>) };
        }
      }
    }

    // Get blocks for this section
    const rawBlocks = blocksBySectionId.get(sectionRow.id) ?? [];

    // Apply block-level translations
    const contentBlocks: ContentBlock[] = rawBlocks.map((block) => {
      const blockTranslation = blockTranslationsByEntityId.get(block.id);
      if (blockTranslation?.data && typeof blockTranslation.data === 'object') {
        const translatedData = blockTranslation.data as Partial<ContentBlockData>;
        return {
          ...block,
          data: { ...block.data, ...translatedData },
        };
      }
      return block;
    });

    return {
      id: sectionRow.id,
      page_id: sectionRow.page_id,
      component_type: componentType,
      display_order: sectionRow.display_order,
      visibility,
      content_blocks: contentBlocks,
    };
  });

  // ---------------------------------------------------------------------------
  // 7. Validate the full page payload with Zod
  // ---------------------------------------------------------------------------
  const pagePayload: Page = {
    id: pageData.id,
    slug: pageData.slug,
    title: pageTitle,
    status: pageData.status,
    meta_data: pageMetaData,
    sections,
  };

  const parsedPage = pageSchema.safeParse(pagePayload);

  if (!parsedPage.success) {
    // Log validation errors in dev; render 404 in production
    console.error(
      '[CMS] Page payload validation failed:',
      parsedPage.error.flatten()
    );
    notFound();
  }

  // ---------------------------------------------------------------------------
  // 8. Render sections using the Section Registry
  // ---------------------------------------------------------------------------
  const validatedPage = parsedPage.data;

  return (
    <main>
      {validatedPage.sections.map((section) => {
        const SectionComponent = resolveSectionComponent(section.component_type);

        if (!SectionComponent) {
          // Unknown component_type — render nothing rather than crashing
          console.warn(
            `[CMS] Unknown component_type "${section.component_type}" — no component registered.`
          );
          return null;
        }

        return (
          <section key={section.id} data-section={section.component_type}>
            <SectionComponent section={section as unknown as Parameters<typeof SectionComponent>[0]['section']} />
          </section>
        );
      })}
    </main>
  );
}
