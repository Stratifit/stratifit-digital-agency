import Image from "next/image";
import type { BrandGuidelines } from "@/features/portfolio/brand-guidelines";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";
import { BrandBoard, type BrandBoardVariant } from "@/components/work/brand-board";
import { ProcessIcon } from "@/components/ui/process-icon";

/**
 * BrandGuidelinesDocument — the "logo guidelines" document for brand-design
 * case studies, inspired by classic guideline decks (cover, contents tab bar,
 * logo, variants, clearspace, colour palette, typography, UI components).
 *
 * Everything except the fixed section chrome is editable per project through
 * the CMS (portfolio_projects.brand_guidelines). Sections without uploaded
 * content fall back to generated brand boards and the approved design tokens
 * so the document always looks complete.
 */

interface DocumentSection {
  id: string;
  icon: string;
  label: string;
  visible: boolean;
}

function MarkSeal({ initial }: { initial: string }) {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary font-display text-base font-black text-[#0A0A0A]"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

function SectionHead({
  icon,
  label,
  index,
}: {
  icon: string;
  label: string;
  index: number;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span
          className="flex size-10 items-center justify-center rounded-card border border-primary/25 bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <ProcessIcon name={icon} className="size-5" />
        </span>
        <h3 className="font-display text-xl font-black tracking-tight text-text-primary sm:text-2xl">
          {label}
        </h3>
      </div>
      <span
        className="font-display text-sm font-black text-primary/40"
        aria-hidden="true"
      >
        {String(index).padStart(2, "0")}
      </span>
    </div>
  );
}

function VisualFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card-lg border border-white/10 bg-background-deep",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Fallback board used when a section has no uploaded image yet. */
function BoardFallback({
  variant,
  wordmark,
  className,
}: {
  variant: BrandBoardVariant;
  wordmark: string;
  className?: string;
}) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <BrandBoard variant={variant} wordmark={wordmark} className="absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function LogoSection({
  guidelines,
  wordmark,
  caption,
  locale,
}: {
  guidelines: BrandGuidelines;
  wordmark: string;
  caption: string;
  locale: string;
}) {
  const logoUrl = guidelines.logo_url;
  const captionText =
    resolveTranslation(guidelines.logo_caption_translations, locale) || caption;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-sm leading-relaxed text-text-muted md:text-base">
          {captionText}
        </p>
      </div>
      <VisualFrame className="aspect-[4/3]">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${wordmark} — ${t(locale, "workPrimaryLogo")}`}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-contain p-8 sm:p-12"
          />
        ) : (
          <BoardFallback variant="solution" wordmark={wordmark} className="absolute inset-0" />
        )}
      </VisualFrame>
    </div>
  );
}

function VariantsSection({
  guidelines,
  wordmark,
  locale,
}: {
  guidelines: BrandGuidelines;
  wordmark: string;
  locale: string;
}) {
  const variants = guidelines.variants;
  const tiles: { url: string; label: string }[] = variants.map((variant, index) => ({
    url: variant.image_url,
    label:
      resolveTranslation(variant.label_translations, locale) ||
      `${t(locale, "workVariant")} ${String(index + 1).padStart(2, "0")}`,
  }));

  // Fallback tile visuals — generated boards when no variants are uploaded.
  const fallbackBoards: BrandBoardVariant[] = ["mark", "pattern", "applications", "overview"];
  while (tiles.length < 4) {
    tiles.push({
      url: "",
      label: `${t(locale, "workVariant")} ${String(tiles.length + 1).padStart(2, "0")}`,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      {tiles.slice(0, 8).map((tile, index) => (
        <figure key={`${tile.label}-${index}`}>
          <VisualFrame className="aspect-square">
            {tile.url ? (
              <Image
                src={tile.url}
                alt={`${wordmark} — ${tile.label}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
              />
            ) : (
              <BoardFallback
                variant={fallbackBoards[index % fallbackBoards.length]}
                wordmark={wordmark}
                className="absolute inset-0"
              />
            )}
          </VisualFrame>
          <figcaption className="mt-2.5 flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
              {tile.label}
            </span>
            <span className="font-display text-[10px] font-black text-primary/40">
              {String(index + 1).padStart(2, "0")}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ClearspaceSection({
  guidelines,
  locale,
}: {
  guidelines: BrandGuidelines;
  locale: string;
}) {
  const rule = resolveTranslation(guidelines.clearspace_translations, locale);
  const minSize = resolveTranslation(guidelines.clearspace_min_size_translations, locale);
  const diagramUrl = guidelines.clearspace_url;

  if (!rule && !minSize && !diagramUrl) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {rule ? (
          <div className="rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-7">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="text-primary" aria-hidden="true">
                <ProcessIcon name="spacing" className="size-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {t(locale, "workClearspace")}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              {rule}
            </p>
          </div>
        ) : null}
        {minSize ? (
          <div className="rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-7">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="text-primary" aria-hidden="true">
                <ProcessIcon name="grid" className="size-5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                {t(locale, "workMinimumSize")}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-text-secondary md:text-base">
              {minSize}
            </p>
          </div>
        ) : null}
      </div>
      {diagramUrl ? (
        <VisualFrame className="aspect-[21/9]">
          <Image
            src={diagramUrl}
            alt={t(locale, "workClearspace")}
            fill
            sizes="100vw"
            className="object-contain p-6 sm:p-10"
          />
        </VisualFrame>
      ) : null}
    </div>
  );
}

