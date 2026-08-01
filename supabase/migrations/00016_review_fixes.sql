-- Migration: 00016_review_fixes
-- Description: Versioned RLS enablement for join tables, missing foreign keys,
--              missing indexes on FK columns, domain CHECK constraints, and
--              set_updated_at privilege reduction.
-- Stratifit Digital Agency Platform
--
-- Addresses findings from the OpenCode review. All statements are idempotent
-- or safe on the current data state.

-- =============================================================================
-- 1. Versioned RLS Enablement for Join Tables
-- =============================================================================
-- RLS was enabled ad-hoc during verification but never versioned. Version it
-- so the migration history fully reproduces the schema. Idempotent.

ALTER TABLE public.insight_category_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_service_links ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. Missing Foreign Keys
-- =============================================================================

-- testimonials.related_portfolio_id -> portfolio_projects
ALTER TABLE public.testimonials
  ADD CONSTRAINT testimonials_related_portfolio_id_fkey
  FOREIGN KEY (related_portfolio_id)
  REFERENCES public.portfolio_projects(id)
  ON DELETE SET NULL;

-- portfolio_projects.testimonial_id -> testimonials
-- DEFERRABLE to support the circular reference with testimonials.
ALTER TABLE public.portfolio_projects
  ADD CONSTRAINT portfolio_projects_testimonial_id_fkey
  FOREIGN KEY (testimonial_id)
  REFERENCES public.testimonials(id)
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- =============================================================================
-- 3. Indexes on Foreign Key and Frequently Queried Columns
-- =============================================================================

CREATE INDEX IF NOT EXISTS media_assets_uploaded_by_idx
  ON public.media_assets (uploaded_by);

CREATE INDEX IF NOT EXISTS footer_links_group_id_idx
  ON public.footer_links (group_id);

CREATE INDEX IF NOT EXISTS portfolio_projects_featured_media_idx
  ON public.portfolio_projects (featured_media_id);

CREATE INDEX IF NOT EXISTS portfolio_projects_testimonial_idx
  ON public.portfolio_projects (testimonial_id);

CREATE INDEX IF NOT EXISTS insights_author_user_id_idx
  ON public.insights (author_user_id);

CREATE INDEX IF NOT EXISTS portfolio_media_portfolio_idx
  ON public.portfolio_media (portfolio_id);

CREATE INDEX IF NOT EXISTS portfolio_media_media_idx
  ON public.portfolio_media (media_id);

CREATE INDEX IF NOT EXISTS chatbot_knowledge_reviewed_by_idx
  ON public.chatbot_knowledge (reviewed_by);

CREATE INDEX IF NOT EXISTS email_events_recipient_idx
  ON public.email_events (recipient_email);

CREATE INDEX IF NOT EXISTS audit_logs_actor_user_id_idx
  ON public.audit_logs (actor_user_id);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx
  ON public.audit_logs (created_at);

CREATE INDEX IF NOT EXISTS audit_logs_action_idx
  ON public.audit_logs (action);

-- =============================================================================
-- 4. Domain CHECK Constraints
-- =============================================================================
-- Values verified against existing seed data.

ALTER TABLE public.hero
  ADD CONSTRAINT hero_variant_check
  CHECK (variant IN ('default', 'primary', 'neutral', 'ai'));

ALTER TABLE public.why_choose_us
  ADD CONSTRAINT why_choose_us_variant_check
  CHECK (variant IN ('default', 'primary', 'neutral', 'ai'));

ALTER TABLE public.acquisition_section
  ADD CONSTRAINT acquisition_section_variant_check
  CHECK (variant IN ('default', 'primary', 'neutral', 'ai'));

ALTER TABLE public.final_cta
  ADD CONSTRAINT final_cta_variant_check
  CHECK (variant IN ('default', 'primary', 'neutral', 'ai'));

ALTER TABLE public.media_assets
  ADD CONSTRAINT media_assets_category_check
  CHECK (category IN ('general', 'image', 'video', 'document', 'icon', 'logo', 'banner'));

ALTER TABLE public.media_assets
  ADD CONSTRAINT media_assets_mime_type_check
  CHECK (mime_type ~ '^[a-z]+/[a-z0-9.+-]+$');

ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_delivery_status_check
  CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'read'));

