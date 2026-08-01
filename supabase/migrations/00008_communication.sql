-- Migration: 00008_communication
-- Description: Create communication tables: contacts, leads, chat_visitors,
--              chat_conversations, chat_messages, chat_assignments,
--              chat_internal_notes, conversation_events.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Contacts
-- =============================================================================

CREATE TABLE public.contacts (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email              text,
  name               text,
  phone              text,
  company            text,
  preferred_locale   text NOT NULL DEFAULT 'en',
  consent_marketing  boolean NOT NULL DEFAULT false,
  consent_timestamp  timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.contacts IS 'Known people across forms and chat.';

CREATE TRIGGER set_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Leads
-- =============================================================================

CREATE TABLE public.leads (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id             uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  name                   text,
  email                  text,
  phone                  text,
  company                text,
  requested_service_id   uuid REFERENCES public.services(id) ON DELETE SET NULL,
  budget_range           text,
  project_timeline       text,
  preferred_locale       text NOT NULL DEFAULT 'en',
  message                text,
  source                 text NOT NULL DEFAULT 'manual' CHECK (source IN (
                           'contact_form', 'project_enquiry', 'chat',
                           'ai_faq', 'acquisition', 'newsletter', 'manual'
                         )),
  status                 text NOT NULL DEFAULT 'new' CHECK (status IN (
                           'new', 'contacted', 'qualified', 'proposal',
                           'won', 'lost', 'archived'
                         )),
  assigned_to            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  internal_notes         text,
  consent_data           jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.leads IS 'Potential customer enquiries and sales leads.';

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Chat Visitors
-- =============================================================================

CREATE TABLE public.chat_visitors (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_token_hash   text,
  contact_id             uuid REFERENCES public.contacts(id) ON DELETE SET NULL,
  first_seen_at          timestamptz NOT NULL DEFAULT now(),
  last_seen_at           timestamptz NOT NULL DEFAULT now(),
  preferred_locale       text NOT NULL DEFAULT 'en',
  metadata               jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chat_visitors IS 'Anonymous and identified chat visitors.';

CREATE TRIGGER set_chat_visitors_updated_at
  BEFORE UPDATE ON public.chat_visitors
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Chat Conversations
-- =============================================================================

CREATE TABLE public.chat_conversations (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id         uuid NOT NULL REFERENCES public.chat_visitors(id) ON DELETE CASCADE,
  lead_id            uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  status             text NOT NULL DEFAULT 'open' CHECK (status IN (
                       'open', 'waiting_for_admin', 'waiting_for_visitor',
                       'resolved', 'archived'
                     )),
  mode               text NOT NULL DEFAULT 'ai' CHECK (mode IN (
                       'ai', 'human', 'paused', 'closed'
                     )),
  source_page        text,
  assigned_to        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  last_message_at    timestamptz NOT NULL DEFAULT now(),
  resolved_at        timestamptz,
  archived_at        timestamptz,
  metadata           jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chat_conversations IS 'Chat conversation sessions.';

CREATE TRIGGER set_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Chat Messages
-- =============================================================================

CREATE TABLE public.chat_messages (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id    uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_type        text NOT NULL CHECK (sender_type IN ('visitor', 'ai', 'admin', 'system')),
  sender_user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  content            text NOT NULL,
  content_format     text NOT NULL DEFAULT 'text',
  ai_model           text,
  ai_provider        text,
  delivery_status    text NOT NULL DEFAULT 'sent',
  is_internal        boolean NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chat_messages IS 'Individual chat messages within conversations.';

-- =============================================================================
-- Chat Assignments
-- =============================================================================

CREATE TABLE public.chat_assignments (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id    uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  assigned_to        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at        timestamptz NOT NULL DEFAULT now(),
  ended_at           timestamptz
);

COMMENT ON TABLE public.chat_assignments IS 'Assignment history for conversations.';

-- =============================================================================
-- Chat Internal Notes
-- =============================================================================

CREATE TABLE public.chat_internal_notes (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id    uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  author_user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note               text NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.chat_internal_notes IS 'Internal admin notes on conversations. Never publicly visible.';

CREATE TRIGGER set_chat_internal_notes_updated_at
  BEFORE UPDATE ON public.chat_internal_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Conversation Events
-- =============================================================================

CREATE TABLE public.conversation_events (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id    uuid NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  event_type         text NOT NULL CHECK (event_type IN (
                       'created', 'escalated', 'assigned', 'human_takeover',
                       'returned_to_ai', 'resolved', 'archived', 'email_sent'
                     )),
  actor_user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata           jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.conversation_events IS 'Audit trail for conversation state changes.';

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TABLE IF EXISTS public.conversation_events;
-- DROP TABLE IF EXISTS public.chat_internal_notes;
-- DROP TABLE IF EXISTS public.chat_assignments;
-- DROP TABLE IF EXISTS public.chat_messages;
-- DROP TRIGGER IF EXISTS set_chat_conversations_updated_at ON public.chat_conversations;
-- DROP TABLE IF EXISTS public.chat_conversations;
-- DROP TRIGGER IF EXISTS set_chat_visitors_updated_at ON public.chat_visitors;
-- DROP TABLE IF EXISTS public.chat_visitors;
-- DROP TRIGGER IF EXISTS set_leads_updated_at ON public.leads;
-- DROP TABLE IF EXISTS public.leads;
-- DROP TRIGGER IF EXISTS set_contacts_updated_at ON public.contacts;
-- DROP TABLE IF EXISTS public.contacts;
