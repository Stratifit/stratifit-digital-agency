-- Migration: 20260826150000_case_study_system_launch_copy
-- Description: Applies the approved CLENQO case-study copy rework — the
--              Visual Identity System intro, refreshed Logo System /
--              Typography / palette / Visual Applications descriptions, and
--              single-line Launch headlines so "Digital Presence", "Physical
--              Touchpoints" and "Brand Guidelines" render as their own titled
--              blocks. Per-locale JSONB merges preserve every other field.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET brand_story_translations = jsonb_set(
  COALESCE(brand_story_translations, '{}'::jsonb),
  '{en}',
  to_jsonb('Develop a confident, scalable mark that reflects CLENQO’s professionalism and eco‑focused values. The logo system includes primary, secondary, and compact variations to ensure consistency across digital and physical touchpoints.'::text),
  true
)
WHERE slug = 'aura-cosmetics-identity';

UPDATE public.portfolio_projects
SET brand_system_translations = (
  SELECT jsonb_object_agg(
    locale,
    COALESCE(brand_system_translations -> locale, '{}'::jsonb)
      || jsonb_build_object(
        'build_description', v.build_description,
        'typeface_description', v.typeface_description,
        'palette_description', v.palette_description,
        'visual_applications', v.visual_applications
      )
  )
  FROM (VALUES
    (
      'en',
      'A refined identity system that transforms CLENQO’s strategic direction into clear, consistent, and scalable visual assets across every brand expression.',
      'A modern grotesque system tuned for clarity, professionalism, and high‑visibility service environments.',
      'Introduce a refined palette built around clean neutrals and eco‑driven accents. The colors reinforce trust, clarity, and sustainability while improving contrast and accessibility across all brand touchpoints.',
      'Apply the identity system across real‑world touchpoints — business cards, uniforms, vehicles, digital interfaces, and service communications — demonstrating how the brand comes to life in practical scenarios.'
    ),
    (
      'de',
      'Ein ausgefeiltes Identitätssystem, das die strategische Ausrichtung von CLENQO in klare, konsistente und skalierbare visuelle Assets über jeden Markenausdruck hinweg übersetzt.',
      'Ein modernes Grotesk-System auf Klarheit, Professionalität und hochsichtbare Serviceumgebungen abgestimmt.',
      'Führen Sie eine ausgefeilte Palette rund um neutrale Farbtöne und ökologisch geprägte Akzente ein. Die Farben stärken Vertrauen, Klarheit und Nachhaltigkeit bei verbesserter Kontrast- und Barrierefreiheit über alle Markenkontaktpunkte hinweg.',
      'Wenden Sie das Identitätssystem auf reale Kontaktpunkte an — Visitenkarten, Uniformen, Fahrzeuge, digitale Schnittstellen und Service­kommunikation — und zeigen Sie, wie die Marke in praktischen Szenarien zum Leben erwacht.'
    ),
    (
      'fr',
      'Un système d’identité raffiné qui traduit l’orientation stratégique de CLENQO en actifs visuels clairs, cohérents et évolutifs à chaque expression de la marque.',
      'Un système grotesque moderne ajusté pour la clarté, le professionnalisme et les environnements de service à forte visibilité.',
      'Présentez une palette raffinée construite autour de neutres épurés et d’accents éco-responsables. Les couleurs renforcent la confiance, la clarté et la durabilité tout en améliorant le contraste et l’accessibilité sur tous les points de contact de la marque.',
      'Appliquez le système d’identité aux points de contact réels — cartes de visite, uniformes, véhicules, interfaces numériques et communications de service — démontrant comment la marque prend vie dans des scénarios pratiques.'
    ),
    (
      'es',
      'Un sistema de identidad refinado que transforma la dirección estratégica de CLENQO en recursos visuales claros, consistentes y escalables en cada expresión de la marca.',
      'Un sistema grotesco moderno afinado para la claridad, el profesionalismo y los entornos de servicio de alta visibilidad.',
      'Presenta una paleta refinada construida sobre neutros limpios y acentos ecológicos. Los colores refuerzan la confianza, la claridad y la sostenibilidad mientras mejoran el contraste y la accesibilidad en todos los puntos de contacto de la marca.',
      'Aplique el sistema de identidad a puntos de contacto reales — tarjetas de presentación, uniformes, vehículos, interfaces digitales y comunicaciones de servicio — demostrando cómo la marca cobra vida en escenarios prácticos.'
    )
  ) AS v(locale, build_description, typeface_description, palette_description, visual_applications)
)
WHERE slug = 'aura-cosmetics-identity';

UPDATE public.portfolio_projects
SET launch_translations = (
  SELECT jsonb_object_agg(
    locale,
    COALESCE(launch_translations -> locale, '{}'::jsonb)
      || jsonb_build_object('headline', v.headline)
  )
  FROM (VALUES
    ('en', 'Real-world rollout & activation'),
    ('de', 'Rollout & Aktivierung in der Praxis'),
    ('fr', 'Déploiement réel et activation'),
    ('es', 'Despliegue real y activación')
  ) AS v(locale, headline)
)
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.portfolio_projects
-- SET brand_story_translations = jsonb_set(
--   COALESCE(brand_story_translations, '{}'::jsonb),
--   '{en}',
--   to_jsonb('Develop a confident, scalable mark that reflects CLENQO’s professionalism and eco‑focused values. The logo system includes primary, secondary, and compact variations to ensure consistency across digital and physical applications.'::text),
--   true
-- )
-- WHERE slug = 'aura-cosmetics-identity';
