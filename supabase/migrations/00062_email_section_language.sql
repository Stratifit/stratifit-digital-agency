-- Migration: 00062_email_section_language
-- Description: Language-aware inbound routing — an optional language on each
--   email inbox section lets incoming email land in the section matching the
--   customer's detected language (en/de/fr/es). NULL means language-agnostic
--   (matches any language), preserving existing behaviour for current sections.
-- Stratifit Digital Agency Platform

alter table public.email_inbox_sections
  add column language text
  check (language is null or language in ('en', 'de', 'fr', 'es'));

comment on column public.email_inbox_sections.language is
  'Optional routing language. NULL = matches any language (language-agnostic).';

create index email_inbox_sections_language_idx
  on public.email_inbox_sections (language)
  where language is not null;

-- Rollback:
-- DROP INDEX IF EXISTS email_inbox_sections_language_idx;
-- ALTER TABLE public.email_inbox_sections DROP COLUMN IF EXISTS language;
