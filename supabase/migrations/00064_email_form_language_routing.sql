-- Migration: 00064_email_form_language_routing.sql
-- Description: Route contact-form submissions into the section matching the
--   visitor's language. The old unique constraint forced a 1:1 form-source →
--   section mapping, which prevented language variants from sharing a source.
--   Replace it with a partial unique index that keeps exactly one
--   language-agnostic (default) section per source while allowing any number
--   of language-specific variants.
-- Stratifit Digital Agency Platform

alter table public.email_inbox_sections
  drop constraint if exists email_inbox_sections_form_source_key_unique;

create unique index email_inbox_sections_source_default_unique
  on public.email_inbox_sections (form_source_key)
  where form_source_key is not null and language is null;

-- Language-specific contact sections now receive contact-form submissions in
-- their language; the language-agnostic `contact` section remains the default.
update public.email_inbox_sections
set form_source_key = 'contact_form'
where slug in ('contact-de', 'contact-fr', 'contact-es');

-- Rollback:
-- UPDATE public.email_inbox_sections
--   SET form_source_key = NULL
--   WHERE slug IN ('contact-de', 'contact-fr', 'contact-es');
-- DROP INDEX IF EXISTS email_inbox_sections_source_default_unique;
-- ALTER TABLE public.email_inbox_sections
--   ADD CONSTRAINT email_inbox_sections_form_source_key_unique UNIQUE (form_source_key);
