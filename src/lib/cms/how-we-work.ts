// ============================================================================
// Stratifit — How We Work Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven How We Work section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapHowWeWorkSection,
  mapHowWeWorkStep,
  type CmsHowWeWorkSection,
  type CmsHowWeWorkStep,
  type HowWeWorkSectionRow,
  type HowWeWorkStepRow,
} from "@/lib/types/how-we-work";

/** Fetch all steps belonging to a how we work section. */
export async function getHowWeWorkSteps(
  parentSectionId: string
): Promise<CmsHowWeWorkStep[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("how_we_work_steps")
    .select("*")
    .eq("parent_section", parentSectionId)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch how we work steps: ${error.message}`);
  }

  return (data ?? []).map((row) => mapHowWeWorkStep(row as unknown as HowWeWorkStepRow));
}

/** Fetch a specific how we work section row by ID, including its steps. */
export async function getHowWeWorkSection(
  id: string
): Promise<CmsHowWeWorkSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("how_we_work_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch how we work section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapHowWeWorkSection(data as unknown as HowWeWorkSectionRow);
  const steps = await getHowWeWorkSteps(id);

  return {
    ...section,
    steps,
  };
}

/** Fetch the first (highest priority) how we work section row, including steps. */
export async function getDefaultHowWeWorkSection(): Promise<CmsHowWeWorkSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("how_we_work_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch how we work section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapHowWeWorkSection(data as unknown as HowWeWorkSectionRow);
  const steps = await getHowWeWorkSteps(section.id);

  return {
    ...section,
    steps,
  };
}
