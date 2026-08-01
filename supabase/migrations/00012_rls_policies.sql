-- Migration: 00012_rls_policies
-- Description: Enable RLS on all application tables and create public read
--              and admin write policies.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Enable RLS on All Application Tables
-- =============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_bar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.why_choose_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acquisition_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.final_cta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_faq_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- Public Read Policies — Content Tables (status = published AND is_visible = true)
-- =============================================================================

CREATE POLICY "public can read published services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND is_visible = true);

CREATE POLICY "public can read published portfolio_projects"
  ON public.portfolio_projects FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "public can read published insights"
  ON public.insights FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "public can read visible testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read published pricing_plans"
  ON public.pricing_plans FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND is_visible = true);

CREATE POLICY "public can read published faqs"
  ON public.faqs FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND is_visible = true);

CREATE POLICY "public can read visible trusted_logos"
  ON public.trusted_logos FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read visible process_steps"
  ON public.process_steps FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- =============================================================================
-- Public Read Policies — Singleton Sections (is_visible = true)
-- =============================================================================

CREATE POLICY "public can read visible hero"
  ON public.hero FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read visible why_choose_us"
  ON public.why_choose_us FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read visible acquisition_section"
  ON public.acquisition_section FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read visible final_cta"
  ON public.final_cta FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read enabled announcement_bar"
  ON public.announcement_bar FOR SELECT
  TO anon, authenticated
  USING (is_enabled = true);

-- =============================================================================
-- Public Read Policies — Global Settings
-- =============================================================================

CREATE POLICY "public can read site_settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public can read visible navigation_items"
  ON public.navigation_items FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read visible footer_groups"
  ON public.footer_groups FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "public can read visible footer_links"
  ON public.footer_links FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- =============================================================================
-- Public Read Policies — Media
-- =============================================================================

CREATE POLICY "public can read public media_assets"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

-- =============================================================================
-- Public Read Policies — AI Knowledge (published, enabled, AI-eligible)
-- =============================================================================

CREATE POLICY "public can read ai_eligible chatbot_knowledge"
  ON public.chatbot_knowledge FOR SELECT
  TO anon, authenticated
  USING (is_enabled = true AND is_ai_eligible = true);

-- =============================================================================
-- Admin-All Policies — Content Tables
-- =============================================================================

CREATE POLICY "admins can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage portfolio_projects"
  ON public.portfolio_projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage portfolio_media"
  ON public.portfolio_media FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage insights"
  ON public.insights FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage insight_categories"
  ON public.insight_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage testimonials"
  ON public.testimonials FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage pricing_plans"
  ON public.pricing_plans FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage faqs"
  ON public.faqs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage trusted_logos"
  ON public.trusted_logos FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage process_steps"
  ON public.process_steps FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Admin-All Policies — Singleton Tables
-- =============================================================================

CREATE POLICY "admins can manage site_settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage announcement_bar"
  ON public.announcement_bar FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage hero"
  ON public.hero FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage why_choose_us"
  ON public.why_choose_us FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage acquisition_section"
  ON public.acquisition_section FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage final_cta"
  ON public.final_cta FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage chatbot_settings"
  ON public.chatbot_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage ai_faq_settings"
  ON public.ai_faq_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Admin-All Policies — Navigation and Footer
-- =============================================================================

CREATE POLICY "admins can manage navigation_items"
  ON public.navigation_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage footer_groups"
  ON public.footer_groups FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage footer_links"
  ON public.footer_links FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Admin-All Policies — Media
-- =============================================================================

CREATE POLICY "admins can manage media_assets"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Admin-All Policies — Private Tables (no anon read)
-- =============================================================================

CREATE POLICY "admins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage contacts"
  ON public.contacts FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage leads"
  ON public.leads FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage chat_visitors"
  ON public.chat_visitors FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage chat_conversations"
  ON public.chat_conversations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage chat_messages"
  ON public.chat_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage chat_assignments"
  ON public.chat_assignments FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage chat_internal_notes"
  ON public.chat_internal_notes FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage conversation_events"
  ON public.conversation_events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage chatbot_knowledge"
  ON public.chatbot_knowledge FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage email_events"
  ON public.email_events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admins can manage audit_logs"
  ON public.audit_logs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =============================================================================
-- Anonymous INSERT Policy — Leads (restricted columns)
-- =============================================================================

CREATE POLICY "anon can insert leads"
  ON public.leads FOR INSERT
  TO anon
  WITH CHECK (
    status = 'new'
    AND assigned_to IS NULL
    AND internal_notes IS NULL
  );

