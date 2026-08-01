-- Migration: 00001_extensions_and_functions
-- Description: Enable required PostgreSQL extensions and create shared utility functions.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Extensions
-- =============================================================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- UUID generation (oss functions)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Query performance statistics
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Supabase Vault for encrypted secrets
CREATE EXTENSION IF NOT EXISTS "supabase_vault";

-- =============================================================================
-- Shared Functions
-- =============================================================================

-- Updated-at trigger function
-- Automatically sets updated_at to now() on row update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP FUNCTION IF EXISTS public.set_updated_at();
-- DROP EXTENSION IF EXISTS "supabase_vault";
-- DROP EXTENSION IF EXISTS "pg_stat_statements";
-- DROP EXTENSION IF EXISTS "uuid-ossp";
-- DROP EXTENSION IF EXISTS "pgcrypto";
