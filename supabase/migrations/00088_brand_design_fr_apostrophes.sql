-- Migration: 00088_brand_design_fr_apostrophes
-- Description: Normalise French apostrophes to the typographic form (U+2019) in
--              the brand-design service page content, matching the approved
--              master copy convention. Applies only to "fr" string values
--              inside the JSONB columns, so English/German/Spanish are untouched.
-- Stratifit Digital Agency Platform

CREATE OR REPLACE FUNCTION public._migrate_fr_apostrophes(v jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb := v;
  key text;
  item jsonb;
  idx int;
BEGIN
  IF jsonb_typeof(v) = 'object' THEN
    FOR key, item IN SELECT * FROM jsonb_each(v) LOOP
      IF key = 'fr' AND jsonb_typeof(item) = 'string' THEN
        result := jsonb_set(result, ARRAY[key], to_jsonb(replace(item #>> '{}', chr(39), chr(8217))));
      ELSIF jsonb_typeof(item) IN ('object', 'array') THEN
        result := jsonb_set(result, ARRAY[key], public._migrate_fr_apostrophes(item));
      END IF;
    END LOOP;
  ELSIF jsonb_typeof(v) = 'array' THEN
    FOR idx IN 0..jsonb_array_length(v) - 1 LOOP
      result := jsonb_set(result, ARRAY[idx::text], public._migrate_fr_apostrophes(v -> idx));
    END LOOP;
  END IF;
  RETURN result;
END;
$$;

UPDATE public.service_pages
SET
  hero_eyebrow_translations        = public._migrate_fr_apostrophes(hero_eyebrow_translations),
  hero_title_translations          = public._migrate_fr_apostrophes(hero_title_translations),
  hero_highlight_translations      = public._migrate_fr_apostrophes(hero_highlight_translations),
  hero_description_translations    = public._migrate_fr_apostrophes(hero_description_translations),
  hero_stats                       = public._migrate_fr_apostrophes(hero_stats),
  why_title_translations           = public._migrate_fr_apostrophes(why_title_translations),
  why_description_translations     = public._migrate_fr_apostrophes(why_description_translations),
  why_badges                       = public._migrate_fr_apostrophes(why_badges),
  capabilities_title_translations  = public._migrate_fr_apostrophes(capabilities_title_translations),
  capabilities_description_translations = public._migrate_fr_apostrophes(capabilities_description_translations),
  capabilities                     = public._migrate_fr_apostrophes(capabilities),
  deliverables_title_translations  = public._migrate_fr_apostrophes(deliverables_title_translations),
  deliverables                     = public._migrate_fr_apostrophes(deliverables),
  process_title_translations       = public._migrate_fr_apostrophes(process_title_translations),
  process                          = public._migrate_fr_apostrophes(process),
  toolkit_title_translations       = public._migrate_fr_apostrophes(toolkit_title_translations),
  toolkit                          = public._migrate_fr_apostrophes(toolkit),
  cta_title_translations           = public._migrate_fr_apostrophes(cta_title_translations),
  cta_subtitle_translations        = public._migrate_fr_apostrophes(cta_subtitle_translations),
  cta_button_label_translations    = public._migrate_fr_apostrophes(cta_button_label_translations)
WHERE slug = 'brand-design';

DROP FUNCTION public._migrate_fr_apostrophes(jsonb);
