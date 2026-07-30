// ============================================================================
// Stratifit — Section Registry
// Maps component_type strings to React server/client section components.
// ============================================================================

import type { ComponentType } from "react";
import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";
import { HeroSection } from "./HeroSection";
import { ServicesSection } from "./ServicesSection";
import { HowWeWorkSection } from "./HowWeWorkSection";
import { WhyUsSection } from "./WhyUsSection";
import { InsightsSection } from "./InsightsSection";
import { PortfolioSection } from "./PortfolioSection";
import { AcquisitionSection } from "./AcquisitionSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { FaqSection } from "./FaqSection";
import { CtaSection } from "./CtaSection";
import { AnnouncementBarSection } from "./AnnouncementBarSection";
import { NavigationHeaderSection } from "./NavigationHeaderSection";

// ============================================================================
// Shared props contract — every section component receives these.
// ============================================================================
export interface SectionComponentProps {
  payload: Record<string, unknown>;
  blocks: ResolvedBlock[];
  locale: CmsLanguage;
}

/** All registered section component types */
export type SectionComponent = ComponentType<SectionComponentProps>;

// ============================================================================
// Static component map — direct imports avoid next/dynamic issues with
// async Server Components in the App Router.
// ============================================================================
const componentMap: Record<string, SectionComponent> = {
  HeroSection,
  services: ServicesSection,
  how_we_work: HowWeWorkSection,
  why_us: WhyUsSection,
  insights: InsightsSection,
  portfolio: PortfolioSection,
  acquisition: AcquisitionSection,
  testimonials: TestimonialsSection,
  pricing: PricingSection,
  faq: FaqSection,
  // Legacy alias kept for backwards compatibility
  ServicesSection: ServicesSection,
  CtaSection: CtaSection as unknown as SectionComponent,
  AnnouncementBarSection,
  NavigationHeaderSection,
};

// ============================================================================
// Public API
// ============================================================================

/**
 * Returns the React component for the given section type.
 * Falls back to a NullSection if the type is not registered.
 */
export function getSectionComponent(
  componentType: string
): SectionComponent {
  const Component = componentMap[componentType];
  if (!Component) {
    console.warn(
      `[section-registry] Unknown section type: "${componentType}". Using NullSection fallback.`
    );
    return NullSection;
  }
  return Component;
}

// ============================================================================
// Fallbacks
// ============================================================================

function NullSection({ payload }: SectionComponentProps) {
  return (
    <div className="py-12 px-6 text-center text-neutral-500 font-body">
      <p>Unknown section type. Raw payload:</p>
      <pre className="mt-2 text-sm text-left max-w-xl mx-auto overflow-auto bg-surface-darkCard p-4 rounded-xl border border-surface-darkBorder">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}
