-- Migration: 00022_leads_business_interest
-- Description: Captures which business a visitor is interested in acquiring.
-- Stratifit Digital Agency Platform

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_interest text;

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.leads DROP COLUMN IF EXISTS business_interest;
