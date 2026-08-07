-- Migration: 00034_fix_insight_categories_public_policy
-- Fix the EXISTS subquery in the 00033 insight_categories policy. The JOIN
-- introduced insights.id into the subquery scope, so the unqualified `id`
-- comparison resolved to insights.id instead of insight_categories.id — the
-- policy never matched and the public role saw zero categories (breaking the
-- insights filter pills and category badges). Qualify the outer key.

DROP POLICY IF EXISTS "public can read categories with published insights"
  ON public.insight_categories;

CREATE POLICY "public can read categories with published insights"
  ON public.insight_categories FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.insight_category_links l
      JOIN public.insights i ON i.id = l.insight_id
      WHERE l.category_id = public.insight_categories.id
        AND i.status = 'published'
    )
  );

-- =============================================================================
-- Rollback
-- =============================================================================
-- DROP POLICY IF EXISTS "public can read categories with published insights" ON public.insight_categories;
