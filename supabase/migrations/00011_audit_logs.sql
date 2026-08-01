-- Migration: 00011_audit_logs
-- Description: Create audit_logs table for high-value action tracking.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Audit Logs
-- =============================================================================

CREATE TABLE public.audit_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action           text NOT NULL,
  target_table     text NOT NULL,
  target_id        uuid,
  previous_data    jsonb,
  new_data         jsonb,
  metadata         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at       timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.audit_logs IS 'Audit trail for high-value actions (publish, delete, role change, settings changes).';

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP TABLE IF EXISTS public.audit_logs;
