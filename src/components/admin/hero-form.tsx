"use client";

import * as React from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroFormValues } from "@/features/hero/admin-schemas";
import { updateHero } from "@/features/hero/admin-mutations";
import type { AdminHero } from "@/features/hero/admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  EditorSectionSwitcher,
  type EditorSectionOption,
} from "@/components/admin/editor-section-switcher";
import {
  LocaleTabs,
  type EditorLocale,
} from "@/components/admin/locale-tabs";

type SectionKey = "headline" | "cta" | "metrics" | "tech";

const emptyTr = () => ({ en: "", de: "", fr: "", es: "" });

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

function toFormValues(hero: AdminHero): HeroFormValues {
  return {
    eyebrow_translations: tr(hero.eyebrow_translations),
    title_translations: tr(hero.title_translations),
    highlight_translations: tr(hero.highlight_translations),
    description_translations: tr(hero.description_translations),
    primary_cta_label_translations: tr(hero.primary_cta_label_translations),
    primary_cta_url: hero.primary_cta_url ?? "",
    secondary_cta_label_translations: tr(hero.secondary_cta_label_translations),
    secondary_cta_url: hero.secondary_cta_url ?? "",
    metrics:
      hero.metrics?.map((m) => ({
        value: m.value,
        label_translations: tr(m.label_translations),
      })) ?? [{ value: "", label_translations: emptyTr() }],
    tech_stack:
      hero.tech_stack?.map((t) => ({ name: t.name, icon: t.icon ?? "" })) ?? [],
    tech_stack_heading_translations: tr(hero.tech_stack_heading_translations),
    tech_stack_description_translations: tr(hero.tech_stack_description_translations),
    is_visible: hero.is_visible,
  };
}

export function HeroForm({ hero }: { hero: AdminHero }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [locale, setLocale] = React.useState<EditorLocale>("en");
  const [activeSection, setActiveSection] = React.useState<SectionKey>(
    "headline"
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: toFormValues(hero),
  });

  const isVisible = useWatch({ control, name: "is_visible" });
  const metricFields = useFieldArray({ control, name: "metrics" });
  const techFields = useFieldArray({ control, name: "tech_stack" });

  async function onSubmit(values: HeroFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateHero(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  const sectionOptions: EditorSectionOption<SectionKey>[] = [
    {
      key: "headline",
      label: "Headline",
      description: "Eyebrow, title, amber highlight, and description.",
      hasError: Boolean(errors.title_translations?.en),
    },
    {
      key: "cta",
      label: "Call-to-action buttons",
      description: "Primary and secondary button labels and URLs.",
      hasError: Boolean(errors.primary_cta_label_translations),
    },
    {
      key: "metrics",
      label: "Stat metrics",
      description: "Numbers shown under the hero, e.g. projects delivered.",
      action: (
        <button
          type="button"
          onClick={() =>
            metricFields.append({ value: "", label_translations: emptyTr() })
          }
          className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add metric
        </button>
      ),
    },
    {
      key: "tech",
      label: "Tech stack chips",
      description: "Technologies shown in the scrolling marquee.",
      action: (
        <button
          type="button"
          onClick={() => techFields.append({ name: "", icon: "" })}
          className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add chip
        </button>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Visibility */}
      <div className="flex items-center justify-between rounded-card border border-card-border bg-card-dark px-4 py-3.5 shadow-sm">
        <div>
          <p className="text-sm font-medium text-text-primary">Show hero on the homepage</p>
          <p className="mt-0.5 text-xs text-text-muted">Pause the hero without losing content.</p>
        </div>
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) => setValue("is_visible", checked)}
          aria-label="Hero visible"
        />
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
        {activeSection === "headline" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`eyebrow-${locale}`}>Eyebrow label</Label>
              <Input key={locale} id={`eyebrow-${locale}`} placeholder="Premium Digital Agency" {...register(`eyebrow_translations.${locale}`)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`title-${locale}`}>Title</Label>
              <Input key={locale} id={`title-${locale}`} placeholder="We Build Websites, Brands & Systems" {...register(`title_translations.${locale}`)} />
              {locale === "en" && errors.title_translations?.en?.message ? (
                <p className="mt-1 text-xs text-error">{errors.title_translations.en.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`highlight-${locale}`}>Amber highlight</Label>
              <Input key={locale} id={`highlight-${locale}`} placeholder="That Grow Businesses." {...register(`highlight_translations.${locale}`)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`description-${locale}`}>Description</Label>
              <Textarea key={locale} id={`description-${locale}`} rows={3} placeholder="We help startups and growing businesses…" {...register(`description_translations.${locale}`)} />
            </div>
          </div>
        ) : null}

        {activeSection === "cta" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`pcta-label-${locale}`}>Primary button label</Label>
              <Input key={locale} id={`pcta-label-${locale}`} placeholder="Start Your Project" {...register(`primary_cta_label_translations.${locale}`)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_cta_url">Primary button URL</Label>
              <Input id="primary_cta_url" placeholder="/contact" {...register("primary_cta_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`scta-label-${locale}`}>Secondary button label</Label>
              <Input key={locale} id={`scta-label-${locale}`} placeholder="View Our Work" {...register(`secondary_cta_label_translations.${locale}`)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_cta_url">Secondary button URL</Label>
              <Input id="secondary_cta_url" placeholder="/work" {...register("secondary_cta_url")} />
            </div>
          </div>
        ) : null}

        {activeSection === "metrics" ? (
          <div className="space-y-4">
            {metricFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-card border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => metricFields.remove(index)}
                    className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`metric-${index}-value`}>Value</Label>
                    <Input id={`metric-${index}-value`} placeholder="59+" {...register(`metrics.${index}.value`)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`metric-${index}-label-${locale}`}>Label ({locale.toUpperCase()})</Label>
                    <Input key={locale} id={`metric-${index}-label-${locale}`} placeholder="Projects Delivered" {...register(`metrics.${index}.label_translations.${locale}`)} />
                  </div>
                </div>
              </div>
            ))}
            {metricFields.fields.length === 0 ? (
              <p className="text-xs text-text-muted">No metrics yet — add one above.</p>
            ) : null}
          </div>
        ) : null}

        {activeSection === "tech" ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`ts-heading-${locale}`}>Tech stack heading ({locale.toUpperCase()})</Label>
                <Input key={locale} id={`ts-heading-${locale}`} placeholder="Built with modern tools" {...register(`tech_stack_heading_translations.${locale}`)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`ts-desc-${locale}`}>Tech stack description ({locale.toUpperCase()})</Label>
                <Input key={locale} id={`ts-desc-${locale}`} placeholder="The technologies behind our work" {...register(`tech_stack_description_translations.${locale}`)} />
              </div>
            </div>
            <div className="space-y-3">
              {techFields.fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-3">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`ts-${index}-name`}>Name</Label>
                      <Input id={`ts-${index}-name`} placeholder="Next.js" {...register(`tech_stack.${index}.name`)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`ts-${index}-icon`}>Icon label</Label>
                      <Input id={`ts-${index}-icon`} placeholder="▲" {...register(`tech_stack.${index}.icon`)} />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => techFields.remove(index)}
                    className="mt-6 text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {techFields.fields.length === 0 ? (
                <p className="text-xs text-text-muted">No tech stack chips yet — add one above.</p>
              ) : null}
            </div>
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

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save Hero"}
      </Button>
    </form>
  );
}
