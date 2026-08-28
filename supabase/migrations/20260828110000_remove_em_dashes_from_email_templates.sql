-- Remove em-dash separators from email template copy.
-- This migration intentionally leaves placeholders such as {{project_name}} intact.
UPDATE public.email_templates
SET
  subject_translations = (
    SELECT jsonb_object_agg(key, regexp_replace(value, '\s*[—–]\s*', ': ', 'g'))
    FROM jsonb_each_text(subject_translations)
  ),
  body_translations = (
    SELECT jsonb_object_agg(key, regexp_replace(value, '\s*[—–]\s*', ', ', 'g'))
    FROM jsonb_each_text(body_translations)
  )
WHERE subject_translations::text ~ '[—–]'
   OR body_translations::text ~ '[—–]';
