-- Migration: 00069_admin_presence
-- Description: Track which admins are online (dashboard heartbeat) so the
--              chatbot only hands off to a human when one is actually
--              available, and reword the fallback messages so they no longer
--              claim a team member was notified when nobody is online.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Admin Presence (heartbeat)
-- =============================================================================

CREATE TABLE public.chat_admin_presence (
  user_id       uuid PRIMARY KEY REFERENCES public.admin_users(user_id) ON DELETE CASCADE,
  last_seen_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chat_admin_presence IS
  'Admin online presence heartbeat. The admin dashboard pings last_seen_at '
  'periodically; the chatbot escalates to a human only when a row is fresh.';

ALTER TABLE public.chat_admin_presence ENABLE ROW LEVEL SECURITY;

-- Admins manage their own presence row (upsert from the dashboard heartbeat).
CREATE POLICY "admins can manage own presence"
  ON public.chat_admin_presence FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- =============================================================================
-- Reword fallback messages: they must NOT claim a team member was notified.
-- The escalation message ("A team member has been notified and will join this
-- chat shortly.") is only shown when an admin is actually online.
-- =============================================================================

UPDATE public.chatbot_settings
SET fallback_message_translations = '{
  "en": "I could not find a clear answer to that yet. You can ask me about our services, pricing, or process, or leave your email and our team will get back to you.",
  "de": "Dazu habe ich noch keine klare Antwort. Sie können mich zu unseren Leistungen, Preisen oder Prozessen fragen, oder hinterlassen Sie Ihre E-Mail und unser Team meldet sich bei Ihnen.",
  "fr": "Je n''ai pas encore trouvé de réponse claire à cela. Vous pouvez me poser des questions sur nos services, nos tarifs ou notre processus, ou laisser votre email et notre équipe vous répondra.",
  "es": "Aún no encontré una respuesta clara para eso. Puedes preguntarme sobre nuestros servicios, precios o procesos, o dejar tu correo y nuestro equipo te responderá."
}'::jsonb
WHERE singleton_key = true;

UPDATE public.ai_faq_settings
SET faq_bot_fallback_translations = '{
  "en": "I could not find an answer to that yet. You can ask me about our services, pricing, or process, or leave your email and our team will get back to you.",
  "de": "Dazu habe ich noch keine Antwort gefunden. Sie können mich zu unseren Leistungen, Preisen oder Prozessen fragen, oder hinterlassen Sie Ihre E-Mail und unser Team meldet sich bei Ihnen.",
  "fr": "Je n''ai pas encore trouvé de réponse à cela. Vous pouvez me poser des questions sur nos services, nos tarifs ou notre processus, ou laisser votre email et notre équipe vous répondra.",
  "es": "Aún no encontré una respuesta para eso. Puedes preguntarme sobre nuestros servicios, precios o procesos, o dejar tu correo y nuestro equipo te responderá."
}'::jsonb
WHERE singleton_key = true;

-- =============================================================================
-- Rollback
-- =============================================================================
-- DROP POLICY IF EXISTS "admins can manage own presence" ON public.chat_admin_presence;
-- DROP TABLE IF EXISTS public.chat_admin_presence;
