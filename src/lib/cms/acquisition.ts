// ============================================================================
// Stratifit — Acquisition / Buy a Business Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven acquisition section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapAcquisitionSection,
  mapAcquisitionCard,
  type CmsAcquisitionSection,
  type CmsAcquisitionCard,
  type AcquisitionSectionRow,
  type AcquisitionCardRow,
} from "@/lib/types/acquisition";

/** Fetch all acquisition cards belonging to an acquisition section. */
export async function getAcquisitionCards(
  parentSectionId: string
): Promise<CmsAcquisitionCard[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("acquisition_cards")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch acquisition cards: ${error.message}`);
  }

  return (data ?? []).map((row) => mapAcquisitionCard(row as unknown as AcquisitionCardRow));
}

/** Fetch a specific acquisition section row by ID, including its cards. */
export async function getAcquisitionSection(
  id: string
): Promise<CmsAcquisitionSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("acquisition_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch acquisition section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapAcquisitionSection(data as unknown as AcquisitionSectionRow);
  const items = await getAcquisitionCards(id);

  return {
    ...section,
    items,
  };
}

/** Fetch the first (highest priority) acquisition section row, including cards. */
export async function getDefaultAcquisitionSection(): Promise<CmsAcquisitionSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("acquisition_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch acquisition section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapAcquisitionSection(data as unknown as AcquisitionSectionRow);
  const items = await getAcquisitionCards(section.id);

  return {
    ...section,
    items,
  };
}
