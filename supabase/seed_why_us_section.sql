-- ============================================================================
-- Stratifit — Why Us Section Seed Data
-- Inserts one Why Us section with 4 feature cards.
-- Run this after the why_us_section migration has been applied.
-- ============================================================================

-- Fixed section ID so this seed file is idempotent
DO $$
DECLARE
  v_section_id uuid := 'd1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'::uuid;
BEGIN
  -- Insert / update the Why Us section
  INSERT INTO why_us_section (id, display_order, subtitle_translations, title_translations, description_translations)
  VALUES (
    v_section_id,
    3,
    '{"en":"Why Us","fr":"Pourquoi Nous","de":"Warum Wir","es":"Por Qué Nosotros"}'::jsonb,
    '{"en":"Not Just Another Agency","fr":"Pas Juste Une Autre Agence","de":"Nicht Nur Eine Andere Agentur","es":"No Solo Otra Agencia"}'::jsonb,
    '{"en":"We build digital assets that drive valuation and market authority — not just websites.","fr":"Nous créons des actifs numériques qui augmentent la valorisation et l\'autorité du marché — pas seulement des sites web.","de":"Wir entwickeln digitale Assets, die Bewertung und Marktautorität steigern – nicht nur Websites.","es":"Creamos activos digitales que impulsan la valoración y la autoridad del mercado, no solo sitios web."}'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    display_order = EXCLUDED.display_order,
    subtitle_translations = EXCLUDED.subtitle_translations,
    title_translations = EXCLUDED.title_translations,
    description_translations = EXCLUDED.description_translations,
    updated_at = NOW();

  -- Delete existing features for this section to avoid duplicates on re-runs
  DELETE FROM why_us_features WHERE parent_section = v_section_id;

  -- Insert feature cards
  INSERT INTO why_us_features (
    id,
    parent_section,
    icon,
    title_translations,
    description_translations,
    stat,
    stat_label_translations,
    display_order,
    active
  )
  VALUES
    (
      'e1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'::uuid,
      v_section_id,
      'shield',
      '{"en":"Senior-only team","fr":"Équipe senior","de":"Nur Senior-Team","es":"Equipo solo senior"}'::jsonb,
      '{"en":"Every person shipping work has 7+ years of production experience.","fr":"Chaque personne qui livre du travail a plus de 7 ans d\'expérience en production.","de":"Jede Person, die Arbeit ausliefert, hat mehr als 7 Jahre Produktionserfahrung.","es":"Cada persona que entrega trabajo tiene más de 7 años de experiencia en producción."}'::jsonb,
      '50+',
      '{"en":"Shipped projects","fr":"Projets livrés","de":"Ausgelieferte Projekte","es":"Proyectos entregados"}'::jsonb,
      0,
      TRUE
    ),
    (
      'e2b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'::uuid,
      v_section_id,
      'shield',
      '{"en":"Outcome-priced","fr":"Prix basé sur les résultats","de":"Ergebnisbasierte Preisgestaltung","es":"Precios basados en resultados"}'::jsonb,
      '{"en":"We price on shipped value, not hours logged.","fr":"Nous facturons selon la valeur livrée, pas les heures facturées.","de":"Wir berechnen nach geliefertem Wert, nicht nach Stunden.","es":"Cobramos por el valor entregado, no por las horas registradas."}'::jsonb,
      '98%',
      '{"en":"Client retention","fr":"Rétention client","de":"Kundenbindung","es":"Retención de clientes"}'::jsonb,
      1,
      TRUE
    ),
    (
      'e3b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'::uuid,
      v_section_id,
      'shield',
      '{"en":"Async-first","fr":"Async-first","de":"Async-First","es":"Async-first"}'::jsonb,
      '{"en":"Tight spec docs, recorded Looms, weekly demos — never a status meeting.","fr":"Documents de spécification précis, Looms enregistrés, démos hebdomadaires — jamais de réunion de statut.","de":"Präzise Spezifikationsdokumente, aufgezeichnete Looms, wöchentliche Demos – nie ein Statusmeeting.","es":"Documentos de especificaciones precisos, Looms grabados, demostraciones semanales, nunca una reunión de estado."}'::jsonb,
      '12',
      '{"en":"Years experience","fr":"Années d\'expérience","de":"Jahre Erfahrung","es":"Años de experiencia"}'::jsonb,
      2,
      TRUE
    ),
    (
      'e4b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e'::uuid,
      v_section_id,
      'shield',
      '{"en":"Full-stack","fr":"Full-stack","de":"Full-Stack","es":"Full-stack"}'::jsonb,
      '{"en":"Brand, engineering, and growth in one team.","fr":"Marque, ingénierie et croissance dans une seule équipe.","de":"Marke, Engineering und Wachstum in einem Team.","es":"Marca, ingeniería y crecimiento en un solo equipo."}'::jsonb,
      '40+',
      '{"en":"Country reach","fr":"Présence pays","de":"Länderreichweite","es":"Alcance país"}'::jsonb,
      3,
      TRUE
    );
END $$;
