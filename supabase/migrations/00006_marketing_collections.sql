-- Migration: 00006_marketing_collections
-- Description: Create marketing collection tables: trusted_logos, services,
--              process_steps, testimonials, pricing_plans, faqs.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Trusted Logos
-- =============================================================================

CREATE TABLE public.trusted_logos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  media_id       uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  href           text,
  display_order  integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_visible     boolean NOT NULL DEFAULT true,
  is_verified    boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.trusted_logos IS 'Client and partner logos for the Trusted By section.';

CREATE TRIGGER set_trusted_logos_updated_at
  BEFORE UPDATE ON public.trusted_logos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Services
-- =============================================================================

CREATE TABLE public.services (
  id                             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                           text NOT NULL UNIQUE,
  title_translations             jsonb NOT NULL DEFAULT '{}'::jsonb,
  short_description_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  full_description_translations  jsonb NOT NULL DEFAULT '{}'::jsonb,
  deliverables_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  icon_name                      text,
  featured_media_id              uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  cta_label_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_url                        text,
  seo_title_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo_description_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_order                  integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_featured                    boolean NOT NULL DEFAULT false,
  is_visible                     boolean NOT NULL DEFAULT true,
  status                         text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at                     timestamptz NOT NULL DEFAULT now(),
  updated_at                     timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.services IS 'Core service offerings.';

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Process Steps
-- =============================================================================

CREATE TABLE public.process_steps (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_key                   text NOT NULL UNIQUE,
  number                     integer NOT NULL,
  title_translations         jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  icon_name                  text,
  display_order              integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_visible                 boolean NOT NULL DEFAULT true,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.process_steps IS 'Process steps for the How We Work section.';

CREATE TRIGGER set_process_steps_updated_at
  BEFORE UPDATE ON public.process_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Testimonials
-- =============================================================================

CREATE TABLE public.testimonials (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  person_name            text NOT NULL,
  person_role_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  company_name           text,
  person_media_id        uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  related_service_id     uuid REFERENCES public.services(id) ON DELETE SET NULL,
  related_portfolio_id   uuid,
  display_order          integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_featured            boolean NOT NULL DEFAULT false,
  is_visible             boolean NOT NULL DEFAULT true,
  is_verified            boolean NOT NULL DEFAULT false,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.testimonials IS 'Customer testimonials and quotes.';

CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Pricing Plans
-- =============================================================================

CREATE TABLE public.pricing_plans (
  id                           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                         text NOT NULL UNIQUE,
  name_translations            jsonb NOT NULL DEFAULT '{}'::jsonb,
  description_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  price_label_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  billing_label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  features_translations        jsonb NOT NULL DEFAULT '{}'::jsonb,
  limitations_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_label_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_url                      text,
  disclaimer_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  display_order                integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_featured                  boolean NOT NULL DEFAULT false,
  is_visible                   boolean NOT NULL DEFAULT true,
  status                       text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at                   timestamptz NOT NULL DEFAULT now(),
  updated_at                   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.pricing_plans IS 'Pricing packages and tiers.';

CREATE TRIGGER set_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- FAQs
-- =============================================================================

CREATE TABLE public.faqs (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_translations    jsonb NOT NULL DEFAULT '{}'::jsonb,
  answer_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  category                 text NOT NULL DEFAULT 'general',
  display_order            integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  is_featured              boolean NOT NULL DEFAULT false,
  is_visible               boolean NOT NULL DEFAULT true,
  is_ai_eligible           boolean NOT NULL DEFAULT false,
  status                   text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.faqs IS 'Frequently asked questions.';

CREATE TRIGGER set_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS set_faqs_updated_at ON public.faqs;
-- DROP TABLE IF EXISTS public.faqs;
-- DROP TRIGGER IF EXISTS set_pricing_plans_updated_at ON public.pricing_plans;
-- DROP TABLE IF EXISTS public.pricing_plans;
-- DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
-- DROP TABLE IF EXISTS public.testimonials;
-- DROP TRIGGER IF EXISTS set_process_steps_updated_at ON public.process_steps;
-- DROP TABLE IF EXISTS public.process_steps;
-- DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
-- DROP TABLE IF EXISTS public.services;
-- DROP TRIGGER IF EXISTS set_trusted_logos_updated_at ON public.trusted_logos;
-- DROP TABLE IF EXISTS public.trusted_logos;
