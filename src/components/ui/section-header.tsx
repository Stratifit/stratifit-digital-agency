import { cn } from "@/lib/cn";
import type { PublicSectionSettings } from "@/features/section-settings/queries";
import { resolvePublicTranslation as resolveTranslation } from "@/lib/i18n/public-translation";
import {
  SECTION_HEADER_FALLBACKS,
  type LocaleMap,
} from "@/lib/i18n/section-fallbacks";
import { SectionHeadingReveal } from "@/components/ui/section-heading-reveal";

export function SectionHeader({
  settings,
  locale,
  align = "left",
  dot = false,
  compact = false,
  className,
  splitHighlightFirstWord = false,
}: {
  settings: PublicSectionSettings | null;
  locale: string;
  align?: "left" | "center";
  dot?: boolean;
  /** Compact sizing for narrow surfaces such as the chat panel — no reveal
      animation, smaller heading type and margins. */
  compact?: boolean;
  className?: string;
  /** Render only the first word of the highlight in amber and the rest of the
      highlight in the normal heading color (e.g. "Tech Stack" → amber
      "Tech"). Opt-in per section. */
  splitHighlightFirstWord?: boolean;
}) {
  if (!settings) {
    return null;
  }

  // Fall back to the section's canonical copy when the DB row has no usable
  // text, so headers never render empty (page/section titles included).
  const fallback = SECTION_HEADER_FALLBACKS[settings.section_key];
  const resolveField = (
    translations: Record<string, string> | null | undefined,
    fallbackField: LocaleMap | undefined
  ) => {
    const fromDb = resolveTranslation(translations, locale);
    if (fromDb) return fromDb;
    return fallbackField?.[locale as keyof LocaleMap] || fallbackField?.en || "";
  };

  const eyebrow = resolveField(settings.eyebrow_translations, fallback?.eyebrow);
  const title = resolveField(settings.title_translations, fallback?.title);
  const highlight = resolveField(
    settings.highlight_translations,
    fallback?.highlight
  );
  const description = resolveField(
    settings.description_translations,
    fallback?.description
  );

  let amberHighlight = highlight;
  let highlightRest: string | null = null;
  if (splitHighlightFirstWord && highlight) {
    const firstSpace = highlight.indexOf(" ");
    if (firstSpace > 0) {
      amberHighlight = highlight.slice(0, firstSpace);
      highlightRest = highlight.slice(firstSpace + 1);
    }
  }

  if (!eyebrow && !title && !description) {
    return null;
  }

  const centered = align === "center";

  const heading = (
    <>
      {eyebrow ? (
        <p
          data-sh
          className={cn(
            "mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary",
            centered && "mx-auto"
          )}
        >
          {dot ? (
            <span
              aria-hidden="true"
              className="mr-2 inline-block size-2 animate-pulse rounded-full bg-primary align-middle"
            />
          ) : null}
          {eyebrow}
        </p>
      ) : null}
      <h2
        data-sh
        className={cn(
          "font-display font-black leading-tight tracking-tight text-text-primary",
          compact
            ? "text-2xl sm:text-3xl"
            : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl md:leading-none"
        )}
      >
        <span>{title}</span>
        {amberHighlight ? (
          <span className="text-primary"> {amberHighlight}</span>
        ) : null}
        {highlightRest ? <span> {highlightRest}</span> : null}
      </h2>
      {description ? (
        <p
          data-sh
          className={cn(
            "mt-3 max-w-2xl text-sm leading-relaxed text-text-muted",
            compact
              ? "ml-1.5 border-l-2 border-primary/50 pl-4"
              : "sm:text-base md:text-lg ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </>
  );

  if (compact) {
    return (
      <div className={cn("mb-6", centered && "text-center", className)}>
        {heading}
      </div>
    );
  }

  // cn() does not dedupe conflicting utilities, so when the caller supplies a
  // margin override (e.g. className="mb-0") the default bottom margin is
  // dropped instead of both classes being emitted.
  const overridesMargin = className?.includes("mb-");

  return (
    <SectionHeadingReveal
      className={cn(
        overridesMargin ? undefined : "mb-10 md:mb-16",
        centered && "text-center",
        className
      )}
    >
      {heading}
    </SectionHeadingReveal>
  );
}
