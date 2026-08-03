import { cn } from "@/lib/cn";
import type { PublicSectionSettings } from "@/features/section-settings/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { SectionHeadingReveal } from "@/components/ui/section-heading-reveal";

export function SectionHeader({
  settings,
  locale,
  align = "left",
  dot = false,
  className,
}: {
  settings: PublicSectionSettings | null;
  locale: string;
  align?: "left" | "center";
  dot?: boolean;
  className?: string;
}) {
  if (!settings) {
    return null;
  }

  const eyebrow = resolveTranslation(settings.eyebrow_translations, locale);
  const title = resolveTranslation(settings.title_translations, locale);
  const highlight = resolveTranslation(settings.highlight_translations, locale);
  const description = resolveTranslation(
    settings.description_translations,
    locale
  );

  if (!eyebrow && !title && !description) {
    return null;
  }

  const centered = align === "center";

  return (
    <SectionHeadingReveal
      className={cn("mb-10 md:mb-16", centered && "text-center", className)}
    >
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
        className="font-display text-3xl font-black leading-tight tracking-tight text-text-primary sm:text-4xl md:text-5xl lg:text-6xl md:leading-none"
      >
        <span>{title}</span>
        {highlight ? <span className="text-primary"> {highlight}</span> : null}
      </h2>
      {description ? (
        <p
          data-sh
          className={cn(
            "mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base md:text-lg",
            centered
              ? "mx-auto"
              : "ml-1.5 border-l-2 border-primary/50 pl-4 sm:ml-2 sm:pl-6"
          )}
        >
          {description}
        </p>
      ) : null}
    </SectionHeadingReveal>
  );
}
