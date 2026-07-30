// ============================================================================
// Stratifit — Insights Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven insights section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapInsightsSection,
  mapInsightCard,
  type CmsInsightsSection,
  type CmsInsightCard,
  type InsightsSectionRow,
  type InsightCardRow,
} from "@/lib/types/insights";

/** Fetch all insight cards belonging to an insights section. */
export async function getInsightCards(
  parentSectionId: string
): Promise<CmsInsightCard[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("insight_cards")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch insight cards: ${error.message}`);
  }

  return (data ?? []).map((row) => mapInsightCard(row as unknown as InsightCardRow));
}

/** Fetch a specific insights section row by ID, including its cards. */
export async function getInsightsSection(
  id: string
): Promise<CmsInsightsSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("insights_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch insights section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapInsightsSection(data as unknown as InsightsSectionRow);
  const cards = await getInsightCards(id);

  return {
    ...section,
    cards,
  };
}

/** Fetch the first (highest priority) insights section row, including cards. */
export async function getDefaultInsightsSection(): Promise<CmsInsightsSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("insights_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch insights section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapInsightsSection(data as unknown as InsightsSectionRow);
  const cards = await getInsightCards(section.id);

  return {
    ...section,
    cards,
  };
}
