-- Migration: 00024_anon_chat_access
-- Description: Allow the anonymous public chat flow to read chatbot_settings.
--              chatbot_settings is a singleton holding public-facing operational
--              configuration (enabled flag, welcome/offline/escalation/fallback
--              messages, lead-capture mode, human-support flag). None of these
--              fields are secrets, so public SELECT mirrors the existing
--              "public can read site_settings" policy.
--
--              Chat conversation/message writes are NOT exposed to anon. Anonymous
--              visitors have no user session, so the server action
--              (sendVisitorMessage) mediates all chat-table writes using the
--              service-role client (server-only). Private visitor data
--              (chat_visitors, chat_conversations, chat_messages,
--              conversation_events) therefore remains admin-only under RLS.
-- Stratifit Digital Agency Platform

CREATE POLICY "public can read chatbot_settings"
  ON public.chatbot_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- =============================================================================
-- Rollback
-- =============================================================================
-- DROP POLICY IF EXISTS "public can read chatbot_settings" ON public.chatbot_settings;
