import {
  getPublicSectionSetting,
  getPublicSectionSettingIncludingHidden,
  type PublicSectionSettings,
} from "@/features/section-settings/queries";
import { DEFAULT_TECH_STACK } from "@/features/section-settings/defaults";
import { getLocale } from "@/lib/i18n/get-locale";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { TechLogo } from "./tech-logos";

interface TechStackItem {
  name: string;
  icon: string;
}

/** Header translations mirrored from the seed; empty fields make SectionHeader
 *  fall back to the shared SECTION_HEADER_FALLBACKS map. */
const FALLBACK_HEADER_SETTINGS: PublicSectionSettings = {
  section_key: "tech-stack",
  label: "Tech Stack",
  eyebrow_translations: {},
  title_translations: {},
  highlight_translations: {},
  description_translations: {},
  is_visible: true,
};

/**
 * Tech stack section shown between the hero and Services on the homepage.
 * Uses the standard section header above a static grid of technology cards
 * (4 columns on mobile, 6 on md+) — each card shows the brand logo plus the
 * name, mirroring the reference logo-wall layout. Content (heading +
 * technologies) is CMS-editable via Sections → Tech Stack.
 */
export async function TechStackSection() {
  const locale = await getLocale();
  const settings = await getPublicSectionSetting("tech-stack");
  const includingHidden =
    await getPublicSectionSettingIncludingHidden("tech-stack");

  // Row exists but is paused → honor the pause and render nothing.
  if (!settings && includingHidden) {
    return null;
  }

  // Row exists with an explicitly empty item list → the admin cleared it, so
  // the section hides (use the visibility toggle to hide the whole section).
  const dbItems = settings?.tech_stack ?? null;
  if (settings && Array.isArray(dbItems) && dbItems.length === 0) {
    return null;
  }

  const items =
    Array.isArray(dbItems) && dbItems.length > 0
      ? (dbItems as TechStackItem[])
      : DEFAULT_TECH_STACK;

  const headerSettings: PublicSectionSettings =
    settings ?? FALLBACK_HEADER_SETTINGS;

  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            settings={headerSettings}
            locale={locale}
            className="mb-0 md:mb-0"
            splitHighlightFirstWord
          />

          <div className="grid grid-cols-4 items-stretch gap-2 sm:gap-3 md:grid-cols-6">
            {items.map((tech) => (
              <div
                key={tech.name}
                className="group flex flex-col items-center justify-center gap-1.5 rounded-card border border-card-border bg-card-dark p-3 shadow-sm transition-[border-color,transform,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-hover focus-within:border-primary/40 md:p-5"
              >
                <span className="flex h-10 items-center justify-center text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:text-primary sm:h-12">
                  <TechLogo
                    name={tech.name}
                    fallbackIcon={tech.icon}
                    className="size-8 sm:size-9 md:size-11"
                  />
                </span>
                <span className="max-w-full truncate text-center text-[10px] font-medium leading-tight text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:text-text-secondary sm:text-xs">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
