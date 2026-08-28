-- Normalize dash separators in public marketing content.
-- Technical identifiers, URLs, slugs, and numeric ranges are intentionally not
-- modified. The public renderer also sanitizes content at display time.

create or replace function public._content_remove_dash_separators(value jsonb)
returns jsonb
language sql
immutable
as $$
  select case
    when jsonb_typeof(value) = 'object' then
      coalesce(
        (
          select jsonb_object_agg(key, public._content_remove_dash_separators(element))
          from jsonb_each(value) as kv(key, element)
        ),
        '{}'::jsonb
      )
    when jsonb_typeof(value) = 'array' then
      coalesce(
        (
          select jsonb_agg(public._content_remove_dash_separators(element))
          from jsonb_array_elements(value) as t(element)
        ),
        '[]'::jsonb
      )
    when jsonb_typeof(value) = 'string' then
      to_jsonb(regexp_replace(value #>> '{}', E'\\s*[—–]\\s*', ', ', 'g'))
    else
      value
  end
$$;

update public.section_settings
set description_translations = public._content_remove_dash_separators(description_translations),
    title_translations = public._content_remove_dash_separators(title_translations),
    highlight_translations = public._content_remove_dash_separators(highlight_translations)
where (description_translations || title_translations || highlight_translations)::text ~ '[—–]';

update public.services
set short_description_translations = public._content_remove_dash_separators(short_description_translations),
    full_description_translations = public._content_remove_dash_separators(full_description_translations)
where (short_description_translations || full_description_translations)::text ~ '[—–]';

update public.service_pages
set hero_title_translations = public._content_remove_dash_separators(hero_title_translations),
    hero_description_translations = public._content_remove_dash_separators(hero_description_translations),
    why_description_translations = public._content_remove_dash_separators(why_description_translations)
where (hero_title_translations || hero_description_translations || why_description_translations)::text ~ '[—–]';

update public.portfolio_projects
set title_translations = public._content_remove_dash_separators(title_translations),
    summary_translations = public._content_remove_dash_separators(summary_translations),
    brand_story_translations = public._content_remove_dash_separators(brand_story_translations),
    challenge_translations = public._content_remove_dash_separators(challenge_translations),
    solution_translations = public._content_remove_dash_separators(solution_translations),
    results_translations = public._content_remove_dash_separators(results_translations),
    strategy_translations = public._content_remove_dash_separators(strategy_translations),
    brand_system_translations = public._content_remove_dash_separators(brand_system_translations),
    launch_translations = public._content_remove_dash_separators(launch_translations)
where (title_translations || summary_translations || brand_story_translations || challenge_translations || solution_translations || results_translations || strategy_translations || brand_system_translations || launch_translations)::text ~ '[—–]';

update public.detail_pages
set eyebrow_translations = public._content_remove_dash_separators(eyebrow_translations),
    title_translations = public._content_remove_dash_separators(title_translations),
    description_translations = public._content_remove_dash_separators(description_translations),
    subtitle_translations = public._content_remove_dash_separators(subtitle_translations),
    content_translations = public._content_remove_dash_separators(content_translations)
where (eyebrow_translations || title_translations || description_translations || subtitle_translations || content_translations)::text ~ '[—–]';

drop function public._content_remove_dash_separators(jsonb);
