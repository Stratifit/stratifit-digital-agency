"use client";

import * as React from "react";
import {
  useForm,
  useWatch,
  useFieldArray,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sectionSettingsSchema,
  type SectionSettingsFormValues,
} from "@/features/section-settings/schemas";
import { updateSectionSettings } from "@/features/section-settings/mutations";
import type { AdminSectionSettings } from "@/features/section-settings/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SectionHeader } from "@/components/ui/section-header";
import {
  EditorSectionSwitcher,
  type EditorSectionOption,
} from "@/components/admin/editor-section-switcher";
import { LocaleTabs, type EditorLocale } from "@/components/admin/locale-tabs";
import { cn } from "@/lib/cn";
import type { PublicSectionSettings } from "@/features/section-settings/queries";

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

/** Sections whose editor also manages a closing call-to-action. */
const CTA_SECTIONS = new Set(["acquisition-cta"]);

/** Sections whose editor also manages a stats band (/work page). */
const STATS_SECTIONS = new Set(["portfolio"]);

/** Sections whose editor also manages a review summary band (/testimonials page). */
const REVIEW_SUMMARY_SECTIONS = new Set(["testimonials"]);

/** Sections whose editor also manages a tech-stack marquee. */
const TECH_STACK_SECTIONS = new Set(["tech-stack"]);

type SectionKey = "header" | "cta" | "stats" | "review" | "tech" | "seo";

