// ============================================================================
// Stratifit — Navigation Header Data Helpers
// Reusable Supabase fetch + map helpers for the global navigation header.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapNavigationHeader,
  type CmsNavigationHeader,
  type NavigationHeaderRow,
} from "@/lib/types/navigationHeader";

/** Fetch all navigation header rows, ordered by display_order. */
export async function getNavigationHeaderRows(): Promise<CmsNavigationHeader[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("section_navigation_header")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch navigation header rows: ${error.message}`);
  }

  return (data ?? []).map((row) =>
    mapNavigationHeader(row as unknown as NavigationHeaderRow)
  );
}

/** Fetch the first (highest priority) navigation header row, or null. */
export async function getNavigationHeader(): Promise<CmsNavigationHeader | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("section_navigation_header")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1);

  if (error) {
    throw new Error(`Failed to fetch navigation header: ${error.message}`);
  }

  const row = data?.[0];
  if (!row) {
    return null;
  }

  return mapNavigationHeader(row as unknown as NavigationHeaderRow);
}
