"use client";

import * as React from "react";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sectionSettingsSchema,
  SUPPORTED_LOCALES,
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

function ReviewSummaryEditor({
  register,
}: {
  register: UseFormRegister<SectionSettingsFormValues>;
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
            {...register(`${fieldPrefix}.rating`)}
          />
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
            {...register(`${fieldPrefix}.googleRating`)}
          />
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

function StatsEditor({
  register,
}: {
  register: UseFormRegister<SectionSettingsFormValues>;
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
                {...register(`${fieldPrefix}.${index}.value`)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${fieldPrefix}.${index}.label_translations.en`}>
                Label
              </Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUPPORTED_LOCALES.map((locale) => (
                  <Input
                    key={locale}
                    placeholder={LOCALE_NAMES[locale]}
                    {...register(
                      `${fieldPrefix}.${index}.label_translations.${locale}`
                    )}
                  />
                ))}
              </div>
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

function toFormValues(settings: AdminSectionSettings): SectionSettingsFormValues {
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
    review_summary: settings.review_summary
      ? {
          rating: settings.review_summary.rating ?? "",
          verifiedReviews: settings.review_summary.verifiedReviews ?? 0,
          googleRating: settings.review_summary.googleRating ?? "",
          googleReviews: settings.review_summary.googleReviews ?? 0,
          googleReviewsUrl: settings.review_summary.googleReviewsUrl ?? "",
        }
      : undefined,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
          />
        </div>
      </div>

      {/* Locale fieldsets */}
      <div className="space-y-6">
        {SUPPORTED_LOCALES.map((locale) => (
          <fieldset
            key={locale}
            className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm"
          >
            <legend className="px-2 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              {LOCALE_NAMES[locale]}
            </legend>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`eyebrow-${locale}`}>Eyebrow label</Label>
                  <Input
                    id={`eyebrow-${locale}`}
                    placeholder="Process"
                    {...register(`eyebrow_translations.${locale}`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`highlight-${locale}`}>
                    Amber highlight
                  </Label>
                  <Input
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
                  id={`description-${locale}`}
                  rows={3}
                  placeholder="A short sentence describing this section…"
                  {...register(`description_translations.${locale}`)}
                />
              </div>
            </div>
          </fieldset>
        ))}
      </div>

      {/* Optional closing call-to-action */}
      {CTA_SECTIONS.has(settings.section_key) ? (
        <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-text-primary">
              Closing call to action
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Button label and destination shown below this section.
            </p>
          </div>
          <div className="space-y-4">
            {SUPPORTED_LOCALES.map((locale) => (
              <div key={locale} className="space-y-2">
                <Label htmlFor={`cta-label-${locale}`}>
                  Button label ({LOCALE_NAMES[locale]})
                </Label>
                <Input
                  id={`cta-label-${locale}`}
                  placeholder="Schedule a Consultation"
                  {...register(`cta_label_translations.${locale}`)}
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="cta-url">Button URL</Label>
              <Input
                id="cta-url"
                placeholder="/contact"
                {...register("cta_url")}
              />
            </div>
          </div>
        </div>
      ) : null}

      {/* Optional stats band (portfolio section drives /work) */}
      {STATS_SECTIONS.has(settings.section_key) ? (
        <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-text-primary">
              Stats band
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Numbers shown on the work page. Add or remove stats freely.
            </p>
          </div>

          <StatsEditor register={register} />
        </div>
      ) : null}

      {/* Optional review summary band (testimonials section drives /testimonials) */}
      {REVIEW_SUMMARY_SECTIONS.has(settings.section_key) ? (
        <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-display text-base font-semibold text-text-primary">
              Review summary band
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              Ratings and review counts shown at the top of the reviews page.
            </p>
          </div>

          <ReviewSummaryEditor register={register} />
        </div>
      ) : null}

      {/* Page SEO metadata (title + description in all locales) */}
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-display text-base font-semibold text-text-primary">
            Page SEO
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Search-engine title and description for this section&apos;s page.
            Leave empty to use the built-in defaults.
          </p>
        </div>
        <div className="space-y-4">
          {SUPPORTED_LOCALES.map((locale) => (
            <div
              key={locale}
              className="rounded-card border border-white/5 bg-background p-4"
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
                {LOCALE_NAMES[locale]}
              </p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor={`seo-title-${locale}`}>SEO title</Label>
                  <Input
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
                    id={`seo-description-${locale}`}
                    rows={2}
                    placeholder="Selected case studies and projects…"
                    {...register(`seo_description_translations.${locale}`)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
