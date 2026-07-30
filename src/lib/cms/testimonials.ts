// ============================================================================
// Stratifit — Testimonials Section Data Helpers
// Reusable Supabase fetch + map helpers for the CMS-driven testimonials section.
// ============================================================================

import { createSupabaseClient } from "@/lib/supabase/client";
import {
  mapTestimonialsSection,
  mapTestimonialCard,
  type CmsTestimonialsSection,
  type CmsTestimonialCard,
  type TestimonialsSectionRow,
  type TestimonialCardRow,
} from "@/lib/types/testimonials";

/** Fetch all testimonial cards belonging to a testimonials section. */
export async function getTestimonialCards(
  parentSectionId: string
): Promise<CmsTestimonialCard[]> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("testimonial_cards")
    .select("*")
    .eq("parent_section", parentSectionId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch testimonial cards: ${error.message}`);
  }

  return (data ?? []).map((row) => mapTestimonialCard(row as unknown as TestimonialCardRow));
}

/** Fetch a specific testimonials section row by ID, including its cards. */
export async function getTestimonialsSection(
  id: string
): Promise<CmsTestimonialsSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("testimonials_section")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch testimonials section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapTestimonialsSection(data as unknown as TestimonialsSectionRow);
  const cards = await getTestimonialCards(id);

  return {
    ...section,
    cards,
  };
}

/** Fetch the first (highest priority) testimonials section row, including cards. */
export async function getDefaultTestimonialsSection(): Promise<CmsTestimonialsSection | null> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("testimonials_section")
    .select("*")
    .order("display_order", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch testimonials section: ${error.message}`);
  }

  if (!data) return null;

  const section = mapTestimonialsSection(data as unknown as TestimonialsSectionRow);
  const cards = await getTestimonialCards(section.id);

  return {
    ...section,
    cards,
  };
}
