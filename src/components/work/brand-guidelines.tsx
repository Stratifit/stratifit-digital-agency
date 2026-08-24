import { t } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";

/**
 * BrandGuidelines — "brand manual" bento board for brand-design case studies.
 *
 * Inspired by classic brand-guideline decks: a cover slide, contents, logo
 * suite, colour palette with usage ratio, type hierarchy, and a closing
 * thank-you card — built from the project's own wordmark and the approved
 * Stratifit design tokens.
 */

const C = {
  deep: "#070A10",
  surface: "#111827",
  primary: "#F59E0B",
  secondary: "#4F46E5",
  white: "#FFFFFF",
  ink: "#0A0A0A",
  primaryDark: "#B45309",
};

const FONT_DISPLAY = "Satoshi, Inter, system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** The brand monogram: ring + initial + check, matching BrandBoard's mark. */
function MarkBadge({
  initial,
  className,
  ring = "rgba(255,255,255,0.24)",
  letter = C.primary,
  check = C.primary,
}: {
  initial: string;
  className?: string;
  ring?: string;
  letter?: string;
  check?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke={ring}
        strokeWidth="2.5"
      />
      <text
        x="24"
        y="24.6"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT_DISPLAY}
        fontWeight={700}
        fontSize={19}
        fill={letter}
      >
        {initial}
      </text>
      <path
        d="M 30.8 36.4 l 3.6 3.6 l 8 -9.6"
        stroke={check}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

/** Small caps slide label with the guideline-deck tab marker. */
function SlideHeader({
  index,
  label,
  tone = "dark",
}: {
  index?: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <div className="relative flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={cn(
          "h-3.5 w-[3px] rounded-full",
          light ? "bg-black/60" : "bg-primary"
        )}
      />
      <span
        className={cn(
          "text-[10px] font-bold uppercase tracking-[0.25em]",
          light ? "text-black/70" : "text-text-subtle"
        )}
      >
        {label}
      </span>
      {index ? (
        <span
          aria-hidden="true"
          className={cn(
            "ml-auto font-display text-[10px] font-black",
            light ? "text-black/40" : "text-primary/40"
          )}
        >
          {index}
        </span>
      ) : null}
    </div>
  );
}

/** Wordmark text — first letter tinted, matching BrandBoard's wordmark. */
function WordmarkText({
  text,
  className,
  accentClass = "text-primary",
  restClass = "text-text-primary",
}: {
  text: string;
  className?: string;
  accentClass?: string;
  restClass?: string;
}) {
  return (
    <span className={cn("font-display font-black tracking-tight", className)}>
      <span className={accentClass}>{text.charAt(0)}</span>
      <span className={restClass}>{text.slice(1)}</span>
    </span>
  );
}