-- =============================================================================
-- Rollback
-- =============================================================================
-- To rollback this migration, run:
-- DROP POLICY IF EXISTS "anon can insert leads" ON public.leads;
-- DROP POLICY IF EXISTS "admins can manage audit_logs" ON public.audit_logs;
-- DROP POLICY IF EXISTS "admins can manage email_events" ON public.email_events;
-- DROP POLICY IF EXISTS "admins can manage chatbot_knowledge" ON public.chatbot_knowledge;
-- DROP POLICY IF EXISTS "admins can manage conversation_events" ON public.conversation_events;
-- DROP POLICY IF EXISTS "admins can manage chat_internal_notes" ON public.chat_internal_notes;
-- DROP POLICY IF EXISTS "admins can manage chat_assignments" ON public.chat_assignments;
-- DROP POLICY IF EXISTS "admins can manage chat_messages" ON public.chat_messages;
-- DROP POLICY IF EXISTS "admins can manage chat_conversations" ON public.chat_conversations;
-- DROP POLICY IF EXISTS "admins can manage chat_visitors" ON public.chat_visitors;
-- DROP POLICY IF EXISTS "admins can manage leads" ON public.leads;
-- DROP POLICY IF EXISTS "admins can manage contacts" ON public.contacts;
-- DROP POLICY IF EXISTS "admins can manage admin_users" ON public.admin_users;
-- DROP POLICY IF EXISTS "admins can manage media_assets" ON public.media_assets;
-- DROP POLICY IF EXISTS "admins can manage footer_links" ON public.footer_links;
-- DROP POLICY IF EXISTS "admins can manage footer_groups" ON public.footer_groups;
-- DROP POLICY IF EXISTS "admins can manage navigation_items" ON public.navigation_items;
-- DROP POLICY IF EXISTS "admins can manage ai_faq_settings" ON public.ai_faq_settings;
-- DROP POLICY IF EXISTS "admins can manage chatbot_settings" ON public.chatbot_settings;
-- DROP POLICY IF EXISTS "admins can manage final_cta" ON public.final_cta;
-- DROP POLICY IF EXISTS "admins can manage acquisition_section" ON public.acquisition_section;
-- DROP POLICY IF EXISTS "admins can manage why_choose_us" ON public.why_choose_us;
-- DROP POLICY IF EXISTS "admins can manage hero" ON public.hero;
-- DROP POLICY IF EXISTS "admins can manage announcement_bar" ON public.announcement_bar;
-- DROP POLICY IF EXISTS "admins can manage site_settings" ON public.site_settings;
-- DROP POLICY IF EXISTS "admins can manage process_steps" ON public.process_steps;
-- DROP POLICY IF EXISTS "admins can manage trusted_logos" ON public.trusted_logos;
-- DROP POLICY IF EXISTS "admins can manage faqs" ON public.faqs;
-- DROP POLICY IF EXISTS "admins can manage pricing_plans" ON public.pricing_plans;
-- DROP POLICY IF EXISTS "admins can manage testimonials" ON public.testimonials;
-- DROP POLICY IF EXISTS "admins can manage insights" ON public.insights;
-- DROP POLICY IF EXISTS "admins can manage insight_categories" ON public.insight_categories;
-- DROP POLICY IF EXISTS "admins can manage portfolio_media" ON public.portfolio_media;
-- DROP POLICY IF EXISTS "admins can manage portfolio_projects" ON public.portfolio_projects;
-- DROP POLICY IF EXISTS "admins can manage services" ON public.services;
-- DROP POLICY IF EXISTS "public can read ai_eligible chatbot_knowledge" ON public.chatbot_knowledge;
-- DROP POLICY IF EXISTS "public can read public media_assets" ON public.media_assets;
-- DROP POLICY IF EXISTS "public can read visible footer_links" ON public.footer_links;
-- DROP POLICY IF EXISTS "public can read visible footer_groups" ON public.footer_groups;
-- DROP POLICY IF EXISTS "public can read visible navigation_items" ON public.navigation_items;
-- DROP POLICY IF EXISTS "public can read site_settings" ON public.site_settings;
-- DROP POLICY IF EXISTS "public can read enabled announcement_bar" ON public.announcement_bar;
-- DROP POLICY IF EXISTS "public can read visible final_cta" ON public.final_cta;
-- DROP POLICY IF EXISTS "public can read visible acquisition_section" ON public.acquisition_section;
-- DROP POLICY IF EXISTS "public can read visible why_choose_us" ON public.why_choose_us;
-- DROP POLICY IF EXISTS "public can read visible hero" ON public.hero;
-- DROP POLICY IF EXISTS "public can read visible process_steps" ON public.process_steps;
-- DROP POLICY IF EXISTS "public can read visible trusted_logos" ON public.trusted_logos;
-- DROP POLICY IF EXISTS "public can read published faqs" ON public.faqs;
-- DROP POLICY IF EXISTS "public can read published pricing_plans" ON public.pricing_plans;
-- DROP POLICY IF EXISTS "public can read visible testimonials" ON public.testimonials;
-- DROP POLICY IF EXISTS "public can read published insights" ON public.insights;
-- DROP POLICY IF EXISTS "public can read published portfolio_projects" ON public.portfolio_projects;
-- DROP POLICY IF EXISTS "public can read published services" ON public.services;
