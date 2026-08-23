-- =============================================================================
-- Description: Adds `brand_story_translations` to portfolio_projects so brand
--              design case studies can explain the thinking behind the mark
--              (the logo concept / monogram rationale, e.g. why the icon is
--              what it is). Shown on the public /work/[slug] page in the
--              "Why This Mark" section of brand case studies. Falls back to
--              the solution text when empty.
-- Stratifit Digital Agency Platform
-- =============================================================================

ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS brand_story_translations jsonb;

COMMENT ON COLUMN public.portfolio_projects.brand_story_translations
  IS 'Multilingual logo concept / monogram rationale for brand case studies. Rendered as the "Why This Mark" section on the public page.';

-- Backfill the CLENQO brand case study (the C + Q monogram concept).
UPDATE public.portfolio_projects
SET brand_story_translations = '{"en":"The mark unites the C and Q of CLENQO into a single confident gesture: the C opens the symbol like a clean sweep, the Q closes it with a sharp, deliberate check. One shape, readable at a glance — on a service vehicle, a uniform, or a phone screen.","de":"Das Zeichen vereint das C und das Q von CLENQO zu einer einzigen, selbstbewussten Geste: Das C öffnet das Symbol wie ein sauberer Schwung, das Q schließt es mit einem scharfen, bewussten Haken. Eine Form, auf den ersten Blick lesbar – auf dem Fahrzeug, der Uniform oder dem Smartphone.","fr":"Le signe réunit le C et le Q de CLENQO en un seul geste affirmé : le C ouvre le symbole d''un trait net, le Q le referme d''une coche franche et délibérée. Une forme, lisible au premier coup d''œil — sur un véhicule de service, un uniforme ou un écran de téléphone.","es":"El símbolo une la C y la Q de CLENQO en un solo gesto seguro: la C abre el símbolo con un trazo limpio, la Q lo cierra con una marca nítida y decidida. Una sola forma, legible de un vistazo — en un vehículo de servicio, un uniforme o una pantalla de móvil."}'
WHERE slug = 'aura-cosmetics-identity';

-- =============================================================================
-- Rollback
-- =============================================================================
-- ALTER TABLE public.portfolio_projects DROP COLUMN IF EXISTS brand_story_translations;
