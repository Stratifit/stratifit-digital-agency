// ============================================================================
// Stratifit — Testimonials / What Our Clients Say Section Component
// CMS-driven, multilingual testimonials slider. Fetches content from the
// testimonials_section and testimonial_cards tables.
// ============================================================================

import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { getTestimonialsSection, getDefaultTestimonialsSection } from "@/lib/cms/testimonials";
import { TestimonialsSectionClient } from "./TestimonialsSectionClient";

interface TestimonialsSectionProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

export async function TestimonialsSection({ payload, locale }: TestimonialsSectionProps) {
  const testimonialsSectionId =
    typeof payload.testimonialsSectionId === "string" ? payload.testimonialsSectionId : undefined;

  const section = testimonialsSectionId
    ? await getTestimonialsSection(testimonialsSectionId)
    : await getDefaultTestimonialsSection();

  if (!section) {
    return null;
  }

  return <TestimonialsSectionClient section={section} locale={locale} />;
}
