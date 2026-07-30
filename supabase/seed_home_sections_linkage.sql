-- ============================================================================
-- Stratifit — Home Page Section Linkage Seed
-- Links the Services and How We Work dedicated sections to the home page.
-- Idempotent: safe to run multiple times.
-- Run this after seed_services_section.sql and seed_how_we_work_section.sql.
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
end $$;
