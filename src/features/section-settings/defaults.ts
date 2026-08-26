import { SECTION_HEADER_FALLBACKS } from "@/lib/i18n/section-fallbacks";
import type { AdminSectionSettings } from "./queries";

/**
 * Editable section keys — the `section_settings`-backed sections managed from
 * the CMS "Sections" page. Mirrors the DB check constraint and seed rows.
 */
export const EDITABLE_SECTION_KEYS = [
  "services",
  "process",
  "why-choose-us",
  "insights",
  "portfolio",
  "acquisition",
  "testimonials",
  "pricing",
  "faq",
  "contact",
  "acquisition-cta",
  "tech-stack",
  "related-case-studies",
] as const;

export type EditableSectionKey = (typeof EDITABLE_SECTION_KEYS)[number];

export function isEditableSectionKey(
  key: string
): key is EditableSectionKey {
  return (EDITABLE_SECTION_KEYS as readonly string[]).includes(key);
}

/** Stable label and display order for each editable section (mirrors the seed). */
export const SECTION_KEY_META: Record<
  EditableSectionKey,
  { label: string; displayOrder: number }
> = {
  "tech-stack": { label: "Tech Stack", displayOrder: 5 },
  services: { label: "Services", displayOrder: 10 },
  process: { label: "Process", displayOrder: 20 },
  "why-choose-us": { label: "Why Choose Us", displayOrder: 30 },
  insights: { label: "Insights & Expertise", displayOrder: 40 },
  portfolio: { label: "Portfolio", displayOrder: 50 },
  acquisition: { label: "Acquisition", displayOrder: 55 },
  testimonials: { label: "Testimonials", displayOrder: 60 },
  pricing: { label: "Pricing", displayOrder: 70 },
  faq: { label: "FAQ", displayOrder: 80 },
  contact: { label: "Contact", displayOrder: 95 },
  "acquisition-cta": { label: "Acquisition — Final CTA", displayOrder: 57 },
  "related-case-studies": { label: "Similar Case Studies", displayOrder: 100 },
};

/** Tech-stack grid items reflecting the Stratifit approved technology stack
 *  (AGENTS.md §4). Used to pre-fill the CMS editor and to render the section
 *  while the migration is pending. The database remains the source of truth
 *  once applied. */
export const DEFAULT_TECH_STACK: {
  name: string;
  icon: string;
  media_id?: string | null;
  image_url?: string | null;
}[] = [
  { name: "Next.js", icon: "code" },
  { name: "React", icon: "atom" },
  { name: "TypeScript", icon: "code" },
  { name: "Tailwind CSS", icon: "brush" },
  { name: "Supabase", icon: "zap" },
  { name: "GSAP", icon: "zap" },
  { name: "shadcn/ui", icon: "brush" },
  { name: "Lucide", icon: "code" },
  { name: "Zod", icon: "zap" },
  { name: "React Hook Form", icon: "code" },
  { name: "Vercel", icon: "atom" },
  { name: "Nodemailer", icon: "zap" },
];

/**
 * Canonical admin settings for a section, used when the DB row is missing
 * (for example before migration 00057 has been applied). The CMS editor then
 * opens pre-filled with the intended content instead of 404ing, and saving
 * creates the row.
 */
export function getDefaultAdminSectionSetting(
  sectionKey: string
): AdminSectionSettings | null {
  if (!isEditableSectionKey(sectionKey)) return null;
  const meta = SECTION_KEY_META[sectionKey];
  const fallback = SECTION_HEADER_FALLBACKS[sectionKey];
  const settings: AdminSectionSettings = {
    section_key: sectionKey,
    label: meta.label,
    eyebrow_translations: fallback?.eyebrow ?? {},
    title_translations: fallback?.title ?? {},
    highlight_translations: fallback?.highlight ?? {},
    description_translations: fallback?.description ?? {},
    is_visible: sectionKey !== "related-case-studies",
    display_order: meta.displayOrder,
    updated_at: "",
  };
  if (sectionKey === "tech-stack") {
    settings.tech_stack = DEFAULT_TECH_STACK;
  }
  return settings;
}
