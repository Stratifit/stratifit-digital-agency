// ============================================================================
// Stratifit — Hero Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven hero section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapHeroSection,
  type CmsHeroSection,
  type HeroSectionRow,
} from "@/lib/types/hero";

/** Fetch all hero section rows, ordered by display_order. */
export async function getHeroSections(): Promise<CmsHeroSection[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("hero_section")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch hero sections: ${error.message}`);
  }

  return (data ?? []).map((row) => mapHeroSection(row as unknown as HeroSectionRow));
}

/** Fetch a specific hero section row by ID. */
export async function getHeroSection(
  id: string
): Promise<CmsHeroSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("hero_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch hero section: ${error.message}`);
  }

  return data ? mapHeroSection(data as unknown as HeroSectionRow) : null;
}

/** Fetch the first (highest priority) hero section row, or null. */
export async function getDefaultHeroSection(): Promise<CmsHeroSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("hero_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch hero section: ${error.message}`);
  }

  return data ? mapHeroSection(data as unknown as HeroSectionRow) : null;
}
