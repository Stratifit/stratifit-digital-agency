-- Migration: 00052_faq_bot_settings
-- Description: Add the FAQ section bot. Extends ai_faq_settings with the
--              FAQ-bot-specific multilingual fields, adds bot_type to
--              chat_conversations so FAQ-bot conversations stay separate from
--              the main chat, and exposes ai_faq_settings to public read
--              (mirrors the existing "public can read chatbot_settings"
--              policy — the singleton holds no secrets).
-- Stratifit Digital Agency Platform

-- =============================================================================
-- ai_faq_settings — FAQ bot fields
-- =============================================================================

ALTER TABLE public.ai_faq_settings
  ADD COLUMN faq_bot_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN welcome_message_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN suggested_question_translations jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN faq_bot_fallback_translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN faq_bot_allowed_categories text[] NOT NULL DEFAULT ARRAY['general'];

COMMENT ON COLUMN public.ai_faq_settings.faq_bot_enabled IS
  'Enables the standalone FAQ bot opened from the FAQ section.';
COMMENT ON COLUMN public.ai_faq_settings.welcome_message_translations IS
  'Multilingual first message shown by the FAQ bot.';
COMMENT ON COLUMN public.ai_faq_settings.suggested_question_translations IS
  'Multilingual array of default question chips shown by the FAQ bot.';
COMMENT ON COLUMN public.ai_faq_settings.faq_bot_fallback_translations IS
  'Multilingual fallback message used by the FAQ bot when the AI cannot answer.';
COMMENT ON COLUMN public.ai_faq_settings.faq_bot_allowed_categories IS
  'Knowledge categories the FAQ bot may answer from (kept separate from the AI FAQ panel settings).';

-- =============================================================================
-- chat_conversations — bot type
-- =============================================================================

ALTER TABLE public.chat_conversations
  ADD COLUMN bot_type text NOT NULL DEFAULT 'main'
    CHECK (bot_type IN ('main', 'faq'));

COMMENT ON COLUMN public.chat_conversations.bot_type IS
  'Which bot the conversation belongs to: the main chat (main) or the FAQ section bot (faq).';

-- =============================================================================
-- RLS — public read of ai_faq_settings
-- =============================================================================

CREATE POLICY "public can read ai_faq_settings"
  ON public.ai_faq_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- =============================================================================
-- Rollback
-- =============================================================================
-- DROP POLICY IF EXISTS "public can read ai_faq_settings" ON public.ai_faq_settings;
-- ALTER TABLE public.chat_conversations DROP COLUMN IF EXISTS bot_type;
-- ALTER TABLE public.ai_faq_settings
--   DROP COLUMN IF EXISTS faq_bot_allowed_categories,
--   DROP COLUMN IF EXISTS faq_bot_fallback_translations,
--   DROP COLUMN IF EXISTS suggested_question_translations,
--   DROP COLUMN IF EXISTS welcome_message_translations,
--   DROP COLUMN IF EXISTS faq_bot_enabled;
