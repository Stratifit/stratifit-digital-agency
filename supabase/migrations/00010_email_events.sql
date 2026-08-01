-- Migration: 00010_email_events
-- Description: Create email_events table for Resend delivery tracking.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Email Events
-- =============================================================================

CREATE TABLE public.email_events (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key         text NOT NULL,
  recipient_email      text NOT NULL,
  sender_email         text NOT NULL,
  provider             text NOT NULL DEFAULT 'resend',
  provider_message_id  text,
  status               text NOT NULL DEFAULT 'queued' CHECK (status IN (
                         'queued', 'sent', 'delivered', 'failed', 'bounced', 'complained'
                       )),
  related_type         text,
  related_id           uuid,
  idempotency_key      text UNIQUE,
  error_code           text,
  error_message        text,
  metadata             jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at           timestamptz NOT NULL DEFAULT now(),
  sent_at              timestamptz,
  delivered_at         timestamptz
);

COMMENT ON TABLE public.email_events IS 'Tracks Resend email delivery events for operational and transactional emails.';

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TABLE IF EXISTS public.email_events;
