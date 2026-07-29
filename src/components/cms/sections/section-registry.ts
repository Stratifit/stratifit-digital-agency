// =============================================================================
// Stratifit Digital Agency — Section Component Registry
// Dynamically maps CMS component_type strings to lazy-loaded React server
// components via next/dynamic.
// =============================================================================

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { ParsedSection } from '@/lib/cms/validation';

export type SectionComponentProps = {
  section: ParsedSection;
};

type SectionRegistry = Record<string, ComponentType<SectionComponentProps>>;

export const sectionRegistry: SectionRegistry = {
  'hero-primary': dynamic(() => import('@/components/cms/sections/hero-primary')),
  'feature-grid': dynamic(() => import('@/components/cms/sections/feature-grid')),
  'cta-banner': dynamic(() => import('@/components/cms/sections/cta-banner')),
  'pricing-table': dynamic(() => import('@/components/cms/sections/pricing-table')),
  'contact-form': dynamic(() => import('@/components/cms/sections/contact-form')),
};

/**
 * Resolves a section component from the registry by component_type.
 * Returns `null` if the component_type is not registered, allowing
 * graceful fallback instead of a runtime crash.
 */
export function resolveSectionComponent(
  componentType: string
): ComponentType<SectionComponentProps> | null {
  return sectionRegistry[componentType] ?? null;
}
