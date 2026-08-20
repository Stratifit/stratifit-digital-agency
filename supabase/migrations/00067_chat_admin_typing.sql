-- Migration: 00067_chat_admin_typing
-- Description: Adds an `admin_typing_at` timestamp to `chat_conversations`.
--   When an admin is composing a reply in the conversation inbox, the admin
--   panel sets this to now(); the visitor chat widget polls it (the chat
--   tables are admin-only under RLS, so anonymous visitors cannot subscribe
--   to realtime) and shows a "team is typing" indicator while the value is
--   fresh (within ~4 seconds). Cleared when the admin stops typing, sends,
--   or leaves the composer.
-- Stratifit Digital Agency Platform

ALTER TABLE public.chat_conversations
  ADD COLUMN admin_typing_at timestamptz;

COMMENT ON COLUMN public.chat_conversations.admin_typing_at
  IS 'Set while an admin is typing a reply; the visitor widget shows a typing indicator while the value is fresh.';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.chat_conversations DROP COLUMN IF EXISTS admin_typing_at;
