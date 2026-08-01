-- Migration: 00009_ai_settings
-- Description: Create AI settings tables: chatbot_knowledge, chatbot_settings,
--              ai_faq_settings.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Chatbot Knowledge
-- =============================================================================

CREATE TABLE public.chatbot_knowledge (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                 text NOT NULL UNIQUE,
  title_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  content_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  category             text NOT NULL DEFAULT 'general',
  source_type          text NOT NULL DEFAULT 'manual' CHECK (source_type IN (
                         'manual', 'service', 'faq', 'portfolio', 'page', 'policy'
                       )),
  source_id            uuid,
  priority             integer NOT NULL DEFAULT 0,
  is_enabled           boolean NOT NULL DEFAULT true,
  is_ai_eligible       boolean NOT NULL DEFAULT true,
  last_reviewed_at     timestamptz,
  reviewed_by          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chatbot_knowledge IS 'Approved knowledge articles for AI chatbot responses.';

CREATE TRIGGER set_chatbot_knowledge_updated_at
  BEFORE UPDATE ON public.chatbot_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Chatbot Settings (Singleton)
-- =============================================================================

CREATE TABLE public.chatbot_settings (
  singleton_key                     boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  is_enabled                        boolean NOT NULL DEFAULT false,
  welcome_message_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  offline_message_translations      jsonb NOT NULL DEFAULT '{}'::jsonb,
  escalation_message_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  fallback_message_translations     jsonb NOT NULL DEFAULT '{}'::jsonb,
  lead_capture_mode                 text NOT NULL DEFAULT 'after_resolution',
  human_support_enabled             boolean NOT NULL DEFAULT true,
  allowed_categories                text[] NOT NULL DEFAULT ARRAY['general'],
  response_style                    text NOT NULL DEFAULT 'professional',
  provider_config_public            jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at                        timestamptz NOT NULL DEFAULT now(),
  updated_at                        timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chatbot_settings IS 'Singleton table for AI chatbot configuration.';

CREATE TRIGGER set_chatbot_settings_updated_at
  BEFORE UPDATE ON public.chatbot_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- AI FAQ Settings (Singleton)
-- =============================================================================

CREATE TABLE public.ai_faq_settings (
  singleton_key            boolean PRIMARY KEY DEFAULT true CHECK (singleton_key),
  is_enabled               boolean NOT NULL DEFAULT false,
  intro_translations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  suggested_questions      jsonb NOT NULL DEFAULT '[]'::jsonb,
  allowed_categories       text[] NOT NULL DEFAULT ARRAY['general'],
  fallback_translations    jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_label_translations   jsonb NOT NULL DEFAULT '{}'::jsonb,
  cta_url                  text,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.ai_faq_settings IS 'Singleton table for AI FAQ assistant configuration.';

CREATE TRIGGER set_ai_faq_settings_updated_at
  BEFORE UPDATE ON public.ai_faq_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TRIGGER IF EXISTS set_ai_faq_settings_updated_at ON public.ai_faq_settings;
-- DROP TABLE IF EXISTS public.ai_faq_settings;
-- DROP TRIGGER IF EXISTS set_chatbot_settings_updated_at ON public.chatbot_settings;
-- DROP TABLE IF EXISTS public.chatbot_settings;
-- DROP TRIGGER IF EXISTS set_chatbot_knowledge_updated_at ON public.chatbot_knowledge;
-- DROP TABLE IF EXISTS public.chatbot_knowledge;
