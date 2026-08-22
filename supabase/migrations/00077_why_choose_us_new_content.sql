-- Migration: 00077_why_choose_us_new_content
-- Description: Replaces the Why Choose Us section header and the four feature
--              cards (title, description, stat value, stat label) with the
--              approved copy in all four locales. Icons and visibility flags
--              are left untouched.
-- Stratifit Digital Agency Platform

-- =============================================================================
-- Section header (section_settings)
-- =============================================================================

UPDATE public.section_settings SET
  eyebrow_translations = '{"en": "Why Us", "de": "Warum wir", "fr": "Pourquoi nous choisir", "es": "Por qué elegirnos"}'::jsonb,
  title_translations = '{"en": "Not Just Another", "de": "Mehr als eine", "fr": "Pas une", "es": "No somos una"}'::jsonb,
  highlight_translations = '{"en": "Agency", "de": "Agentur", "fr": "agence comme les autres", "es": "agencia más"}'::jsonb,
  description_translations = '{"en": "We build strategic digital assets that strengthen your market position and create lasting business value.", "de": "Wir entwickeln strategische digitale Lösungen, die Ihre Marktposition stärken und nachhaltigen Unternehmenswert schaffen.", "fr": "Nous créons des actifs numériques stratégiques qui renforcent votre position sur le marché et génèrent une valeur durable pour votre entreprise.", "es": "Creamos activos digitales estratégicos que refuerzan su posición en el mercado y generan valor empresarial duradero."}'::jsonb
WHERE section_key = 'why-choose-us';

-- =============================================================================
-- Singleton row (why_choose_us)
-- =============================================================================

UPDATE public.why_choose_us SET
  title_translations = '{"en": "Not Just Another Agency", "de": "Mehr als eine Agentur", "fr": "Pas une agence comme les autres", "es": "No somos una agencia más"}'::jsonb,
  description_translations = '{"en": "We build strategic digital assets that strengthen your market position and create lasting business value.", "de": "Wir entwickeln strategische digitale Lösungen, die Ihre Marktposition stärken und nachhaltigen Unternehmenswert schaffen.", "fr": "Nous créons des actifs numériques stratégiques qui renforcent votre position sur le marché et génèrent une valeur durable pour votre entreprise.", "es": "Creamos activos digitales estratégicos que refuerzan su posición en el mercado y generan valor empresarial duradero."}'::jsonb,
  items = '[
    {
      "icon": "shield",
      "title": {"en": "Senior Team", "de": "Erfahrenes Expertenteam", "fr": "Équipe expérimentée", "es": "Equipo experimentado"},
      "description": {"en": "Every specialist working on your project brings at least seven years of professional experience.", "de": "Jeder Spezialist in Ihrem Projekt verfügt über mindestens sieben Jahre Berufserfahrung.", "fr": "Chaque spécialiste impliqué dans votre projet possède au moins sept ans d''expérience professionnelle.", "es": "Cada especialista que participa en su proyecto cuenta con al menos siete años de experiencia profesional."},
      "stat_value": "12+",
      "stat_label": {"en": "Years of experience", "de": "Jahre Erfahrung", "fr": "Années d''expérience", "es": "Años de experiencia"}
    },
    {
      "icon": "check",
      "title": {"en": "Pricing Based on Value", "de": "Wertorientierte Preisgestaltung", "fr": "Tarification fondée sur la valeur", "es": "Precios basados en el valor"},
      "description": {"en": "Our pricing reflects the value and scope of the work, not the number of hours logged.", "de": "Unsere Preise richten sich nach dem Wert und Umfang der Leistung, nicht nach der Anzahl erfasster Stunden.", "fr": "Nos tarifs reflètent la valeur et l''étendue du travail réalisé, plutôt que le nombre d''heures comptabilisées.", "es": "Nuestros precios reflejan el valor y el alcance del trabajo, no la cantidad de horas registradas."},
      "stat_value": "98%",
      "stat_label": {"en": "Client retention", "de": "Kundenbindung", "fr": "Fidélisation des clients", "es": "Retención de clientes"}
    },
    {
      "icon": "bolt",
      "title": {"en": "Focused Collaboration", "de": "Effiziente Zusammenarbeit", "fr": "Collaboration efficace", "es": "Colaboración eficiente"},
      "description": {"en": "Clear documentation, recorded updates, and weekly demos keep every project moving without unnecessary meetings.", "de": "Klare Dokumentation, aufgezeichnete Updates und wöchentliche Demos halten jedes Projekt ohne unnötige Statusmeetings auf Kurs.", "fr": "Une documentation claire, des mises à jour enregistrées et des démonstrations hebdomadaires permettent à chaque projet d''avancer sans réunions inutiles.", "es": "Una documentación clara, actualizaciones grabadas y demostraciones semanales mantienen cada proyecto en marcha sin reuniones innecesarias."},
      "stat_value": "50+",
      "stat_label": {"en": "Projects delivered", "de": "Realisierte Projekte", "fr": "Projets réalisés", "es": "Proyectos entregados"}
    },
    {
      "icon": "users",
      "title": {"en": "Integrated Expertise", "de": "Integrierte Expertise", "fr": "Expertise intégrée", "es": "Experiencia integrada"},
      "description": {"en": "Brand, engineering, AI, and growth expertise in one coordinated team.", "de": "Marke, Entwicklung, KI und Wachstumskompetenz in einem koordinierten Team.", "fr": "La marque, l''ingénierie, l''IA et la croissance sont réunies au sein d''une équipe coordonnée.", "es": "Marca, ingeniería, IA y crecimiento reunidos en un único equipo coordinado."},
      "stat_value": "40+",
      "stat_label": {"en": "Countries reached", "de": "Erreichte Länder", "fr": "Pays couverts", "es": "Países alcanzados"}
    }
  ]'::jsonb
WHERE singleton_key = true;

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.section_settings SET
--   eyebrow_translations = '{"en": "Why Us", "de": "Warum wir", "fr": "Pourquoi nous", "es": "Por qué nosotros"}'::jsonb,
--   title_translations = '{"en": "Not Just Another", "de": "Nicht nur eine weitere", "fr": "Pas juste une autre", "es": "No solo otra"}'::jsonb,
--   highlight_translations = '{"en": "Agency", "de": "Agentur", "fr": "agence", "es": "agencia"}'::jsonb,
--   description_translations = '{"en": "We build digital assets that drive valuation and market authority, not just websites.", "de": "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern, nicht nur Websites.", "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché, pas seulement des sites web.", "es": "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb
-- WHERE section_key = 'why-choose-us';
-- UPDATE public.why_choose_us SET
--   title_translations = '{"en": "Not Just Another Agency", "de": "Nicht nur eine weitere Agentur", "fr": "Pas juste une autre agence", "es": "No solo otra agencia"}'::jsonb,
--   description_translations = '{"en": "We build digital assets that drive valuation and market authority, not just websites.", "de": "Wir bauen digitale Assets, die Bewertung und Marktautorität steigern, nicht nur Websites.", "fr": "Nous créons des actifs numériques qui augmentent la valorisation et l''autorité de marché, pas seulement des sites web.", "es": "Creamos activos digitales que impulsan la valoración y la autoridad de mercado, no solo sitios web."}'::jsonb
-- WHERE singleton_key = true;
