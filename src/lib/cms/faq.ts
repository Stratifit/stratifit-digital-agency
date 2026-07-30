// ============================================================================
// Stratifit — FAQ Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven FAQ section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapFaqSection,
  mapFaqItem,
  type CmsFaqSection,
  type CmsFaqItem,
  type FaqSectionRow,
  type FaqItemRow,
} from "@/lib/types/faq";

/** Fetch all FAQ items belonging to a FAQ section. */
export async function getFaqItems(parentSectionId: string): Promise<CmsFaqItem[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch FAQ items: ${error.message}`);
  }

  return (data ?? []).map((row) => mapFaqItem(row as unknown as FaqItemRow));
}

/** Fetch a specific FAQ section row by ID, including its items. */
export async function getFaqSection(id: string): Promise<CmsFaqSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("faq_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch FAQ section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapFaqSection(data as unknown as FaqSectionRow);
  const items = await getFaqItems(id);

  return {
    ...section,
    items,
  };
}

/** Fetch the first (highest priority) FAQ section row, including items. */
export async function getDefaultFaqSection(): Promise<CmsFaqSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("faq_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch FAQ section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapFaqSection(data as unknown as FaqSectionRow);
  const items = await getFaqItems(section.id);

  return {
    ...section,
    items,
  };
}