function ReviewSummaryEditor({
  register,
  errors,
}: {
  register: UseFormRegister<SectionSettingsFormValues>;
  errors?: FieldErrors<SectionSettingsFormValues>["review_summary"];
}) {
  const fieldPrefix = "review_summary";
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}.rating`}>Client rating</Label>
          <Input
            id={`${fieldPrefix}.rating`}
            placeholder="4.9"
            aria-invalid={Boolean(errors?.rating)}
            {...register(`${fieldPrefix}.rating`)}
          />
          {errors?.rating ? (
            <p className="text-xs text-error">{errors.rating.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}.verifiedReviews`}>
            Verified client reviews
          </Label>
          <Input
            id={`${fieldPrefix}.verifiedReviews`}
            type="number"
            min={0}
            placeholder="47"
            {...register(`${fieldPrefix}.verifiedReviews`, {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}.googleRating`}>Google rating</Label>
          <Input
            id={`${fieldPrefix}.googleRating`}
            placeholder="4.9"
            aria-invalid={Boolean(errors?.googleRating)}
            {...register(`${fieldPrefix}.googleRating`)}
          />
          {errors?.googleRating ? (
            <p className="text-xs text-error">{errors.googleRating.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}.googleReviews`}>
            Google reviews
          </Label>
          <Input
            id={`${fieldPrefix}.googleReviews`}
            type="number"
            min={0}
            placeholder="18"
            {...register(`${fieldPrefix}.googleReviews`, {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${fieldPrefix}.googleReviewsUrl`}>
            Google reviews URL
          </Label>
          <Input
            id={`${fieldPrefix}.googleReviewsUrl`}
            placeholder="https://www.google.com/maps/…"
            {...register(`${fieldPrefix}.googleReviewsUrl`)}
          />
        </div>
      </div>
      <p className="text-xs text-text-muted">
        Ratings and review counts shown at the top of the reviews page.
      </p>
    </div>
  );
}

function TechStackEditor({
  register,
  fields,
  fieldErrors,
  onAppend,
  onRemove,
}: {
  register: UseFormRegister<SectionSettingsFormValues>;
  fields: { id: string }[];
  fieldErrors?: FieldErrors<SectionSettingsFormValues>["tech_stack"];
  onAppend: () => void;
  onRemove: (index: number) => void;
}) {
  const fieldPrefix = "tech_stack";
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${fieldPrefix}-${index}-name`}>Name</Label>
                <Input
                  id={`${fieldPrefix}-${index}-name`}
                  placeholder="Next.js"
                  aria-invalid={Boolean(fieldErrors?.[index]?.name)}
                  {...register(`${fieldPrefix}.${index}.name`)}
                />
                {fieldErrors?.[index]?.name ? (
                  <p className="text-xs text-error">
                    {fieldErrors[index]?.name?.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${fieldPrefix}-${index}-icon`}>
                  Icon label
                </Label>
                <Input
                  id={`${fieldPrefix}-${index}-icon`}
                  placeholder="code"
                  {...register(`${fieldPrefix}.${index}.icon`)}
                />
                <p className="text-xs text-text-muted">
                  One of: brush, zap, code, atom.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="mt-6 text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Remove
            </button>
          </div>
        ))}
        {fields.length === 0 ? (
          <p className="text-xs text-text-muted">
            No technologies yet — add one above.
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onAppend}
        className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add technology
      </button>
      <p className="text-xs text-text-muted">
        Technologies shown in the scrolling marquee under this section&apos;s
        heading.
      </p>
    </div>
  );
}

function StatsEditor({
  register,
  locale,
  errors,
}: {
  register: UseFormRegister<SectionSettingsFormValues>;
  locale: EditorLocale;
  errors?: FieldErrors<SectionSettingsFormValues>["stats"];
}) {
  const fieldPrefix = "stats";
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="rounded-card border border-white/5 bg-background p-4"
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
            Stat {index + 1}
          </p>
          <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}.${index}.value`}>Value</Label>
              <Input
                id={`${fieldPrefix}.${index}.value`}
                placeholder="50+"
                aria-invalid={Boolean(errors?.[index]?.value)}
                {...register(`${fieldPrefix}.${index}.value`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}.${index}.label_translations.${locale}`}>
                Label ({LOCALE_NAMES[locale]})
              </Label>
              <Input
                key={locale}
                id={`${fieldPrefix}.${index}.label_translations.${locale}`}
                placeholder="Projects delivered"
                {...register(
                  `${fieldPrefix}.${index}.label_translations.${locale}`
                )}
              />
            </div>
          </div>
        </div>
      ))}
      <p className="text-xs text-text-muted">
        Up to 3 stats. Leave a row empty to hide it.
      </p>
    </div>
  );
}

type LocaleRecord = { en: string; de: string; fr: string; es: string };

function translations(
  value: Record<string, string> | null | undefined
): LocaleRecord {
  const record = value ?? {};
  return {
    en: record.en ?? "",
    de: record.de ?? "",
    fr: record.fr ?? "",
    es: record.es ?? "",
  };
}

function hasReviewSummaryData(
  summary: AdminSectionSettings["review_summary"]
): boolean {
  if (!summary) return false;
  return (
    Boolean(summary.rating?.trim()) ||
    Boolean(summary.googleRating?.trim()) ||
    Boolean(summary.googleReviewsUrl?.trim()) ||
    (summary.verifiedReviews ?? 0) > 0 ||
    (summary.googleReviews ?? 0) > 0
  );
}

function toFormValues(settings: AdminSectionSettings): SectionSettingsFormValues {
  const reviewSummary = settings.review_summary;
  return {
    eyebrow_translations: translations(settings.eyebrow_translations),
    title_translations: translations(settings.title_translations),
    highlight_translations: translations(settings.highlight_translations),
    description_translations: translations(settings.description_translations),
    cta_label_translations: translations(settings.cta_label_translations),
    cta_url: settings.cta_url ?? "",
    stats: Array.isArray(settings.stats)
      ? settings.stats.map((stat) => ({
          value: stat.value ?? "",
          label_translations: translations(stat.label_translations),
        }))
      : [],
    // An empty stored band ({}) must stay undefined in the form — mapping it
    // to empty strings would fail validation and silently block saving for
    // every section that doesn't use the review summary.
    review_summary: hasReviewSummaryData(reviewSummary)
      ? {
          rating: reviewSummary?.rating ?? "",
          verifiedReviews: reviewSummary?.verifiedReviews ?? 0,
          googleRating: reviewSummary?.googleRating ?? "",
          googleReviews: reviewSummary?.googleReviews ?? 0,
          googleReviewsUrl: reviewSummary?.googleReviewsUrl ?? "",
        }
      : undefined,
    tech_stack: Array.isArray(settings.tech_stack)
      ? settings.tech_stack.map((item) => ({
          name: item.name ?? "",
          icon: item.icon ?? "",
        }))
      : [],
    seo_title_translations: translations(settings.seo_title_translations),
    seo_description_translations: translations(
      settings.seo_description_translations
    ),
    is_visible: settings.is_visible,
  };
}

export function SectionSettingsForm({
  settings,
}: {
  settings: AdminSectionSettings;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [frame, setFrame] = React.useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [previewAlign, setPreviewAlign] = React.useState<"left" | "center">(
    "left"
  );
  const [locale, setLocale] = React.useState<EditorLocale>("en");
  const [activeSection, setActiveSection] = React.useState<SectionKey>(
    "header"
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SectionSettingsFormValues>({
    resolver: zodResolver(sectionSettingsSchema),
    defaultValues: toFormValues(settings),
  });

  const isVisible = useWatch({ control, name: "is_visible" });
  const techFields = useFieldArray({ control, name: "tech_stack" });
  const eyebrowTranslations = useWatch({ control, name: "eyebrow_translations" });
  const titleTranslations = useWatch({ control, name: "title_translations" });
  const highlightTranslations = useWatch({
    control,
    name: "highlight_translations",
  });
  const descriptionTranslations = useWatch({
    control,
    name: "description_translations",
  });

  const previewSettings: PublicSectionSettings = {
    section_key: settings.section_key,
    label: settings.label,
    eyebrow_translations: eyebrowTranslations,
    title_translations: titleTranslations,
    highlight_translations: highlightTranslations,
    description_translations: descriptionTranslations,
    is_visible: isVisible,
  };

  async function onSubmit(values: SectionSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateSectionSettings(settings.section_key, values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  function onInvalid() {
    setSaved(false);
    setServerError("Please check the form for errors.");
  }

  const sectionOptions: EditorSectionOption<SectionKey>[] = [
    {
      key: "header",
      label: "Header",
      description: "Eyebrow, title, amber highlight, and description.",
      hasError: Boolean(errors.title_translations?.en),
    },
    ...(CTA_SECTIONS.has(settings.section_key)
      ? [
          {
            key: "cta" as const,
            label: "Call to action",
            description: "Button label and destination shown below this section.",
          },
        ]
      : []),
    ...(STATS_SECTIONS.has(settings.section_key)
      ? [
          {
            key: "stats" as const,
            label: "Stats band",
            description: "Numbers shown on the work page.",
          },
        ]
      : []),
    ...(REVIEW_SUMMARY_SECTIONS.has(settings.section_key)
      ? [
          {
            key: "review" as const,
            label: "Review summary band",
            description: "Ratings and counts shown at the top of the reviews page.",
          },
        ]
      : []),
    ...(TECH_STACK_SECTIONS.has(settings.section_key)
      ? [
          {
            key: "tech" as const,
            label: "Tech stack",
            description: "Technologies shown in the scrolling marquee.",
          },
        ]
      : []),
    {
      key: "seo",
      label: "Page SEO",
      description: "Search-engine title and description for this section's page.",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-8"
    >
      {/* Visibility toggle */}
      <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Show this section on the website
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            Hide it without deleting your content.
          </p>
        </div>
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) => setValue("is_visible", checked)}
          aria-label="Section visible"
        />
      </div>

      {/* Live preview */}
      <div className="rounded-card border border-card-border bg-card-dark p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-text-primary">
            Live preview
          </p>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-button border border-border">
              {(
                [
                  ["mobile", "Mobile"],
                  ["tablet", "Tablet"],
                  ["desktop", "Desktop"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFrame(key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    frame === key
                      ? "bg-primary text-text-inverse"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex overflow-hidden rounded-button border border-border">
              {(
                [
                  ["left", "Left"],
                  ["center", "Center"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreviewAlign(key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    previewAlign === key
                      ? "bg-primary text-text-inverse"
                      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto overflow-hidden rounded-card border border-border-subtle bg-background px-4 py-6 sm:px-6",
            frame === "mobile" && "max-w-[375px]",
            frame === "tablet" && "max-w-[768px]",
            frame === "desktop" && "w-full"
          )}
        >
          <SectionHeader
            settings={previewSettings}
            locale="en"
            align={previewAlign}
            splitHighlightFirstWord={
              settings.section_key === "tech-stack"
            }
          />
        </div>
      </div>

      <EditorSectionSwitcher
        options={sectionOptions}
        value={activeSection}
        onChange={setActiveSection}
        headerRight={
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium text-text-muted">Language</p>
            <LocaleTabs value={locale} onChange={setLocale} />
          </div>
        }
      >
        {activeSection === "header" ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`eyebrow-${locale}`}>Eyebrow label</Label>
                <Input
                  key={locale}
                  id={`eyebrow-${locale}`}
                  placeholder="Process"
                  {...register(`eyebrow_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`highlight-${locale}`}>Amber highlight</Label>
                <Input
                  key={locale}
                  id={`highlight-${locale}`}
                  placeholder="Work"
                  {...register(`highlight_translations.${locale}`)}
                />
                <p className="text-xs text-text-muted">
                  Shown in amber right after the title. Leave empty to skip.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`title-${locale}`}>Title</Label>
              <Input
                key={locale}
                id={`title-${locale}`}
                placeholder="How We"
                {...register(`title_translations.${locale}`)}
              />
              {errors.title_translations?.en?.message ? (
                <p className="mt-1 text-xs text-error">
                  {errors.title_translations.en.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${locale}`}>Description</Label>
              <Textarea
                key={locale}
                id={`description-${locale}`}
                rows={3}
                placeholder="A short sentence describing this section…"
                {...register(`description_translations.${locale}`)}
              />
            </div>
          </div>
        ) : null}

        {activeSection === "cta" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`cta-label-${locale}`}>
                Button label ({LOCALE_NAMES[locale]})
              </Label>
              <Input
                key={locale}
                id={`cta-label-${locale}`}
                placeholder="Schedule a Consultation"
                {...register(`cta_label_translations.${locale}`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta-url">Button URL</Label>
              <Input
                id="cta-url"
                placeholder="/contact"
                {...register("cta_url")}
              />
            </div>
          </div>
        ) : null}

        {activeSection === "stats" ? (
          <StatsEditor register={register} locale={locale} errors={errors.stats} />
        ) : null}

        {activeSection === "review" ? (
          <ReviewSummaryEditor
            register={register}
            errors={errors.review_summary}
          />
        ) : null}

        {activeSection === "tech" ? (
          <TechStackEditor
            register={register}
            fields={techFields.fields}
            fieldErrors={errors.tech_stack}
            onAppend={() => techFields.append({ name: "", icon: "" })}
            onRemove={(index) => techFields.remove(index)}
          />
        ) : null}

        {activeSection === "seo" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`seo-title-${locale}`}>SEO title</Label>
              <Input
                key={locale}
                id={`seo-title-${locale}`}
                placeholder="Our Work — Stratifit"
                {...register(`seo_title_translations.${locale}`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`seo-description-${locale}`}>
                SEO description
              </Label>
              <Textarea
                key={locale}
                id={`seo-description-${locale}`}
                rows={2}
                placeholder="Selected case studies and projects…"
                {...register(`seo_description_translations.${locale}`)}
              />
            </div>
            <p className="text-xs text-text-muted">
              Search-engine title and description for this section&apos;s page.
              Leave empty to use the built-in defaults.
            </p>
          </div>
        ) : null}
      </EditorSectionSwitcher>

      {serverError ? (
        <p role="alert" className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      {saved ? (
        <p role="status" className="rounded-card bg-success-soft px-3 py-2 text-sm text-success">
          Saved successfully.
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Section"}
        </Button>
      </div>
    </form>
  );
}
