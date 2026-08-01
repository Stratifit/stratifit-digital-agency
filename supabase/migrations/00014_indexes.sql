-- Migration: 00014_indexes
-- Description: Create performance indexes for common query patterns.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Content Query Indexes
-- =============================================================================

-- Public services query: status + visibility + ordering
CREATE INDEX services_public_order_idx
  ON public.services (status, is_visible, display_order);

-- Portfolio listing: status + featured + publish date
CREATE INDEX portfolio_public_idx
  ON public.portfolio_projects (status, is_featured, published_at DESC);

-- Insights listing: status + publish date
CREATE INDEX insights_public_idx
  ON public.insights (status, published_at DESC);

-- FAQs listing: status + visibility + ordering
CREATE INDEX faqs_public_order_idx
  ON public.faqs (status, is_visible, display_order);

-- =============================================================================
-- Navigation Indexes
-- =============================================================================

-- Navigation items by location + parent + order
CREATE INDEX navigation_location_order_idx
  ON public.navigation_items (location, parent_id, display_order);

-- =============================================================================
-- Communication Indexes
-- =============================================================================

-- Conversations by status + activity
CREATE INDEX conversations_status_activity_idx
  ON public.chat_conversations (status, last_message_at DESC);

-- Messages by conversation + time
CREATE INDEX messages_conversation_created_idx
  ON public.chat_messages (conversation_id, created_at);

-- Leads by status + creation time
CREATE INDEX leads_status_created_idx
  ON public.leads (status, created_at DESC);

-- =============================================================================
-- Media Indexes
-- =============================================================================

-- Media assets by bucket + creation time
CREATE INDEX media_bucket_created_idx
  ON public.media_assets (bucket_name, created_at DESC);

-- =============================================================================
-- Email Indexes
-- =============================================================================

-- Email events by status + creation time
CREATE INDEX email_events_status_created_idx
  ON public.email_events (status, created_at DESC);

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP INDEX IF EXISTS public.email_events_status_created_idx;
-- DROP INDEX IF EXISTS public.media_bucket_created_idx;
-- DROP INDEX IF EXISTS public.leads_status_created_idx;
-- DROP INDEX IF EXISTS public.messages_conversation_created_idx;
-- DROP INDEX IF EXISTS public.conversations_status_activity_idx;
-- DROP INDEX IF EXISTS public.navigation_location_order_idx;
-- DROP INDEX IF EXISTS public.faqs_public_order_idx;
-- DROP INDEX IF EXISTS public.insights_public_idx;
-- DROP INDEX IF EXISTS public.portfolio_public_idx;
-- DROP INDEX IF EXISTS public.services_public_order_idx;
