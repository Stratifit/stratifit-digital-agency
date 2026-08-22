"use client";

import * as React from "react";
import {
  useForm,
  useWatch,
  useFieldArray,
  type Control,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { heroSchema, type HeroFormValues } from "@/features/hero/admin-schemas";
import { updateHero } from "@/features/hero/admin-mutations";
import type { AdminHero } from "@/features/hero/admin-queries";
import { DEFAULT_TRUSTED_BY } from "@/features/hero/defaults";
import { uploadMediaAsset } from "@/features/media/mutations";
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

type SectionKey = "headline" | "cta" | "metrics" | "trusted";

const emptyTr = () => ({ en: "", de: "", fr: "", es: "" });

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

/**
 * Per-logo image uploader: uploads a file to the `logos` storage bucket and
 * stores the media id + public URL on the trusted_by item. An uploaded image
 * overrides the icon on the public website.
 */
function TrustedLogoImageUpload({
  control,
  index,
  setValue,
}: {
  control: Control<HeroFormValues>;
  index: number;
  setValue: UseFormSetValue<HeroFormValues>;
}) {
  const imageUrl = useWatch({
    control,
    name: `trusted_by.${index}.image_url`,
  });
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", "logos");
      formData.set("alt_text", file.name);
      const result = await uploadMediaAsset(formData);
      if (result.success) {
        setValue(`trusted_by.${index}.media_id`, result.data.id, {
          shouldDirty: true,
        });
        setValue(`trusted_by.${index}.image_url`, result.data.url, {
          shouldDirty: true,
        });
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setError(result.error);
      }
    } catch {
      // The server action can still reject despite uploadMediaAsset returning
      // results (e.g. request body limits on the proxy, network errors). Show
      // a message instead of leaving the spinner stuck forever.
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setValue(`trusted_by.${index}.media_id`, "", { shouldDirty: true });
    setValue(`trusted_by.${index}.image_url`, "", { shouldDirty: true });
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
  }

  return (
    <div className="rounded-card border border-border bg-background p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
        Logo image (optional)
      </p>
      {imageUrl ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of the uploaded logo */}
          <img
            src={imageUrl}
            alt=""
            className="h-10 w-auto max-w-[160px] rounded-sm border border-border bg-white object-contain p-1"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Remove image
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
            onChange={handleFile}
            className="block w-full max-w-xs cursor-pointer rounded-input border border-card-border bg-card-dark text-xs text-text-secondary file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-text-inverse transition-[border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {uploading ? (
            <span className="text-xs text-text-muted">Uploading…</span>
          ) : null}
        </div>
      )}
      {error ? (
        <p className="mt-2 text-xs text-error">{error}</p>
      ) : null}
      <p className="mt-2 text-xs text-text-muted">
        Upload an image logo (max 10 MB, JPG/PNG/WebP/GIF/SVG/AVIF). When set,
        it replaces the icon on the website.
      </p>
    </div>
  );
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
    // Pre-fill the canonical logos while migration 00058 is pending; an
    // explicitly cleared strip stays empty.
    trusted_by: hero.trusted_by ?? DEFAULT_TRUSTED_BY,
    trusted_by_label_translations: tr(hero.trusted_by_label_translations),
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
  const trustedFields = useFieldArray({ control, name: "trusted_by" });

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
      key: "trusted",
      label: "Trusted by logos",
      description: "Client logos shown under the hero stats.",
      action: (
        <button
          type="button"
          onClick={() => trustedFields.append({ name: "", icon: "" })}
          className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          + Add logo
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

        {activeSection === "trusted" ? (
          <div className="space-y-4">
            {trustedFields.fields.map((field, index) => (
              <div key={field.id} className="rounded-card border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => trustedFields.remove(index)}
                    className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`trusted-${index}-name`}>Logo name</Label>
                    <Input id={`trusted-${index}-name`} placeholder="LUMEN" {...register(`trusted_by.${index}.name`)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`trusted-${index}-icon`}>Icon</Label>
                    <Input id={`trusted-${index}-icon`} placeholder="lumen" {...register(`trusted_by.${index}.icon`)} />
                    <p className="text-xs text-text-muted">
                      One of: lumen, novus, pulse, vertex, orbit, nexus. Used
                      only when no logo image is uploaded.
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <TrustedLogoImageUpload
                    control={control}
                    index={index}
                    setValue={setValue}
                  />
                </div>
              </div>
            ))}
            {trustedFields.fields.length === 0 ? (
              <p className="text-xs text-text-muted">No logos yet — add one above.</p>
            ) : null}

            <div className="mt-4 space-y-2">
              <Label htmlFor={`trusted-label-${locale}`}>Strip label</Label>
              <Input
                key={locale}
                id={`trusted-label-${locale}`}
                placeholder="Trusted by <Growing> Companies"
                {...register(`trusted_by_label_translations.${locale}`)}
              />
              <p className="text-xs text-text-muted">
                Text shown above the logos. Wrap the amber word in angle
                brackets, e.g.{" "}
                <code className="text-text-secondary">
                  Trusted by &lt;Growing&gt; Companies
                </code>
                .
              </p>
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