ALTER TABLE public.chat_messages
  ADD CONSTRAINT chat_messages_content_format_check
  CHECK (content_format IN ('text', 'markdown', 'html', 'json'));

ALTER TABLE public.chatbot_settings
  ADD CONSTRAINT chatbot_settings_lead_capture_mode_check
  CHECK (lead_capture_mode IN ('after_resolution', 'before_resolution', 'never'));

ALTER TABLE public.chatbot_settings
  ADD CONSTRAINT chatbot_settings_response_style_check
  CHECK (response_style IN ('professional', 'casual', 'formal'));

ALTER TABLE public.faqs
  ADD CONSTRAINT faqs_category_check
  CHECK (category IN ('general', 'services', 'pricing', 'process', 'ai'));

-- Announcement bar time-range ordering
ALTER TABLE public.announcement_bar
  ADD CONSTRAINT announcement_bar_time_range_check
  CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at);

-- =============================================================================
-- 5. set_updated_at Privilege Reduction
-- =============================================================================
-- The trigger function only assigns now() to NEW.updated_at; it does not
-- require elevated privileges. SECURITY INVOKER removes the privilege
-- escalation surface. SECURITY DEFINER functions is_admin() and
-- has_admin_role() are intentionally unchanged (RLS policies require them).

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- CREATE OR REPLACE FUNCTION public.set_updated_at()
--   RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
--   AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
-- ALTER TABLE public.announcement_bar DROP CONSTRAINT IF EXISTS announcement_bar_time_range_check;
-- ALTER TABLE public.faqs DROP CONSTRAINT IF EXISTS faqs_category_check;
-- ALTER TABLE public.chatbot_settings DROP CONSTRAINT IF EXISTS chatbot_settings_response_style_check;
-- ALTER TABLE public.chatbot_settings DROP CONSTRAINT IF EXISTS chatbot_settings_lead_capture_mode_check;
-- ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_content_format_check;
-- ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_delivery_status_check;
-- ALTER TABLE public.media_assets DROP CONSTRAINT IF EXISTS media_assets_mime_type_check;
-- ALTER TABLE public.media_assets DROP CONSTRAINT IF EXISTS media_assets_category_check;
-- ALTER TABLE public.final_cta DROP CONSTRAINT IF EXISTS final_cta_variant_check;
-- ALTER TABLE public.acquisition_section DROP CONSTRAINT IF EXISTS acquisition_section_variant_check;
-- ALTER TABLE public.why_choose_us DROP CONSTRAINT IF EXISTS why_choose_us_variant_check;
-- ALTER TABLE public.hero DROP CONSTRAINT IF EXISTS hero_variant_check;
-- DROP INDEX IF EXISTS public.audit_logs_action_idx;
-- DROP INDEX IF EXISTS public.audit_logs_created_at_idx;
-- DROP INDEX IF EXISTS public.audit_logs_actor_user_id_idx;
-- DROP INDEX IF EXISTS public.email_events_recipient_idx;
-- DROP INDEX IF EXISTS public.chatbot_knowledge_reviewed_by_idx;
-- DROP INDEX IF EXISTS public.portfolio_media_media_idx;
-- DROP INDEX IF EXISTS public.portfolio_media_portfolio_idx;
-- DROP INDEX IF EXISTS public.insights_author_user_id_idx;
-- DROP INDEX IF EXISTS public.portfolio_projects_testimonial_idx;
-- DROP INDEX IF EXISTS public.portfolio_projects_featured_media_idx;
-- DROP INDEX IF EXISTS public.footer_links_group_id_idx;
-- DROP INDEX IF EXISTS public.media_assets_uploaded_by_idx;
-- ALTER TABLE public.portfolio_projects DROP CONSTRAINT IF EXISTS portfolio_projects_testimonial_id_fkey;
-- ALTER TABLE public.testimonials DROP CONSTRAINT IF EXISTS testimonials_related_portfolio_id_fkey;
-- ALTER TABLE public.portfolio_service_links DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.insight_category_links DISABLE ROW LEVEL SECURITY;
