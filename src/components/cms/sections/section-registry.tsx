// ============================================================================
// Stratifit — Section Registry
// Maps component_type strings to lazy-loaded React server components.
// ============================================================================

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { CmsLanguage, ResolvedBlock } from "@/lib/types/cms";

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
// Dynamic imports — each section component is code-split independently.
// ============================================================================

const componentMap: Record<string, () => Promise<{ default: SectionComponent }>> = {
  HeroSection: () =>
    import("@/components/cms/sections/HeroSection").then((m) => ({
      default: m.HeroSection as SectionComponent,
    })),
  services: () =>
    import("@/components/cms/sections/ServicesSection").then((m) => ({
      default: m.ServicesSection as SectionComponent,
    })),
  how_we_work: () =>
    import("@/components/cms/sections/HowWeWorkSection").then((m) => ({
      default: m.HowWeWorkSection as SectionComponent,
    })),
  why_us: () =>
    import("@/components/cms/sections/WhyUsSection").then((m) => ({
      default: m.WhyUsSection as SectionComponent,
    })),
  insights: () =>
    import("@/components/cms/sections/InsightsSection").then((m) => ({
      default: m.InsightsSection as SectionComponent,
    })),
  ServicesSection: () =>
    import("@/components/cms/sections/ServicesSection").then((m) => ({
      default: m.ServicesSection as SectionComponent,
    })),
  CtaSection: () =>
    import("@/components/cms/sections/CtaSection").then((m) => ({
      default: m.CtaSection as SectionComponent,
    })),
  AnnouncementBarSection: () =>
    import("@/components/cms/sections/AnnouncementBarSection").then((m) => ({
      default: m.AnnouncementBarSection as SectionComponent,
    })),
  NavigationHeaderSection: () =>
    import("@/components/cms/sections/NavigationHeaderSection").then((m) => ({
      default: m.NavigationHeaderSection as SectionComponent,
    })),
};

// Dynamic wrappers — these are lazy-loaded React components
const dynamicComponents: Record<string, SectionComponent> = {};

for (const [type, importer] of Object.entries(componentMap)) {
  dynamicComponents[type] = dynamic(importer, {
    ssr: true,
    loading: () => <SectionSkeleton />,
  });
}

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
  const Component = dynamicComponents[componentType];
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

function SectionSkeleton() {
  return (
    <div className="w-full h-64 bg-surface-darkCard animate-pulse rounded-2xl" />
  );
}

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