function PaletteDots() {
  const colors = [C.deep, C.surface, C.primary, C.secondary, C.white];
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      {colors.map((color) => (
        <span
          key={color}
          className="size-2.5 rounded-full border border-white/15"
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function BrandGuidelines({
  wordmark,
  summary,
  locale,
}: {
  wordmark: string;
  summary: string;
  locale: string;
}) {
  const initial = (wordmark || "B").trim().charAt(0).toUpperCase() || "B";

  const chapters = [
    { index: "01", label: t(locale, "workLogoSuite") },
    { index: "02", label: t(locale, "workColourPalette") },
    { index: "03", label: t(locale, "workTypography") },
    { index: "04", label: t(locale, "workApplications") },
  ];

  const swatches = [
    { name: "Deep", hex: C.deep },
    { name: "Surface", hex: C.surface },
    { name: "Primary", hex: C.primary },
    { name: "Secondary", hex: C.secondary },
    { name: "Text", hex: C.white },
  ];

  const logoTiles = [
    { bg: C.deep, border: "border-white/10", accent: "text-primary", rest: "text-white" },
    { bg: C.surface, border: "border-white/10", accent: "text-primary", rest: "text-white" },
    { bg: C.primary, border: "border-white/10", accent: "text-black", rest: "text-black" },
    { bg: C.secondary, border: "border-white/10", accent: "text-white", rest: "text-white" },
    { bg: C.white, border: "border-white/10", accent: "text-[#B45309]", rest: "text-black" },
    { bg: "transparent", border: "border-dashed border-white/25", accent: "text-primary", rest: "text-white" },
  ];

  const typeSamples = [
    {
      label: `${t(locale, "workHeading")} 1`,
      sample: wordmark,
      className:
        "font-display text-2xl font-black tracking-tight text-text-primary sm:text-3xl",
    },
    {
      label: `${t(locale, "workHeading")} 2`,
      sample: wordmark,
      className: "font-display text-xl font-bold text-text-primary",
    },
    {
      label: `${t(locale, "workHeading")} 3`,
      sample: wordmark,
      className: "text-base font-semibold text-text-primary",
    },
    {
      label: t(locale, "workBody"),
      sample: summary,
      className: "text-sm leading-relaxed text-text-secondary",
    },
  ];

  return (
    <>
      {/* Cover */}
      <article className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-8 md:col-span-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-[80px]"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MarkBadge initial={initial} className="size-9" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">
              {t(locale, "workBrandGuidelines")}
            </span>
          </div>
          <PaletteDots />
        </div>
        <div className="relative py-8">
          <WordmarkText
            text={wordmark}
            className="break-words text-5xl sm:text-6xl"
          />
          <div className="mt-4 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-primary/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">
              {t(locale, "workCaseStudy")}
            </span>
          </div>
        </div>
        <div className="relative flex items-end justify-between gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-subtle">
            {t(locale, "workIdentitySystem")}
          </span>
          <ArrowUpRight className="size-8 shrink-0 text-primary" />
        </div>
      </article>

      {/* Contents */}
      <article className="flex flex-col rounded-card-lg border border-white/10 bg-card-dark p-6">
        <SlideHeader index="00" label={t(locale, "workContents")} />
        <ul className="mt-5 flex-1">
          {chapters.map((chapter) => (
            <li
              key={chapter.index}
              className="flex items-center gap-4 border-b border-white/5 px-2 py-3 last:border-b-0"
            >
              <span className="font-display text-xs font-black text-primary/60">
                {chapter.index}
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {chapter.label}
              </span>
            </li>
          ))}
        </ul>
      </article>

      {/* Primary logo */}
      <article className="flex flex-col rounded-card-lg border border-white/10 bg-card-dark p-6">
        <SlideHeader index="01" label={t(locale, "workPrimaryLogo")} />
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="relative rounded-2xl border border-dashed border-white/20 p-6 sm:p-7">
            <MarkBadge initial={initial} className="size-16 sm:size-20" />
            <span
              aria-hidden="true"
              className="absolute -left-px -top-px size-2.5 border-l-2 border-t-2 border-primary/60"
            />
            <span
              aria-hidden="true"
              className="absolute -right-px -top-px size-2.5 border-r-2 border-t-2 border-primary/60"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-px -left-px size-2.5 border-b-2 border-l-2 border-primary/60"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-px -right-px size-2.5 border-b-2 border-r-2 border-primary/60"
            />
          </div>
        </div>
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-text-subtle">
          Grid · Proportion · Gesture
        </p>
      </article>

      {/* Logo variations */}
      <article className="flex flex-col rounded-card-lg border border-white/10 bg-card-dark p-6 md:col-span-2">
        <SlideHeader index="01" label={t(locale, "workLogoVariations")} />
        <div className="mt-5 grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
          {logoTiles.map((tile, i) => (
            <div
              key={i}
              className={cn(
                "flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border p-3",
                tile.border
              )}
              style={{ backgroundColor: tile.bg }}
            >
              <WordmarkText
                text={wordmark}
                className="truncate text-base sm:text-lg"
                accentClass={tile.accent}
                restClass={tile.rest}
              />
            </div>
          ))}
        </div>
      </article>

      {/* Colour palette */}
      <article className="flex flex-col rounded-card-lg border border-white/10 bg-card-dark p-6 lg:col-span-2">
        <SlideHeader index="02" label={t(locale, "workColourPalette")} />
        <div className="mt-5 flex flex-1 gap-3">
          {swatches.map((swatch) => (
            <div key={swatch.name} className="flex min-w-0 flex-1 flex-col">
              <div
                className="min-h-24 flex-1 rounded-xl border border-white/10 sm:min-h-32"
                style={{ backgroundColor: swatch.hex }}
              />
              <p className="mt-3 truncate text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
                {swatch.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-text-subtle">
                {swatch.hex}
              </p>
            </div>
          ))}
        </div>
      </article>

      {/* Colour usage */}
      <article className="flex flex-col rounded-card-lg border border-white/10 bg-card-dark p-6">
        <SlideHeader index="02" label={t(locale, "workColourUsage")} />
        <div className="flex flex-1 flex-col justify-center py-6">
          <div className="flex h-12 overflow-hidden rounded-full border border-white/10 sm:h-14">
            <span className="w-[60%]" style={{ backgroundColor: C.deep }} />
            <span className="w-[30%]" style={{ backgroundColor: C.primary }} />
            <span
              className="w-[10%] border-l border-white/10"
              style={{ backgroundColor: C.white }}
            />
          </div>
          <div
            className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle"
            aria-label="Colour usage ratio 60 / 30 / 10"
          >
            <span>60%</span>
            <span>30%</span>
            <span>10%</span>
          </div>
        </div>
      </article>

      {/* Type hierarchy */}
      <article className="flex flex-col rounded-card-lg border border-white/10 bg-card-dark p-6 sm:p-8 md:col-span-2">
        <SlideHeader index="03" label={t(locale, "workTypeHierarchy")} />
        <div className="mt-6 grid flex-1 gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
          <div className="flex items-center justify-center rounded-xl border border-white/5 bg-surface-soft px-10 py-6 sm:px-14">
            <span className="font-display text-7xl font-black tracking-tight text-text-primary sm:text-8xl">
              Aa
            </span>
          </div>
          <div className="flex min-w-0 flex-col justify-center divide-y divide-white/5">
            {typeSamples.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0 sm:gap-8"
              >
                <span className="w-20 shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle sm:w-24">
                  {row.label}
                </span>
                <span className={cn("min-w-0 truncate", row.className)}>
                  {row.sample}
                </span>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Thank you */}
      <article className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-card-lg bg-primary p-6 md:col-span-2 lg:col-span-1">
        <MarkBadge
          initial={initial}
          className="absolute -bottom-7 -right-7 size-36 opacity-20"
          ring="rgba(10,10,10,0.5)"
          letter={C.ink}
          check={C.ink}
        />
        <SlideHeader index="" label={t(locale, "workBrandGuidelines")} tone="light" />
        <div className="relative py-6">
          <p className="font-display text-4xl font-black tracking-tight text-[#0A0A0A]">
            {t(locale, "workThankYou")}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-black/40" />
            <WordmarkText
              text={wordmark}
              className="text-sm"
              accentClass="text-[#0A0A0A]"
              restClass="text-black/80"
            />
          </div>
        </div>
        <ArrowUpRight className="relative size-5 self-end text-black/60" />
      </article>
    </>
  );
}
