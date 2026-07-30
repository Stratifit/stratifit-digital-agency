// ============================================================================
// Stratifit — Services Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven services section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapServicesSection,
  mapServiceCard,
  type CmsServicesSection,
  type CmsServiceCard,
  type ServicesSectionRow,
  type ServiceCardRow,
} from "@/lib/types/services";

/** Fetch all service cards belonging to a services section. */
export async function getServiceCards(
  parentSectionId: string
): Promise<CmsServiceCard[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("service_cards")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch service cards: ${error.message}`);
  }

  return (data ?? []).map((row) => mapServiceCard(row as unknown as ServiceCardRow));
}

/** Fetch a specific services section row by ID, including its cards. */
export async function getServicesSection(
  id: string
): Promise<CmsServicesSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("services_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch services section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapServicesSection(data as unknown as ServicesSectionRow);
  const cards = await getServiceCards(id);

  return {
    ...section,
    services: cards,
  };
}

/** Fetch the first (highest priority) services section row, including cards. */
export async function getDefaultServicesSection(): Promise<CmsServicesSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("services_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch services section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapServicesSection(data as unknown as ServicesSectionRow);
  const cards = await getServiceCards(section.id);

  return {
    ...section,
    services: cards,
  };
}
