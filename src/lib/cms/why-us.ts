// ============================================================================
// Stratifit — Why Us Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven Why Us section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapWhyUsSection,
  mapWhyUsFeature,
  type CmsWhyUsSection,
  type CmsWhyUsFeature,
  type WhyUsSectionRow,
  type WhyUsFeatureRow,
} from "@/lib/types/why-us";

/** Fetch all feature cards belonging to a Why Us section. */
export async function getWhyUsFeatures(
  parentSectionId: string
): Promise<CmsWhyUsFeature[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("why_us_features")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch Why Us features: ${error.message}`);
  }

  return (data ?? []).map((row) => mapWhyUsFeature(row as unknown as WhyUsFeatureRow));
}

/** Fetch a specific Why Us section row by ID, including its features. */
export async function getWhyUsSection(
  id: string
): Promise<CmsWhyUsSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("why_us_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch Why Us section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapWhyUsSection(data as unknown as WhyUsSectionRow);
  const features = await getWhyUsFeatures(id);

  return {
    ...section,
    features,
  };
}

/** Fetch the first (highest priority) Why Us section row, including features. */
export async function getDefaultWhyUsSection(): Promise<CmsWhyUsSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("why_us_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch Why Us section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapWhyUsSection(data as unknown as WhyUsSectionRow);
  const features = await getWhyUsFeatures(section.id);

  return {
    ...section,
    features,
  };
}