const FALLBACK_COLORS = [
  { name: "Primary", hex: "#F59E0B", usage: "Accent — buttons, links, highlights" },
  { name: "Deep", hex: "#070A10", usage: "Background — hero and dark sections" },
  { name: "Surface", hex: "#111827", usage: "Surface — cards and panels" },
  { name: "Secondary", hex: "#4F46E5", usage: "Supporting accent — limited use" },
  { name: "Text", hex: "#FFFFFF", usage: "Text — primary copy on dark" },
];

function ColorsSection({
  guidelines,
  locale,
}: {
  guidelines: BrandGuidelines;
  locale: string;
}) {
  const swatches =
    guidelines.colors.length > 0
      ? guidelines.colors.map((color) => ({
          name: color.name || color.hex,
          hex: /^#[0-9a-fA-F]{6}$/.test(color.hex) ? color.hex : "#F59E0B",
          usage: resolveTranslation(color.usage_translations, locale),
        }))
      : FALLBACK_COLORS;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {swatches.slice(0, 10).map((swatch, index) => (
        <div
          key={`${swatch.name}-${index}`}
          className="overflow-hidden rounded-card-lg border border-white/10 bg-card-dark"
        >
          <div
            className="h-20 sm:h-24"
            style={{ backgroundColor: swatch.hex }}
            aria-label={`${swatch.name} ${swatch.hex}`}
          />
          <div className="border-t border-white/10 p-3.5 sm:p-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-bold text-text-primary">{swatch.name}</span>
              <span className="font-mono text-[10px] uppercase text-text-subtle">
                {swatch.hex}
              </span>
            </div>
            {swatch.usage ? (
              <p className="mt-1.5 text-[11px] leading-relaxed text-text-muted">
                {swatch.usage}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographySection({
  guidelines,
  wordmark,
  locale,
}: {
  guidelines: BrandGuidelines;
  wordmark: string;
  locale: string;
}) {
  const fontName = guidelines.primary_font || "Inter";
  const note = resolveTranslation(guidelines.typography_translations, locale);
  const weights =
    guidelines.weights.length > 0
      ? guidelines.weights.map((weight) => ({
          name: weight.name || weight.weight,
          weight: Number(weight.weight) || 400,
          sample: weight.sample || wordmark,
        }))
      : [
          { name: t(locale, "workRegular"), weight: 400, sample: wordmark },
          { name: t(locale, "workBold"), weight: 700, sample: wordmark },
        ];

  return (
    <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
      <div>
        <div
          aria-hidden="true"
          className="font-display text-7xl font-black leading-none tracking-tight text-text-primary sm:text-8xl"
        >
          Aa
        </div>
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
          {t(locale, "workTypeface")}
        </p>
        <p className="mt-1 font-display text-2xl font-black tracking-tight text-text-primary">
          {fontName}
        </p>
        {note ? (
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">{note}</p>
        ) : null}
      </div>
      <div className="divide-y divide-white/5 self-center border-y border-white/5">
        {weights.map((weight) => (
          <div
            key={weight.name}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              {weight.name}
            </span>
            <span
              className="font-display text-2xl tracking-tight text-text-primary sm:text-3xl"
              style={{ fontWeight: weight.weight }}
            >
              {weight.sample}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentsSection({
  guidelines,
  locale,
}: {
  guidelines: BrandGuidelines;
  locale: string;
}) {
  const components = guidelines.components;
  if (components.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {components.map((component, index) => {
        const title = resolveTranslation(component.title_translations, locale);
        const description = resolveTranslation(
          component.description_translations,
          locale
        );
        return (
          <article
            key={`${title}-${index}`}
            className="flex flex-col rounded-card-lg border border-white/10 bg-card-dark p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-card border border-primary/25 bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <ProcessIcon name={component.icon_name} className="size-5" />
              </span>
              {title ? (
                <h4 className="font-display text-base font-bold tracking-tight text-text-primary">
                  {title}
                </h4>
              ) : null}
            </div>
            {description ? (
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
                {description}
              </p>
            ) : null}
            {component.image_url ? (
              <VisualFrame className="mt-4 aspect-[4/3]">
                <Image
                  src={component.image_url}
                  alt={title || `${t(locale, "workUiComponents")} ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </VisualFrame>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Document                                                            */
/* ------------------------------------------------------------------ */

export function BrandGuidelinesDocument({
  guidelines,
  wordmark,
  summary,
  locale,
}: {
  guidelines: BrandGuidelines;
  wordmark: string;
  summary: string;
  locale: string;
}) {
  const initial = (wordmark || "B").trim().charAt(0).toUpperCase() || "B";
  const hasClearspace = Boolean(
    resolveTranslation(guidelines.clearspace_translations, locale) ||
      resolveTranslation(guidelines.clearspace_min_size_translations, locale) ||
      guidelines.clearspace_url
  );

  const sections: DocumentSection[] = [
    { id: "gl-logo", icon: "layers", label: t(locale, "workOurLogo"), visible: true },
    { id: "gl-variants", icon: "grid", label: t(locale, "workLogoVariants"), visible: true },
    { id: "gl-clearspace", icon: "spacing", label: t(locale, "workClearspace"), visible: hasClearspace },
    { id: "gl-colors", icon: "palette", label: t(locale, "workColourPalette"), visible: true },
    { id: "gl-typography", icon: "type", label: t(locale, "workTypography"), visible: true },
    { id: "gl-components", icon: "layout", label: t(locale, "workUiComponents"), visible: guidelines.components.length > 0 },
  ];
  const visibleSections = sections.filter((s) => s.visible);
  let sectionNumber = 0;
  const nextNumber = () => ++sectionNumber;

  return (
    <article className="overflow-hidden rounded-card-lg border border-white/10 bg-background-deep">
      {/* Document chrome — wordmark bar + contents tab bar */}
      <div className="border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <MarkSeal initial={initial} />
            <div>
              <p className="font-display text-lg font-black leading-none tracking-tight text-text-primary">
                {wordmark}
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.3em] text-text-muted">
                {t(locale, "workBrandGuidelines")}
              </p>
            </div>
          </div>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle sm:block">
            {String(visibleSections.length).padStart(2, "0")}{" "}
            {t(locale, "workContents")}
          </span>
        </div>

        <nav
          aria-label={t(locale, "workContents")}
          className="flex gap-2 overflow-x-auto px-5 pb-4 sm:px-7"
        >
          {visibleSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-card-dark px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ProcessIcon name={section.icon} className="size-3.5 text-primary" />
              {section.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Document body */}
      <div>
        <section
          id="gl-logo"
          className="scroll-mt-24 border-b border-white/5 px-5 py-10 sm:px-7 sm:py-12"
        >
          <SectionHead
            icon="layers"
            label={t(locale, "workOurLogo")}
            index={nextNumber()}
          />
          <LogoSection
            guidelines={guidelines}
            wordmark={wordmark}
            caption={summary}
            locale={locale}
          />
        </section>

        <section
          id="gl-variants"
          className="scroll-mt-24 border-b border-white/5 px-5 py-10 sm:px-7 sm:py-12"
        >
          <SectionHead
            icon="grid"
            label={t(locale, "workLogoVariants")}
            index={nextNumber()}
          />
          <VariantsSection guidelines={guidelines} wordmark={wordmark} locale={locale} />
        </section>

        {hasClearspace ? (
          <section
            id="gl-clearspace"
            className="scroll-mt-24 border-b border-white/5 px-5 py-10 sm:px-7 sm:py-12"
          >
            <SectionHead
              icon="spacing"
              label={t(locale, "workClearspace")}
              index={nextNumber()}
            />
            <ClearspaceSection guidelines={guidelines} locale={locale} />
          </section>
        ) : null}

        <section
          id="gl-colors"
          className="scroll-mt-24 border-b border-white/5 px-5 py-10 sm:px-7 sm:py-12"
        >
          <SectionHead
            icon="palette"
            label={t(locale, "workColourPalette")}
            index={nextNumber()}
          />
          <ColorsSection guidelines={guidelines} locale={locale} />
        </section>

        <section
          id="gl-typography"
          className="scroll-mt-24 border-b border-white/5 px-5 py-10 sm:px-7 sm:py-12"
        >
          <SectionHead
            icon="type"
            label={t(locale, "workTypography")}
            index={nextNumber()}
          />
          <TypographySection guidelines={guidelines} wordmark={wordmark} locale={locale} />
        </section>

        {guidelines.components.length > 0 ? (
          <section
            id="gl-components"
            className="scroll-mt-24 px-5 py-10 sm:px-7 sm:py-12"
          >
            <SectionHead
              icon="layout"
              label={t(locale, "workUiComponents")}
              index={nextNumber()}
            />
            <ComponentsSection guidelines={guidelines} locale={locale} />
          </section>
        ) : null}
      </div>
    </article>
  );
}
