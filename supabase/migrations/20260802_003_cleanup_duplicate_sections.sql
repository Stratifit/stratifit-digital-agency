-- ============================================================================
-- Stratifit — Cleanup duplicate and legacy section rows
-- Fixes cases where seed.sql and seed_home_sections_linkage.sql both created
-- a generic `sections` row for the same dedicated section.
-- ============================================================================

-- Remove legacy component_type values that may have been created by older seeds.
DELETE FROM sections WHERE component_type = 'ServicesSection';

-- Keep only the oldest row for each (page_id, component_type) pair among
-- the dedicated sections, so no dedicated section is rendered twice.
DELETE FROM sections
WHERE id NOT IN (
    SELECT MIN(id)
    FROM sections
    WHERE component_type IN ('services', 'how_we_work', 'why_us', 'insights')
    GROUP BY page_id, component_type
);
