import {
  getPublicSectionSetting,
  getPublicSectionSettingIncludingHidden,
} from "@/features/section-settings/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { SECTION_HEADER_FALLBACKS } from "@/lib/i18n/section-fallbacks";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

interface TechStackItem {
  name: string;
  icon: string;
}

/** Built-in fallback matching migration 00057's seed. Used only while the
 *  migration isn't applied (no section_settings.tech_stack column/row), so the
 *  section still renders. The database is the source of truth once applied. */
const DEFAULT_TECH_STACK: TechStackItem[] = [
  { name: "Tailwind CSS", icon: "brush" },
  { name: "Framer Motion", icon: "zap" },
  { name: "GSAP", icon: "zap" },
  { name: "Next.js", icon: "code" },
  { name: "React", icon: "atom" },
  { name: "TypeScript", icon: "code" },
];

/** Renders a heading keeping the word "Tech" in amber while the rest keeps the
 *  normal text color — the original hero marquee look. */
function TechHighlight({ text }: { text: string }) {
  const parts = text.split(/\b(Tech)\b/i);
  return (
    <>
      {parts.map((part, index) =>
        /^Tech$/i.test(part) ? (
          <span key={index} className="text-primary">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function TechIcon({ name }: { name: string }) {
  const svgProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "size-5",
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
 * Tech stack marquee section shown between the hero and Services on the
 * homepage. Keeps the original compact design: small centered heading with the
 * word "Tech" in amber, a one-line description, and the scrolling marquee.
 * Content (heading + technologies) is CMS-editable via Sections → Tech Stack.
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

  // Resolve the heading/description with the shared fallbacks so the section
  // never renders an empty header (the database remains the source of truth).
  const fallback = SECTION_HEADER_FALLBACKS["tech-stack"];
  const resolveField = (
    translations: Record<string, string> | null | undefined,
    fallbackField: { en: string; de: string; fr: string; es: string }
  ) =>
    resolveTranslation(translations, locale) ||
    fallbackField[locale as keyof typeof fallbackField] ||
    fallbackField.en ||
    "";

  const title = resolveField(settings?.title_translations, fallback.title);
  const highlight = resolveField(
    settings?.highlight_translations,
    fallback.highlight
  );
  const description = resolveField(
    settings?.description_translations,
    fallback.description
  );
  const heading = `${title} ${highlight}`.trim().replace(/\s+/g, " ");

  return (
    <>
      <Section>
        <Container>
          <Reveal>
            {heading ? (
              <h2 className="mb-1.5 text-center text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                <TechHighlight text={heading} />
              </h2>
            ) : null}
            {description ? (
              <p className="mx-auto mb-0 max-w-2xl px-4 text-center text-xs font-medium leading-snug text-text-secondary sm:text-sm">
                {description}
              </p>
            ) : null}
          </Reveal>

          <Reveal className="marquee-pause relative overflow-hidden py-4">
            <div className="marquee-scroll flex w-max gap-10 whitespace-nowrap sm:gap-12">
              {[...items, ...items].map((tech, index) => (
                <div
                  key={`${tech.name}-${index}`}
                  className="group flex cursor-pointer flex-row items-center justify-center gap-2.5 text-text-muted transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:text-text-secondary"
                >
                  <span className="text-text-subtle transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:scale-110">
                    <TechIcon name={tech.icon} />
                  </span>
                  <span className="text-base font-semibold tracking-wide sm:text-lg">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
      <div aria-hidden="true" className="h-px w-full bg-white/5" />
    </>
  );
}
