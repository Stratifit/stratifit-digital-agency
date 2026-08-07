-- Migration: 00033_public_read_link_and_category_tables
-- Description: Public read policies for relationship/category tables that the
--              public site queries to resolve service slugs, category slugs,
--              and gallery media for published content.
-- Stratifit Digital Agency Platform
--
-- The admin-only policies from 00015/00016 gate CMS writes, but they also
-- deny the anon role reads. As a result service_slugs / category_slugs
-- resolve empty on the public site: category badges, gallery images, and
-- the gallery filter pills silently disappear. These policies only expose
-- FK references to content that is already public.

-- =============================================================================
-- portfolio_service_links — service slugs for portfolio projects
-- =============================================================================
CREATE POLICY "public can read linked services for published projects"
  ON public.portfolio_service_links FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.services s
      WHERE s.id = service_id
        AND s.status = 'published'
        AND s.is_visible = true
    )
    AND EXISTS (
      SELECT 1 FROM public.portfolio_projects p
      WHERE p.id = portfolio_id AND p.status = 'published'
    )
  );

-- =============================================================================
-- insight_category_links — category slugs for published insights
-- =============================================================================
CREATE POLICY "public can read linked categories for published insights"
  ON public.insight_category_links FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.insights i
      WHERE i.id = insight_id AND i.status = 'published'
    )
  );

-- =============================================================================
-- insight_categories — category pills on the insights index
-- =============================================================================
CREATE POLICY "public can read categories with published insights"
  ON public.insight_categories FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.insight_category_links l
      JOIN public.insights i ON i.id = l.insight_id
      WHERE l.category_id = id AND i.status = 'published'
    )
  );

-- =============================================================================
-- portfolio_media — gallery images on the work detail page
-- =============================================================================
CREATE POLICY "public can read media for published projects"
  ON public.portfolio_media FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_projects p
      WHERE p.id = portfolio_id AND p.status = 'published'
    )
  );

-- =============================================================================
-- Rollback
-- =============================================================================
-- DROP POLICY IF EXISTS "public can read linked services for published projects" ON public.portfolio_service_links;
-- DROP POLICY IF EXISTS "public can read linked categories for published insights" ON public.insight_category_links;
-- DROP POLICY IF EXISTS "public can read categories with published insights" ON public.insight_categories;
-- DROP POLICY IF EXISTS "public can read media for published projects" ON public.portfolio_media;
