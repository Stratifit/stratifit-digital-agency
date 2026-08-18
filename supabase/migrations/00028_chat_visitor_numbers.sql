-- Migration: 00028_chat_visitor_numbers
-- Description: Permanent, concurrency-safe, admin-facing sequential reference
--              numbers for chat visitors. Never exposed to the public chatbot.
-- Stratifit Digital Agency Platform

-- Sequence drives assignment (concurrency-safe, no count()+1 races).
CREATE SEQUENCE IF NOT EXISTS public.chat_visitor_number_seq START 1;

ALTER TABLE public.chat_visitors
  ADD COLUMN IF NOT EXISTS visitor_number integer;

-- Backfill existing visitors in a stable order (first seen).
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY first_seen_at ASC, created_at ASC) AS rn
  FROM public.chat_visitors
  WHERE visitor_number IS NULL
)
UPDATE public.chat_visitors v
SET visitor_number = numbered.rn
FROM numbered
WHERE v.id = numbered.id;

-- Position the sequence after the highest backfilled number. `false` sets the
-- next value to exactly max+1 (or 1 on an empty table); setval(..., 0) is
-- invalid for a sequence with START 1 and broke fresh database resets.
SELECT setval(
  'public.chat_visitor_number_seq',
  (SELECT COALESCE(MAX(visitor_number), 0) + 1 FROM public.chat_visitors),
  false
);

-- Auto-assign on insert (BEFORE trigger so every new visitor gets a number).
CREATE OR REPLACE FUNCTION public.assign_chat_visitor_number()
RETURNS trigger AS $$
BEGIN
  IF NEW.visitor_number IS NULL THEN
    NEW.visitor_number := nextval('public.chat_visitor_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_chat_visitor_number ON public.chat_visitors;
CREATE TRIGGER assign_chat_visitor_number
  BEFORE INSERT ON public.chat_visitors
  FOR EACH ROW EXECUTE FUNCTION public.assign_chat_visitor_number();

CREATE UNIQUE INDEX IF NOT EXISTS chat_visitors_visitor_number_key
  ON public.chat_visitors (visitor_number);
