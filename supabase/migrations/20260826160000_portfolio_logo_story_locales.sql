-- Migration: 20260826160000_portfolio_logo_story_locales
-- Description: Backfills the CLENQO Logo System (brand story) description for
--              the de/fr/es locales, which previously held an unrelated
--              monogram-concept narrative instead of the approved Logo System
--              copy. The en value (set by 20260826150000) is unchanged so all
--              four locales now carry the same approved deliverable wording.
--              Locale values in this column are plain JSON strings.
-- Stratifit Digital Agency Platform

UPDATE public.portfolio_projects
SET brand_story_translations =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            COALESCE(brand_story_translations, '{}'::jsonb),
            '{de}',
            to_jsonb('Eine selbstbewusste, skalierbare Marke entwickeln, die die Professionalität von CLENQO und dessen ökologisch ausgerichtete Werte widerspiegelt. Das Logosystem umfasst primäre, sekundäre und kompakte Varianten, um Konsistenz über digitale und physische Touchpoints hinweg sicherzustellen.'::text),
            true
          ),
          '{fr}',
          to_jsonb('Développer un symbole confiant et évolutif qui reflète le professionnalisme de CLENQO et ses valeurs éco‑responsables. Le système de logo comprend des déclinaisons primaires, secondaires et compactes afin de garantir la cohérence sur les points de contact numériques et physiques.'::text),
          true
        ),
        '{es}',
        to_jsonb('Desarrollar un símbolo seguro y escalable que refleje el profesionalismo y los valores ecológicos de CLENQO. El sistema de logotipo incluye variaciones principales, secundarias y compactas para garantizar la coherencia en los puntos de contacto digitales y físicos.'::text),
        true
      )
WHERE slug = 'aura-cosmetics-identity';

-- Rollback note: the replaced de/fr/es values were the monogram-concept
-- narrative ("Das Zeichen vereint das C und das Q…" / "Le signe réunit…"
-- / "El símbolo une la C y la Q…"); they remain recoverable via git history
-- of this repository or by re-querying the row before any inverse update.
