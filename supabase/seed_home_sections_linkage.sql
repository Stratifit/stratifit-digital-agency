-- ============================================================================
-- Stratifit — Home Page Section Linkage Seed
-- Links the Services, How We Work, Why Us, and Insights dedicated sections to the home page.
-- Idempotent: safe to run multiple times.
-- Run this after seed_services_section.sql, seed_how_we_work_section.sql, seed_why_us_section.sql, and seed_insights_section.sql.
-- ============================================================================

do $$
declare
  v_page_id uuid;
begin
  -- Find the English home page
  select id into v_page_id
  from pages
  where slug = 'home' and language = 'en'
  limit 1;

  if v_page_id is null then
    raise notice 'Home page not found. Skipping section linkage.';
    return;
  end if;

  -- Link Services Section
  if not exists (
    select 1 from sections
    where page_id = v_page_id and component_type = 'services'
  ) then
    insert into sections (page_id, component_type, display_order, payload)
    values (
      v_page_id,
      'services',
      1,
      '{"servicesSectionId": "b1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"}'::jsonb
    );
  end if;

  -- Link How We Work Section
  if not exists (
    select 1 from sections
    where page_id = v_page_id and component_type = 'how_we_work'
  ) then
    insert into sections (page_id, component_type, display_order, payload)
    values (
      v_page_id,
      'how_we_work',
      2,
      '{"howWeWorkSectionId": "c1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"}'::jsonb
    );
  end if;

  -- Link Why Us Section (use display_order 6 to avoid collision with StatsSection=3, TestimonialsSection=4 and CtaSection=5 in seed.sql)
  if not exists (
    select 1 from sections
    where page_id = v_page_id and component_type = 'why_us'
  ) then
    insert into sections (page_id, component_type, display_order, payload)
    values (
      v_page_id,
      'why_us',
      6,
      '{"whyUsSectionId": "d1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"}'::jsonb
    );
  end if;

  -- Link Insights Section (use display_order 7 to avoid collision with CtaSection=5 in seed.sql)
  if not exists (
    select 1 from sections
    where page_id = v_page_id and component_type = 'insights'
  ) then
    insert into sections (page_id, component_type, display_order, payload)
    values (
      v_page_id,
      'insights',
      7,
      '{"insightsSectionId": "f1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"}'::jsonb
    );
  end if;

  -- Link Portfolio Section
  if not exists (
    select 1 from sections
    where page_id = v_page_id and component_type = 'portfolio'
  ) then
    insert into sections (page_id, component_type, display_order, payload)
    values (
      v_page_id,
      'portfolio',
      8,
      '{"portfolioSectionId": "g1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"}'::jsonb
    );
  end if;
end $$;
