-- Migration: 00023_leads_requested_services
-- Description: Allow leads to reference multiple requested services.
-- Stratifit Digital Agency Platform

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS requested_service_ids uuid[] DEFAULT '{}'::uuid[];

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS requested_service_ids;
