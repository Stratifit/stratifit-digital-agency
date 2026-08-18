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
import { cn } from "@/lib/cn";

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

function TechIcon({ name }: { name: string }) {
  const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-6",
    "aria-hidden": true,
  };

  switch (name) {
    case "brush":
      return (
        <svg {...svgProps}>
          <path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
      );
    case "zap":
      return (
        <svg {...svgProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "code":
      return (
        <svg {...svgProps}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "atom":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="1" />
          <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
          <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Tech stack section shown between the hero and Services on the homepage.
 * Uses the standard section header (same size/position as the other sections)
 * above two auto-scrolling marquee rows of technologies (one forward, one
 * reverse, pausing only for reduced-motion users). Content (heading +
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

  // Two marquee rows (first half / second half). Each row duplicates its items
  // so the CSS translateX(-50%) loop is seamless; row 0 scrolls forward, row 1
  // in reverse — the same treatment as the service-page Toolkit marquee.
  const midpoint = Math.ceil(items.length / 2);
  const rows = [items.slice(0, midpoint), items.slice(midpoint)];

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
          />

          <div>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="overflow-hidden py-4 md:py-6">
                <div
                  className={cn(
                    "flex w-max gap-10 whitespace-nowrap",
                    rowIndex === 0 ? "marquee-scroll" : "marquee-scroll-reverse"
                  )}
                >
                  {[...row, ...row].map((tech, index) => (
                    <span
                      key={`${rowIndex}-${tech.name}-${index}`}
                      className="flex items-center gap-2 text-lg font-medium text-text-secondary sm:text-xl"
                    >
                      <span className="shrink-0 text-text-subtle">
                        <TechIcon name={tech.icon} />
                      </span>
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
