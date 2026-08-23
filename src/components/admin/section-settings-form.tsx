"use client";

import * as React from "react";
import {
  useForm,
  useWatch,
  useFieldArray,
  type UseFormRegister,
  type Control,
  type UseFormSetValue,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sectionSettingsSchema,
  type SectionSettingsFormValues,
} from "@/features/section-settings/schemas";
import { updateSectionSettings } from "@/features/section-settings/mutations";
import { uploadMediaAsset } from "@/features/media/mutations";
import {
  mergeHighlightIntoTitle,
  splitTitleHighlight,
} from "@/features/section-settings/title-highlight";
import type { AdminSectionSettings } from "@/features/section-settings/queries";
import type { AdminPortfolioCard } from "@/features/content/admin-queries";
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

/** Sections whose editor also manages the 3x2 card image grids. */
const CARDS_SECTIONS = new Set(["portfolio"]);

type SectionKey =
  | "header"
  | "cta"
  | "stats"
  | "review"
  | "tech"
  | "cards"
  | "seo";

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

/**
 * Per-technology logo image uploader. Uploads to the `logos` storage bucket
 * and stores the media id + public URL on the tech_stack item. An uploaded
 * image overrides the code-side brand icon on the public website.
 */
function TechLogoImageUpload({
  control,
  index,
  setValue,
}: {
  control: Control<SectionSettingsFormValues>;
  index: number;
  setValue: UseFormSetValue<SectionSettingsFormValues>;
}) {
  const imageUrl = useWatch({
    control,
    name: `tech_stack.${index}.image_url`,
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
        setValue(`tech_stack.${index}.media_id`, result.data.id, {
          shouldDirty: true,
        });
        setValue(`tech_stack.${index}.image_url`, result.data.url, {
          shouldDirty: true,
        });
        if (inputRef.current) inputRef.current.value = "";
      } else {
        setError(result.error);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setValue(`tech_stack.${index}.media_id`, "", { shouldDirty: true });
    setValue(`tech_stack.${index}.image_url`, "", { shouldDirty: true });
    if (inputRef.current) inputRef.current.value = "";
    setError(null);
  }

  return (
    <div className="rounded-card border border-border bg-background p-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
        Logo image (optional)
      </p>
      {imageUrl ? (
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of the uploaded logo */}
          <img
            src={imageUrl}
            alt=""
            className="h-8 w-auto max-w-[120px] rounded-sm border border-border bg-white object-contain p-1"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
            onChange={handleFile}
            className="block w-full max-w-[180px] cursor-pointer rounded-input border border-card-border bg-card-dark text-[11px] text-text-secondary file:mr-2 file:cursor-pointer file:rounded-sm file:border-0 file:bg-primary file:px-2 file:py-1 file:text-[11px] file:font-medium file:text-text-inverse transition-[border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {uploading ? (
            <span className="text-[11px] text-text-muted">Uploading…</span>
          ) : null}
        </div>
      )}
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : null}
    </div>
  );
}

