// ============================================================================
// Stratifit — Portfolio Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven portfolio section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapPortfolioSection,
  mapPortfolioItem,
  type CmsPortfolioSection,
  type CmsPortfolioItem,
  type PortfolioSectionRow,
  type PortfolioItemRow,
} from "@/lib/types/portfolio";

/** Fetch all portfolio items belonging to a portfolio section. */
export async function getPortfolioItems(
  parentSectionId: string
): Promise<CmsPortfolioItem[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch portfolio items: ${error.message}`);
  }

  return (data ?? []).map((row) => mapPortfolioItem(row as unknown as PortfolioItemRow));
}

/** Fetch a specific portfolio section row by ID, including its items. */
export async function getPortfolioSection(
  id: string
): Promise<CmsPortfolioSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("portfolio_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch portfolio section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapPortfolioSection(data as unknown as PortfolioSectionRow);
  const items = await getPortfolioItems(id);

  return {
    ...section,
    items,
  };
}

/** Fetch the first (highest priority) portfolio section row, including items. */
export async function getDefaultPortfolioSection(): Promise<CmsPortfolioSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("portfolio_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch portfolio section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapPortfolioSection(data as unknown as PortfolioSectionRow);
  const items = await getPortfolioItems(section.id);

  return {
    ...section,
    items,
  };
}
