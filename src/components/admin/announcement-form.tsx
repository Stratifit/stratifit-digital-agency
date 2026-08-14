"use client";

import * as React from "react";
import {
  useForm,
  useWatch,
  useFieldArray,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAnnouncement } from "@/features/announcement/admin-mutations";
import {
  announcementSchema,
  type AnnouncementFormValues,
} from "@/features/announcement/schemas";
import type { AdminAnnouncement } from "@/features/announcement/admin-queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";

const LOCALES = ["en", "de", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const VARIANT_LABELS: Record<string, string> = {
  primary: "Primary (amber)",
  neutral: "Neutral (muted)",
  ai: "AI highlight",
};

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

const emptyTr = () => ({ en: "", de: "", fr: "", es: "" });

function toFormValues(a: AdminAnnouncement | null | undefined): AnnouncementFormValues {
  return {
    slides:
      a?.slides && a.slides.length > 0 ? a.slides.map((s) => tr(s)) : [emptyTr()],
    link_label_translations: tr(a?.link_label_translations),
    link_url: a?.link_url ?? "",
    is_enabled: a?.is_enabled ?? false,
    starts_at: a?.starts_at ? a.starts_at.slice(0, 16) : "",
    ends_at: a?.ends_at ? a.ends_at.slice(0, 16) : "",
    variant: (a?.variant as AnnouncementFormValues["variant"]) ?? "primary",
  };
}

function LocaleTabs({
  value,
  onChange,
  idPrefix,
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
  idPrefix: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Language"
      className="flex overflow-hidden rounded-button border border-border"
    >
      {LOCALES.map((locale) => {
        const active = locale === value;
        return (
          <button
            key={locale}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${locale}`}
            aria-selected={active}
            aria-controls={`${idPrefix}-panel-${locale}`}
            onClick={() => onChange(locale)}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              active
                ? "bg-primary text-text-inverse"
                : "bg-card-dark text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            )}
          >
            {LOCALE_NAMES[locale]}
          </button>
        );
      })}
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h2 className="font-display text-base font-semibold text-text-primary">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      ) : null}
    </div>
  );
}

function SlideCard({
  index,
  register,
  canRemove,
  onRemove,
}: {
  index: number;
  register: UseFormRegister<AnnouncementFormValues>;
  canRemove: boolean;
  onRemove: () => void;
}) {
  const [locale, setLocale] = React.useState<Locale>("en");

  return (
    <div className="rounded-card border border-white/5 bg-background p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-text-secondary">
          Message {index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="text-xs font-medium text-text-muted transition-colors hover:text-error disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Remove
        </button>
      </div>

      <LocaleTabs value={locale} onChange={setLocale} idPrefix={`slide-${index}`} />

      <div className="mt-4 space-y-2" role="tabpanel" aria-labelledby={`slide-${index}-tab-${locale}`}>
        <Label htmlFor={`slide-${index}-${locale}`}>
          Message text ({LOCALE_NAMES[locale]})
        </Label>
        <Input
          id={`slide-${index}-${locale}`}
          placeholder="Now offering AI automation services — book a call"
          {...register(`slides.${index}.${locale}`)}
        />
      </div>
    </div>
  );
}

export function AnnouncementForm({
  announcement,
}: {
  announcement?: AdminAnnouncement | null;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);
  const [linkLocale, setLinkLocale] = React.useState<Locale>("en");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: toFormValues(announcement),
  });

  const isEnabled = useWatch({ control, name: "is_enabled" });
  const slideFields = useFieldArray({ control, name: "slides" });

  async function onSubmit(values: AnnouncementFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateAnnouncement(values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Enable toggle */}
      <div className="flex items-center justify-between gap-4 rounded-card border border-white/5 bg-background px-4 py-4">
        <div>
          <p className="text-sm font-medium text-text-primary">Show announcement bar</p>
          <p className="mt-0.5 text-xs text-text-muted">
            The bar appears above the header on every page.
          </p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={(checked) => setValue("is_enabled", checked)}
          aria-label="Announcement bar enabled"
        />
      </div>

      {/* Carousel messages */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading
            title="Carousel messages"
            description="Messages rotate automatically on the site. Each message is shown in the visitor's language."
          />
          <button
            type="button"
            onClick={() => slideFields.append(emptyTr())}
            className="rounded-button border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            + Add message
          </button>
        </div>

        <div className="space-y-3">
          {slideFields.fields.map((field, index) => (
            <SlideCard
              key={field.id}
              index={index}
              register={register}
              canRemove={slideFields.fields.length > 1}
              onRemove={() => slideFields.remove(index)}
            />
          ))}
        </div>

        {errors.slides?.message ? (
          <p role="alert" className="text-xs text-error">
            {errors.slides.message}
          </p>
        ) : null}
      </section>

      {/* Call-to-action link */}
      <section className="space-y-4">
        <SectionHeading
          title="Call-to-action link"
          description="An optional button inside the bar, with its own label per language."
        />

        <div className="rounded-card border border-white/5 bg-background p-5">
          <LocaleTabs value={linkLocale} onChange={setLinkLocale} idPrefix="link-label" />
          <div
            className="mt-4 space-y-2"
            role="tabpanel"
            aria-labelledby={`link-label-tab-${linkLocale}`}
          >
            <Label htmlFor={`link-label-${linkLocale}`}>
              Link label ({LOCALE_NAMES[linkLocale]})
            </Label>
            <Input
              id={`link-label-${linkLocale}`}
              placeholder="Learn more"
              {...register(`link_label_translations.${linkLocale}`)}
            />
          </div>
        </div>
      </section>

      {/* Link target & schedule */}
      <section className="space-y-4">
        <SectionHeading
          title="Link & schedule"
          description="Where the button points and when the bar is shown."
        />

        <div className="rounded-card border border-white/5 bg-background p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="link_url">Link URL</Label>
              <Input id="link_url" placeholder="/services" {...register("link_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="variant">Style</Label>
              <Select id="variant" {...register("variant")}>
                {Object.entries(VARIANT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="starts_at">Starts at</Label>
              <Input id="starts_at" type="datetime-local" {...register("starts_at")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ends_at">Ends at</Label>
              <Input id="ends_at" type="datetime-local" {...register("ends_at")} />
            </div>
          </div>
        </div>
      </section>

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

      <div className="flex justify-end border-t border-border pt-6">
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Announcement"}
        </Button>
      </div>
    </form>
  );
}
