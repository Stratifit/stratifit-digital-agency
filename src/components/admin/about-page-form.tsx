"use client";

import * as React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  aboutPageSchema,
  type AboutPageFormValues,
} from "@/features/about/schemas";
import { updateAboutPage } from "@/features/about/mutations";
import type { AdminAboutPage } from "@/features/about/queries";
import { ABOUT_ICON_OPTIONS } from "@/components/ui/about-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const LOCALES = ["en", "de", "fr", "es"] as const;

const LOCALE_NAMES: Record<(typeof LOCALES)[number], string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const emptyTranslations = () => ({ en: "", de: "", fr: "", es: "" });

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-md border border-border bg-background p-5">
      <div>
        <h3 className="font-display text-base font-semibold text-text-primary">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function LocaleFieldset({
  locale,
  children,
}: {
  locale: (typeof LOCALES)[number];
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-sm border border-border-subtle bg-background p-4">
      <legend className="px-2 text-sm font-semibold text-text-primary">
        {LOCALE_NAMES[locale]}
      </legend>
      <div className="space-y-3">{children}</div>
    </fieldset>
  );
}

function ErrorNote({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-error">{message}</p>;
}

export function AboutPageForm({ initial }: { initial: AdminAboutPage }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AboutPageFormValues>({
    resolver: zodResolver(aboutPageSchema),
    defaultValues: {
      eyebrow_translations: tr(initial.eyebrow_translations),
      title_translations: tr(initial.title_translations),
      highlight_translations: tr(initial.highlight_translations),
      intro_translations: tr(initial.intro_translations),
      stats: (initial.stats ?? []).map((stat) => ({
        icon: stat.icon ?? "bolt",
        value: stat.value ?? "",
        label_translations: tr(stat.label_translations),
      })),
      mission_translations: tr(initial.mission_translations),
      story_translations: tr(initial.story_translations),
      values: (initial.values ?? []).map((value) => ({
        icon: value.icon ?? "sparkles",
        title_translations: tr(value.title_translations),
        description_translations: tr(value.description_translations),
      })),
      team_translations: tr(initial.team_translations),
      cta_title_translations: tr(initial.cta_title_translations),
      cta_highlight_translations: tr(initial.cta_highlight_translations),
      cta_description_translations: tr(initial.cta_description_translations),
      cta_label_translations: tr(initial.cta_label_translations),
      cta_url: initial.cta_url ?? "",
      is_visible: initial.is_visible,
    },
  });

  const isVisible = useWatch({ control, name: "is_visible" });

  const stats = useFieldArray({ control, name: "stats" });
  const values = useFieldArray({ control, name: "values" });

  async function onSubmit(values: AboutPageFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateAboutPage(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Show this page
          </p>
          <p className="text-xs text-text-muted">
            Hide the About page content without deleting it.
          </p>
        </div>
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) => setValue("is_visible", checked)}
          aria-label="About page visible"
        />
      </div>

      <SectionCard
        title="Hero"
        description="Eyebrow, title, highlighted word, and intro paragraph."
      >
        {LOCALES.map((locale) => (
          <LocaleFieldset key={locale} locale={locale}>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`eyebrow-${locale}`}>Eyebrow</Label>
                <Input
                  id={`eyebrow-${locale}`}
                  placeholder="About"
                  {...register(`eyebrow_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`title-${locale}`}>Title</Label>
                <Input
                  id={`title-${locale}`}
                  placeholder="About "
                  {...register(`title_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`highlight-${locale}`}>
                  Highlighted word
                </Label>
                <Input
                  id={`highlight-${locale}`}
                  placeholder="Stratifit"
                  {...register(`highlight_translations.${locale}`)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`intro-${locale}`}>Intro</Label>
              <Textarea
                id={`intro-${locale}`}
                rows={2}
                placeholder="We are a premium digital agency…"
                {...register(`intro_translations.${locale}`)}
              />
            </div>
          </LocaleFieldset>
        ))}
      </SectionCard>

      <SectionCard
        title="Stats band"
        description="Animated metrics shown below the hero."
      >
        {stats.fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-md border border-border bg-background p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-display text-base font-semibold text-text-primary">
                Stat {index + 1}
              </h4>
              <Button
                type="button"
                variant="destructive"
                size="small"
                onClick={() => stats.remove(index)}
              >
                Remove
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`stat-icon-${index}`}>Icon</Label>
                <Select id={`stat-icon-${index}`} {...register(`stats.${index}.icon`)}>
                  {ABOUT_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor={`stat-value-${index}`}>Value</Label>
                <Input
                  id={`stat-value-${index}`}
                  placeholder="120+"
                  {...register(`stats.${index}.value`)}
                />
                <ErrorNote message={errors.stats?.[index]?.value?.message} />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {LOCALES.map((locale) => (
                <div key={locale} className="space-y-2">
                  <Label htmlFor={`stat-label-${index}-${locale}`}>
                    Label ({LOCALE_NAMES[locale]})
                  </Label>
                  <Input
                    id={`stat-label-${index}-${locale}`}
                    placeholder="Projects Delivered"
                    {...register(`stats.${index}.label_translations.${locale}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {errors.stats?.message ? (
          <p className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
            {errors.stats.message}
          </p>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            stats.append({
              icon: "bolt",
              value: "",
              label_translations: emptyTranslations(),
            })
          }
        >
          Add stat
        </Button>
      </SectionCard>

      <SectionCard
        title="Mission"
        description="One-sentence mission statement."
      >
        {LOCALES.map((locale) => (
          <LocaleFieldset key={locale} locale={locale}>
            <div className="space-y-2">
              <Label htmlFor={`mission-${locale}`}>Mission</Label>
              <Textarea
                id={`mission-${locale}`}
                rows={2}
                placeholder="To empower ambitious brands…"
                {...register(`mission_translations.${locale}`)}
              />
              <ErrorNote
                message={errors.mission_translations?.[locale]?.message}
              />
            </div>
          </LocaleFieldset>
        ))}
      </SectionCard>

      <SectionCard title="Story" description="The founding story.">
        {LOCALES.map((locale) => (
          <LocaleFieldset key={locale} locale={locale}>
            <div className="space-y-2">
              <Label htmlFor={`story-${locale}`}>Story</Label>
              <Textarea
                id={`story-${locale}`}
                rows={4}
                placeholder="Founded with a vision…"
                {...register(`story_translations.${locale}`)}
              />
              <ErrorNote message={errors.story_translations?.[locale]?.message} />
            </div>
          </LocaleFieldset>
        ))}
      </SectionCard>

      <SectionCard
        title="Values"
        description="The 'What We Stand For' grid items."
      >
        {values.fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-md border border-border bg-background p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-display text-base font-semibold text-text-primary">
                Value {index + 1}
              </h4>
              <Button
                type="button"
                variant="destructive"
                size="small"
                onClick={() => values.remove(index)}
              >
                Remove
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`value-icon-${index}`}>Icon</Label>
                <Select id={`value-icon-${index}`} {...register(`values.${index}.icon`)}>
                  {ABOUT_ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {LOCALES.map((locale) => (
                <div key={locale} className="space-y-2">
                  <Label htmlFor={`value-title-${index}-${locale}`}>
                    Title ({LOCALE_NAMES[locale]})
                  </Label>
                  <Input
                    id={`value-title-${index}-${locale}`}
                    placeholder="Precision"
                    {...register(`values.${index}.title_translations.${locale}`)}
                  />
                  <Label htmlFor={`value-description-${index}-${locale}`}>
                    Description ({LOCALE_NAMES[locale]})
                  </Label>
                  <Textarea
                    id={`value-description-${index}-${locale}`}
                    rows={2}
                    placeholder="Every pixel, every line of code…"
                    {...register(
                      `values.${index}.description_translations.${locale}`
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {errors.values?.message ? (
          <p className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
            {errors.values.message}
          </p>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            values.append({
              icon: "sparkles",
              title_translations: emptyTranslations(),
              description_translations: emptyTranslations(),
            })
          }
        >
          Add value
        </Button>
      </SectionCard>

      <SectionCard title="Team" description="Team introduction copy.">
        {LOCALES.map((locale) => (
          <LocaleFieldset key={locale} locale={locale}>
            <div className="space-y-2">
              <Label htmlFor={`team-${locale}`}>Team copy</Label>
              <Textarea
                id={`team-${locale}`}
                rows={4}
                placeholder="We are strategists, designers, engineers…"
                {...register(`team_translations.${locale}`)}
              />
              <ErrorNote message={errors.team_translations?.[locale]?.message} />
            </div>
          </LocaleFieldset>
        ))}
      </SectionCard>

      <SectionCard
        title="Call to action"
        description="Closing CTA block and its link."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cta_url">CTA URL</Label>
            <Input
              id="cta_url"
              placeholder="/contact"
              {...register("cta_url")}
            />
          </div>
        </div>
        {LOCALES.map((locale) => (
          <LocaleFieldset key={locale} locale={locale}>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`cta-title-${locale}`}>Title</Label>
                <Input
                  id={`cta-title-${locale}`}
                  placeholder="Ready to Work "
                  {...register(`cta_title_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cta-highlight-${locale}`}>
                  Highlighted word
                </Label>
                <Input
                  id={`cta-highlight-${locale}`}
                  placeholder="Together?"
                  {...register(`cta_highlight_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cta-label-${locale}`}>Button label</Label>
                <Input
                  id={`cta-label-${locale}`}
                  placeholder="Start Your Project"
                  {...register(`cta_label_translations.${locale}`)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`cta-description-${locale}`}>Description</Label>
              <Textarea
                id={`cta-description-${locale}`}
                rows={2}
                placeholder="Let's build something exceptional."
                {...register(`cta_description_translations.${locale}`)}
              />
            </div>
          </LocaleFieldset>
        ))}
      </SectionCard>

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

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save About Page"}
      </Button>
    </form>
  );
}
