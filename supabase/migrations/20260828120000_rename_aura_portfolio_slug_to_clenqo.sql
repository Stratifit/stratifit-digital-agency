-- CLENQO is the client represented by this legacy portfolio row.
-- Keep the change idempotent and avoid collisions if the target slug exists.
UPDATE public.portfolio_projects
SET slug = 'clenqo'
WHERE slug = 'aura-cosmetics-identity'
  AND NOT EXISTS (
    SELECT 1
    FROM public.portfolio_projects AS existing
    WHERE existing.slug = 'clenqo'
  );
