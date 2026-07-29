-- =============================================================================
-- Stratifit Digital Agency — Initial Schema Migration
-- Version: 20260729_001
-- Description: Establishes core CMS tables: pages, sections, content_blocks,
--              media, navigation, translations, settings, ai_logs, audit_logs.
--              Includes FKs, ON DELETE CASCADE, indexes, RLS policies, and
--              automated updated_at triggers.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- -----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 2. TRIGGER FUNCTION: refresh_updated_at()
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION refresh_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. TABLE: pages
-- -----------------------------------------------------------------------------
CREATE TABLE pages (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text        NOT NULL UNIQUE,
  title       text        NOT NULL,
  status      text        NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'published', 'archived')),
  meta_data   jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_pages_slug ON pages (slug);
CREATE INDEX idx_pages_status_slug ON pages (status, slug);

CREATE TRIGGER trg_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION refresh_updated_at();

-- -----------------------------------------------------------------------------
-- 4. TABLE: sections
-- -----------------------------------------------------------------------------
CREATE TABLE sections (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id           uuid        NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  component_type    text        NOT NULL,
  display_order     integer     NOT NULL DEFAULT 0,
  visibility        jsonb       NOT NULL DEFAULT '{"device": "all"}'::jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sections_page_order ON sections (page_id, display_order ASC);

CREATE TRIGGER trg_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION refresh_updated_at();

-- -----------------------------------------------------------------------------
-- 5. TABLE: content_blocks
-- -----------------------------------------------------------------------------
CREATE TABLE content_blocks (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id      uuid        NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  block_type      text        NOT NULL,
  data            jsonb       NOT NULL DEFAULT '{}'::jsonb,
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_blocks_section_order ON content_blocks (section_id, display_order ASC);

CREATE TRIGGER trg_content_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION refresh_updated_at();

-- -----------------------------------------------------------------------------
-- 6. TABLE: media
-- -----------------------------------------------------------------------------
CREATE TABLE media (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path  text        NOT NULL UNIQUE,
  public_url    text        NOT NULL,
  alt_text      text        NOT NULL DEFAULT '',
  mime_type     text        NOT NULL,
  dimensions    jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 7. TABLE: navigation
-- -----------------------------------------------------------------------------
CREATE TABLE navigation (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id         uuid        REFERENCES pages(id) ON DELETE SET NULL,
  label           text        NOT NULL,
  target_url      text        NOT NULL,
  menu_type       text        NOT NULL DEFAULT 'header'
                              CHECK (menu_type IN ('header', 'footer', 'sidebar')),
  display_order   integer     NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_navigation_menu_type ON navigation (menu_type, display_order ASC);

-- -----------------------------------------------------------------------------
-- 8. TABLE: translations
-- -----------------------------------------------------------------------------
CREATE TABLE translations (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type        text        NOT NULL
                       CHECK (entity_type IN ('pages', 'sections', 'content_blocks')),
  entity_id          uuid        NOT NULL,
  locale             text        NOT NULL
                       CHECK (locale IN ('en', 'de')),
  translated_fields  jsonb       NOT NULL,
  updated_at         timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_translation_entity_locale
    UNIQUE (entity_type, entity_id, locale)
);

CREATE INDEX idx_translations_entity
  ON translations (entity_type, entity_id, locale);

CREATE TRIGGER trg_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION refresh_updated_at();

-- -----------------------------------------------------------------------------
-- 9. TABLE: settings
-- -----------------------------------------------------------------------------
CREATE TABLE settings (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text        NOT NULL UNIQUE,
  value       jsonb       NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION refresh_updated_at();

-- -----------------------------------------------------------------------------
-- 10. TABLE: ai_logs
-- -----------------------------------------------------------------------------
CREATE TABLE ai_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_role      text        NOT NULL,
  action          text        NOT NULL,
  input_payload   jsonb       NOT NULL,
  output_payload  jsonb       NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_logs_created ON ai_logs (created_at DESC);

-- -----------------------------------------------------------------------------
-- 11. TABLE: audit_logs
-- -----------------------------------------------------------------------------
CREATE TABLE audit_logs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  target_table    text        NOT NULL,
  record_id       uuid        NOT NULL,
  operation       text        NOT NULL
                    CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  user_id         uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  previous_data   jsonb,
  new_data        jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs (target_table, record_id);

-- -----------------------------------------------------------------------------
-- 12. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
ALTER TABLE pages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections       ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE media          ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation     ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs     ENABLE ROW LEVEL SECURITY;

-- 12a. Public read policies — only published content
CREATE POLICY "Public Read Published Pages" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public Read Sections" ON sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = sections.page_id AND pages.status = 'published'
    )
  );

CREATE POLICY "Public Read Content Blocks" ON content_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sections
      JOIN pages ON pages.id = sections.page_id
      WHERE sections.id = content_blocks.section_id AND pages.status = 'published'
    )
  );

CREATE POLICY "Public Read Media" ON media
  FOR SELECT USING (true);

CREATE POLICY "Public Read Navigation" ON navigation
  FOR SELECT USING (true);

CREATE POLICY "Public Read Settings" ON settings
  FOR SELECT USING (true);

-- 12b. Admin full-access policies
CREATE POLICY "Admin Full Access Pages" ON pages
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin Full Access Sections" ON sections
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin Full Access Content Blocks" ON content_blocks
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin Full Access Media" ON media
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin Full Access Navigation" ON navigation
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin Full Access Translations" ON translations
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

CREATE POLICY "Admin Full Access Settings" ON settings
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- 12c. Service-role policies for AI logs and audit logs
CREATE POLICY "Service Role All AI Logs" ON ai_logs
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

CREATE POLICY "Service Role All Audit Logs" ON audit_logs
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'role') = 'service_role')
  WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- -----------------------------------------------------------------------------
-- 13. DEFAULT SETTINGS
-- -----------------------------------------------------------------------------
INSERT INTO settings (key, value) VALUES
  ('site_name',       '"Stratifit"'),
  ('site_description','"Digital Agency — Brand Strategy, Web Development & AI Automation"'),
  ('default_locale',  '"en"'),
  ('supported_locales', '["en", "de"]'),
  ('social_links',    '{"github": "https://github.com/stratifit", "twitter": "https://x.com/stratifit"}');
