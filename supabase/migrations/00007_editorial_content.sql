-- Migration: 00007_editorial_content
-- Description: Create editorial content tables: portfolio_projects,
--              portfolio_service_links, portfolio_media, insights,
--              insight_categories, insight_category_links.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Portfolio Projects
-- =============================================================================

CREATE TABLE public.portfolio_projects (
  id                           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                         text NOT NULL UNIQUE,
  client_name                  text NOT NULL,
  title_translations           jsonb NOT NULL DEFAULT '{}'::jsonb,
  summary_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  challenge_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  approach_translations        jsonb NOT NULL DEFAULT '{}'::jsonb,
  solution_translations        jsonb NOT NULL DEFAULT '{}'::jsonb,
  deliverables_translations    jsonb NOT NULL DEFAULT '{}'::jsonb,
  results_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  metrics                      jsonb NOT NULL DEFAULT '[]'::jsonb,
  featured_media_id            uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  testimonial_id               uuid,
  seo_title_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_featured                  boolean NOT NULL DEFAULT false,
  status                       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at                 timestamptz,
  created_at                   timestamptz NOT NULL DEFAULT now(),
  updated_at                   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.portfolio_projects IS 'Portfolio case studies and project showcases.';

CREATE TRIGGER set_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Portfolio Service Links (Many-to-Many)
-- =============================================================================

CREATE TABLE public.portfolio_service_links (
  portfolio_id uuid NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  service_id   uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (portfolio_id, service_id)
);

COMMENT ON TABLE public.portfolio_service_links IS 'Links portfolio projects to related services.';

-- =============================================================================
-- Portfolio Media
-- =============================================================================

CREATE TABLE public.portfolio_media (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id         uuid NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  media_id             uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  caption_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_order        integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_featured          boolean NOT NULL DEFAULT false,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.portfolio_media IS 'Media gallery items for portfolio projects.';

CREATE TRIGGER set_portfolio_media_updated_at
  BEFORE UPDATE ON public.portfolio_media
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Insights
-- =============================================================================

CREATE TABLE public.insights (
  id                           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                         text NOT NULL UNIQUE,
  title_translations           jsonb NOT NULL DEFAULT '{}'::jsonb,
  excerpt_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  content_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  featured_media_id            uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  author_user_id               uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reading_time_minutes         integer,
  seo_title_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_featured                  boolean NOT NULL DEFAULT false,
  status                       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at                 timestamptz,
  created_at                   timestamptz NOT NULL DEFAULT now(),
  updated_at                   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.insights IS 'Blog posts, articles, and expert insights.';

CREATE TRIGGER set_insights_updated_at
  BEFORE UPDATE ON public.insights
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Insight Categories
-- =============================================================================

CREATE TABLE public.insight_categories (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                       text NOT NULL UNIQUE,
  name_translations          jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.insight_categories IS 'Categories for organizing insights.';

CREATE TRIGGER set_insight_categories_updated_at
  BEFORE UPDATE ON public.insight_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Insight Category Links (Many-to-Many)
-- =============================================================================

CREATE TABLE public.insight_category_links (
  insight_id  uuid NOT NULL REFERENCES public.insights(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.insight_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (insight_id, category_id)
);

COMMENT ON TABLE public.insight_category_links IS 'Links insights to categories.';

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TABLE IF EXISTS public.insight_category_links;
-- DROP TRIGGER IF EXISTS set_insight_categories_updated_at ON public.insight_categories;
-- DROP TABLE IF EXISTS public.insight_categories;
-- DROP TRIGGER IF EXISTS set_insights_updated_at ON public.insights;
-- DROP TABLE IF EXISTS public.insights;
-- DROP TRIGGER IF EXISTS set_portfolio_media_updated_at ON public.portfolio_media;
-- DROP TABLE IF EXISTS public.portfolio_media;
-- DROP TABLE IF EXISTS public.portfolio_service_links;
-- DROP TRIGGER IF EXISTS set_portfolio_projects_updated_at ON public.portfolio_projects;
-- DROP TABLE IF EXISTS public.portfolio_projects;
