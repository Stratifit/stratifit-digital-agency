-- Security hardening + FK index coverage.
--
-- Addresses Supabase database linter findings:
--   * 0011 function_search_path_mutable        -> assign_chat_visitor_number()
--   * 0028 anon_security_definer_function_executable -> is_admin(), has_admin_role()
--   * 0001 unindexed_foreign_keys              -> covering indexes for all FK columns
--
-- Notes:
-- * is_admin() / has_admin_role() stay SECURITY DEFINER because every RLS policy
--   that uses them targets the `authenticated` role, and policy expressions are
--   evaluated with the privileges of the querying user. Revoking EXECUTE from
--   `authenticated` would break admin authorization, so EXECUTE is retained there
--   intentionally (see 00016_review_fixes.sql).
-- * No application code calls either function through PostgREST RPC, so denying
--   `anon` (and revoking the implicit PUBLIC grant) removes the exposed RPC
--   surface without affecting RLS behavior.
--
-- To roll back:
--   ALTER FUNCTION public.assign_chat_visitor_number() RESET search_path;
--   GRANT EXECUTE ON FUNCTION public.is_admin() TO PUBLIC;
--   GRANT EXECUTE ON FUNCTION public.has_admin_role(text[]) TO PUBLIC;
--   DROP INDEX <each index created below>;

-- ---------------------------------------------------------------------------
-- 1) Lock the trigger function's search_path (body uses only NEW and a
--    schema-qualified sequence call, so an empty search_path is safe).
-- ---------------------------------------------------------------------------
ALTER FUNCTION public.assign_chat_visitor_number() SET search_path = '';

-- ---------------------------------------------------------------------------
-- 2) Close the anonymous RPC surface on admin helper functions.
--    Functions are granted EXECUTE to PUBLIC by default; revoke it and
--    re-grant only to the roles that legitimately need it.
-- ---------------------------------------------------------------------------
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.has_admin_role(text[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_admin_role(text[]) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_admin_role(text[]) TO authenticated;

-- ---------------------------------------------------------------------------
-- 3) Covering indexes for foreign keys missing one (advisor 0001).
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_navigation_items_parent_id ON public.navigation_items (parent_id);
CREATE INDEX IF NOT EXISTS idx_hero_media_id ON public.hero (media_id);
CREATE INDEX IF NOT EXISTS idx_why_choose_us_media_id ON public.why_choose_us (media_id);
CREATE INDEX IF NOT EXISTS idx_acquisition_section_media_id ON public.acquisition_section (media_id);
CREATE INDEX IF NOT EXISTS idx_services_featured_media_id ON public.services (featured_media_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_person_media_id ON public.testimonials (person_media_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_related_portfolio_id ON public.testimonials (related_portfolio_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_related_service_id ON public.testimonials (related_service_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_service_links_service_id ON public.portfolio_service_links (service_id);
CREATE INDEX IF NOT EXISTS idx_insights_featured_media_id ON public.insights (featured_media_id);
CREATE INDEX IF NOT EXISTS idx_insight_category_links_category_id ON public.insight_category_links (category_id);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads (assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_contact_id ON public.leads (contact_id);
CREATE INDEX IF NOT EXISTS idx_leads_requested_service_id ON public.leads (requested_service_id);
CREATE INDEX IF NOT EXISTS idx_chat_visitors_contact_id ON public.chat_visitors (contact_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_assigned_to ON public.chat_conversations (assigned_to);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_lead_id ON public.chat_conversations (lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_visitor_id ON public.chat_conversations (visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_user_id ON public.chat_messages (sender_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_assignments_assigned_by ON public.chat_assignments (assigned_by);
CREATE INDEX IF NOT EXISTS idx_chat_assignments_assigned_to ON public.chat_assignments (assigned_to);
CREATE INDEX IF NOT EXISTS idx_chat_assignments_conversation_id ON public.chat_assignments (conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_internal_notes_author_user_id ON public.chat_internal_notes (author_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_internal_notes_conversation_id ON public.chat_internal_notes (conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_events_actor_user_id ON public.conversation_events (actor_user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_events_conversation_id ON public.conversation_events (conversation_id);
CREATE INDEX IF NOT EXISTS idx_service_pages_service_id ON public.service_pages (service_id);
CREATE INDEX IF NOT EXISTS idx_email_inbox_sections_auto_reply_template_id ON public.email_inbox_sections (auto_reply_template_id);
CREATE INDEX IF NOT EXISTS idx_email_inbox_sections_resolved_template_id ON public.email_inbox_sections (resolved_template_id);
CREATE INDEX IF NOT EXISTS idx_email_threads_assigned_to ON public.email_threads (assigned_to);
CREATE INDEX IF NOT EXISTS idx_email_threads_lead_id ON public.email_threads (lead_id);
CREATE INDEX IF NOT EXISTS idx_automation_triggers_template_key ON public.automation_triggers (template_key);