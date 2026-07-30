// ============================================================================
// Stratifit — Pricing Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven pricing section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapPricingSection,
  mapPricingPackage,
  type CmsPricingSection,
  type CmsPricingPackage,
  type PricingSectionRow,
  type PricingPackageRow,
} from "@/lib/types/pricing";

/** Fetch all pricing packages belonging to a pricing section. */
export async function getPricingPackages(
  parentSectionId: string
): Promise<CmsPricingPackage[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("pricing_packages")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch pricing packages: ${error.message}`);
  }

  return (data ?? []).map((row) => mapPricingPackage(row as unknown as PricingPackageRow));
}

/** Fetch a specific pricing section row by ID, including its packages. */
export async function getPricingSection(
  id: string
): Promise<CmsPricingSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("pricing_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch pricing section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapPricingSection(data as unknown as PricingSectionRow);
  const packages = await getPricingPackages(id);

  return {
    ...section,
    packages,
  };
}

/** Fetch the first (highest priority) pricing section row, including packages. */
export async function getDefaultPricingSection(): Promise<CmsPricingSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("pricing_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch pricing section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapPricingSection(data as unknown as PricingSectionRow);
  const packages = await getPricingPackages(section.id);

  return {
    ...section,
    packages,
  };
}