function TechStackEditor({
  register,
  control,
  setValue,
  fields,
  fieldErrors,
  onAppend,
  onRemove,
}: {
  register: UseFormRegister<SectionSettingsFormValues>;
  control: Control<SectionSettingsFormValues>;
  setValue: UseFormSetValue<SectionSettingsFormValues>;
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
            <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr]">
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
              <div className="!col-span-full">
                <TechLogoImageUpload
                  control={control}
                  index={index}
                  setValue={setValue}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="mt-6 shrink-0 text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        Technologies shown in the logo grid under this section&apos;s heading.
        Upload a logo image to override the code-side brand icon.
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

/**
 * One 3x2 grid slot on a portfolio card. Uploads directly to the
 * `portfolio-images` bucket (like the hero/tech logo uploaders) and stores
 * the media id + public URL on the form; the section save persists the rows.
 */
function PortfolioCardImageSlot({
  control,
  cardIndex,
  slotIndex,
  setValue,
}: {
  control: Control<SectionSettingsFormValues>;
  cardIndex: number;
  slotIndex: number;
  setValue: UseFormSetValue<SectionSettingsFormValues>;
}) {
  const value = useWatch({
    control,
    name: `cards.${cardIndex}.images.${slotIndex}`,
  });
  const imageUrl = value?.image_url;
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const addInputRef = React.useRef<HTMLInputElement>(null);
  const replaceInputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", "portfolio-images");
      formData.set("alt_text", file.name);
      const result = await uploadMediaAsset(formData);
      if (result.success) {
        setValue(`cards.${cardIndex}.images.${slotIndex}.media_id`, result.data.id, {
          shouldDirty: true,
        });
        setValue(`cards.${cardIndex}.images.${slotIndex}.image_url`, result.data.url, {
          shouldDirty: true,
        });
        if (addInputRef.current) addInputRef.current.value = "";
        if (replaceInputRef.current) replaceInputRef.current.value = "";
      } else {
        setError(result.error);
      }
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setValue(`cards.${cardIndex}.images.${slotIndex}.media_id`, "", {
      shouldDirty: true,
    });
    setValue(`cards.${cardIndex}.images.${slotIndex}.image_url`, "", {
      shouldDirty: true,
    });
    if (addInputRef.current) addInputRef.current.value = "";
    if (replaceInputRef.current) replaceInputRef.current.value = "";
    setError(null);
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-md border border-border bg-background">
      {imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of the uploaded card image */}
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remove image ${slotIndex + 1}`}
            className="absolute right-1 top-1 rounded-sm bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white transition-colors hover:bg-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Remove
          </button>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1.5 pt-5">
            <label className="cursor-pointer rounded-sm bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white transition-colors hover:bg-primary hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Replace
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                onChange={handleFile}
                className="sr-only"
              />
            </label>
            <span className="rounded-sm bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {slotIndex + 1}
            </span>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <label className="flex h-full w-full cursor-pointer items-center justify-center text-[10px] font-medium text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <input
              ref={addInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
              onChange={handleFile}
              className="sr-only"
            />
              + Upload
          </label>
        </div>
      )}
      {uploading ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-medium text-white">
          Uploading…
        </span>
      ) : null}
      {error ? (
        <p
          className={`absolute inset-x-0 truncate bg-black/80 px-1 text-[9px] text-error ${
            imageUrl ? "bottom-7" : "bottom-0"
          }`}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PortfolioCardsEditor({
  control,
  setValue,
}: {
  control: Control<SectionSettingsFormValues>;
  setValue: UseFormSetValue<SectionSettingsFormValues>;
}) {
  const cards = useWatch({ control, name: "cards" }) ?? [];

  if (cards.length === 0) {
    return (
      <p className="text-xs text-text-muted">
        No published work cards yet — publish portfolio projects first.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {cards.map((card, cardIndex) => (
        <div key={card.slug} className="rounded-card border border-white/5 bg-background p-4">
          <p className="mb-1 font-display text-sm font-semibold text-text-primary">
            {card.client_name || card.slug}
          </p>
          <p className="mb-1 text-xs text-text-muted">
            Upload up to 6 images — rendered as the 3×2 grid on this card.
            The first image is the card cover.
          </p>
          <p className="mb-4 rounded-sm border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-[11px] text-text-muted">
            Recommended size: <span className="font-semibold text-primary">1500 × 1000 px (3:2)</span> —
            fits the grid and the case-study page without cutting out
            important detail.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, slotIndex) => (
              <PortfolioCardImageSlot
                key={slotIndex}
                control={control}
                cardIndex={cardIndex}
                slotIndex={slotIndex}
                setValue={setValue}
              />
            ))}
          </div>
        </div>
      ))}
      <p className="text-xs text-text-muted">
        Images are uploaded to Supabase Storage and saved to the work card on
        this section&apos;s save. Empty slots are skipped.
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

const LOCALE_KEYS = ["en", "de", "fr", "es"] as const;

/** Splits every locale's raw title (with `<…>` markers) back into clean
 *  title + highlight translations for persistence. */
function splitTitleTranslations(values: SectionSettingsFormValues): {
  title_translations: Record<string, string>;
  highlight_translations: Record<string, string>;
} {
  const title_translations: Record<string, string> = {};
  const highlight_translations: Record<string, string> = {};
  for (const key of LOCALE_KEYS) {
    const parsed = splitTitleHighlight(values.title_translations[key] ?? "");
    title_translations[key] = parsed.title;
    highlight_translations[key] = parsed.highlight;
  }
  return { title_translations, highlight_translations };
}

function toFormValues(
  settings: AdminSectionSettings,
  cards?: AdminPortfolioCard[]
): SectionSettingsFormValues {
  const reviewSummary = settings.review_summary;
  // The stored highlight is folded into the title as a trailing `<…>` marker
  // so the whole heading is edited in a single field.
  const rawTitles = Object.fromEntries(
    LOCALE_KEYS.map((key) => [
      key,
      mergeHighlightIntoTitle(
        settings.title_translations?.[key],
        settings.highlight_translations?.[key]
      ),
    ])
  ) as SectionSettingsFormValues["title_translations"];
  return {
    eyebrow_translations: translations(settings.eyebrow_translations),
    title_translations: rawTitles,
    highlight_translations: translations(settings.highlight_translations),
    description_translations: translations(settings.description_translations),
    footnote_translations: translations(settings.footnote_translations),
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
          media_id: item.media_id ?? "",
          image_url: item.image_url ?? "",
        }))
      : [],
    // Each card keeps a fixed array of six slots (empty strings = empty slot);
    // the save drops empty slots before writing to portfolio_media.
    cards: Array.isArray(cards)
      ? cards.map((card) => ({
          slug: card.slug,
          client_name: card.client_name,
          images: Array.from({ length: 6 }).map((_, index) => ({
            media_id: card.images[index]?.media_id ?? "",
            image_url: card.images[index]?.image_url ?? "",
          })),
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
  cards,
}: {
  settings: AdminSectionSettings;
  cards?: AdminPortfolioCard[];
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
    defaultValues: toFormValues(settings, cards),
  });

  const isVisible = useWatch({ control, name: "is_visible" });
  const techFields = useFieldArray({ control, name: "tech_stack" });
  const eyebrowTranslations = useWatch({ control, name: "eyebrow_translations" });
  const titleTranslations = useWatch({ control, name: "title_translations" });
  const descriptionTranslations = useWatch({
    control,
    name: "description_translations",
  });

  // The raw titles contain `<…>` amber markers — strip them for the preview
  // and feed the extracted span as the highlight, mirroring the public render.
  const parsedPreview = Object.fromEntries(
    LOCALE_KEYS.map((key) => [
      key,
      splitTitleHighlight(titleTranslations?.[key] ?? ""),
    ])
  );

  const previewSettings: PublicSectionSettings = {
    section_key: settings.section_key,
    label: settings.label,
    eyebrow_translations: eyebrowTranslations,
    title_translations: Object.fromEntries(
      Object.entries(parsedPreview).map(([key, parsed]) => [key, parsed.title])
    ),
    highlight_translations: Object.fromEntries(
      Object.entries(parsedPreview).map(([key, parsed]) => [
        key,
        parsed.highlight,
      ])
    ),
    description_translations: descriptionTranslations,
    is_visible: isVisible,
  };

  async function onSubmit(values: SectionSettingsFormValues) {
    setServerError(null);
    setSaved(false);
    const { title_translations, highlight_translations } =
      splitTitleTranslations(values);
    const result = await updateSectionSettings(settings.section_key, {
      ...values,
      title_translations:
        title_translations as SectionSettingsFormValues["title_translations"],
      highlight_translations:
        highlight_translations as SectionSettingsFormValues["highlight_translations"],
    });
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
    ...(CARDS_SECTIONS.has(settings.section_key)
      ? [
          {
            key: "cards" as const,
            label: "Card images",
            description:
              "The 3x2 image grid shown on each work card — up to 6 images per card.",
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
              <Label htmlFor={`title-${locale}`}>Title</Label>
              <Input
                key={locale}
                id={`title-${locale}`}
                placeholder="Our Core <Services>"
                {...register(`title_translations.${locale}`)}
              />
              <p className="text-xs text-text-muted">
                Wrap the part that should appear in amber in angle brackets,
                e.g. <code className="text-text-secondary">Our Core &lt;Services&gt;</code>.
                Without brackets the whole title renders in the normal color.
              </p>
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
            <div className="space-y-2">
              <Label htmlFor={`footnote-${locale}`}>Footnote (optional)</Label>
              <Textarea
                key={locale}
                id={`footnote-${locale}`}
                rows={2}
                placeholder="Small disclaimer shown under the section, e.g. net prices…"
                {...register(`footnote_translations.${locale}`)}
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
        ) : null}        {activeSection === "tech" ? (
          <TechStackEditor
            register={register}
            control={control}
            setValue={setValue}
            fields={techFields.fields}
            fieldErrors={errors.tech_stack}
            onAppend={() => techFields.append({ name: "", icon: "" })}
            onRemove={(index) => techFields.remove(index)}
          />
        ) : null}

        {activeSection === "cards" ? (
          <PortfolioCardsEditor control={control} setValue={setValue} />
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
