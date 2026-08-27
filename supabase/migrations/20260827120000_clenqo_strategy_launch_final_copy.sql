-- Migration: 20260827120000_clenqo_strategy_launch_final_copy
-- Description: Applies the final approved CLENQO case-study copy rework —
--              the Launch headline renames to "Brand Rollout", the
--              duplicated Identity Direction description is replaced with
--              its own strategic-foundations copy, Messaging Direction gets
--              the expanded brand-voice copy, and Strategic Foundation gets
--              the core-principles subtitle. Per-locale JSONB merges preserve
--              every other field.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET strategy_translations = (
  SELECT jsonb_object_agg(
    locale,
    COALESCE(strategy_translations -> locale, '{}'::jsonb)
      || jsonb_build_object(
        'headline', v.headline,
        'subtitle', v.subtitle,
        'identity', v.identity,
        'messaging', v.messaging
      )
  )
  FROM (VALUES
    (
      'en',
      'Strategic Foundation',
      'Define the core principles that guide CLENQO’s positioning, communication, and visual behavior — establishing a clear foundation for every strategic and creative decision.',
      'Define the strategic foundations of CLENQO’s identity — clarifying how the brand should look, feel, and behave to ensure consistency across every touchpoint.',
      'Craft a clear, confident brand voice that communicates reliability, eco-awareness, and service excellence — removing ambiguity and strengthening how CLENQO speaks across all channels.'
    ),
    (
      'de',
      'Strategische Grundlage',
      'Definieren Sie die Kernprinzipien, die die Positionierung, Kommunikation und das visuelle Verhalten von CLENQO leiten — und schaffen Sie eine klare Grundlage für jede strategische und kreative Entscheidung.',
      'Definieren Sie die strategischen Grundlagen der Identität von CLENQO — und klären Sie, wie die Marke aussehen, sich anfühlen und auftreten soll, um Konsistenz über jeden Touchpoint hinweg sicherzustellen.',
      'Entwickeln Sie eine klare, selbstbewusste Markenstimme, die Zuverlässigkeit, Umweltbewusstsein und Service-Exzellenz kommuniziert — Mehrdeutigkeiten beseitigt und stärkt, wie CLENQO über alle Kanäle hinweg spricht.'
    ),
    (
      'fr',
      'Fondation stratégique',
      'Définissez les principes fondamentaux qui guident le positionnement, la communication et le comportement visuel de CLENQO — établissant une base claire pour chaque décision stratégique et créative.',
      'Définissez les fondements stratégiques de l’identité de CLENQO — et clarifiez comment la marque doit paraître, se ressentir et se comporter pour garantir la cohérence sur chaque point de contact.',
      'Forgez une voix de marque claire et confiante qui communique fiabilité, conscience écologique et excellence du service — levant toute ambiguïté et renforçant la manière dont CLENQO s’exprime sur tous les canaux.'
    ),
    (
      'es',
      'Fundamento estratégico',
      'Defina los principios fundamentales que guían el posicionamiento, la comunicación y el comportamiento visual de CLENQO — estableciendo una base clara para cada decisión estratégica y creativa.',
      'Defina los fundamentos estratégicos de la identidad de CLENQO — y aclare cómo debe verse, sentirse y comportarse la marca para garantizar coherencia en cada punto de contacto.',
      'Cree una voz de marca clara y segura que comunique confiabilidad, conciencia ecológica y excelencia en el servicio — eliminando la ambigüedad y fortaleciendo cómo habla CLENQO en todos los canales.'
    )
  ) AS v(locale, headline, subtitle, identity, messaging)
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
    ('en', 'Brand Rollout'),
    ('de', 'Brand Rollout'),
    ('fr', 'Brand Rollout'),
    ('es', 'Brand Rollout')
  ) AS v(locale, headline)
)
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- UPDATE public.portfolio_projects
-- SET launch_translations = (
--   SELECT jsonb_object_agg(
--     locale,
--     COALESCE(launch_translations -> locale, '{}'::jsonb)
--       || jsonb_build_object('headline', v.headline)
--   )
--   FROM (VALUES
--     ('en', 'Real-world rollout & activation'),
--     ('de', 'Rollout & Aktivierung in der Praxis'),
--     ('fr', 'Déploiement réel et activation'),
--     ('es', 'Despliegue real y activación')
--   ) AS v(locale, headline)
-- )
-- WHERE slug = 'aura-cosmetics-identity';
