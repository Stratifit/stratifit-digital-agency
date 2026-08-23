"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useWatch,
  type Control,
  type FieldValues,
  type UseFormSetValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  portfolioSchema,
  insightSchema,
  testimonialSchema,
  pricingSchema,
  faqSchema,
  type PortfolioFormValues,
  type InsightFormValues,
  type TestimonialFormValues,
  type PricingFormValues,
  type FaqFormValues,
} from "@/features/content/schemas";
import {
  savePortfolio,
  saveInsight,
  saveTestimonial,
  savePricing,
  saveFaq,
} from "@/features/content/save-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EditorSectionSwitcher } from "@/components/admin/editor-section-switcher";
import { LocaleTabs, type EditorLocale } from "@/components/admin/locale-tabs";
import { uploadMediaAsset } from "@/features/media/mutations";
import type { AdminServiceOption } from "@/features/content/admin-queries";

export type ContentType = "portfolio" | "insights" | "testimonials" | "pricing" | "faq";

interface ContentFormProps {
  type: ContentType;
  id?: string;
  initial?: Record<string, unknown>;
  /** Published services for the portfolio category dropdown. */
  services?: AdminServiceOption[];
}

type Locale = EditorLocale;

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const SCHEMAS: Record<ContentType, z.ZodTypeAny> = {
  portfolio: portfolioSchema,
  insights: insightSchema,
  testimonials: testimonialSchema,
  pricing: pricingSchema,
  faq: faqSchema,
};

const TITLES: Record<ContentType, string> = {
  portfolio: "Portfolio Project",
  insights: "Insight",
  testimonials: "Testimonial",
  pricing: "Pricing Plan",
  faq: "FAQ",
};function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

type GalleryItem = { media_id?: string; image_url: string };

/**
 * 6-slot image uploader for the work card grid. Uploads go to the
 * `portfolio-images` storage bucket; filled slots show a thumbnail with a
 * remove button, empty slots show a file picker.
 */
function PortfolioGalleryUploader({
  control,
  setValue,
}: {
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}) {
  const gallery = (useWatch({ control, name: "gallery" }) ?? []) as GalleryItem[];
  const [uploadingIndex, setUploadingIndex] = React.useState<number | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const addInputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const replaceInputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  async function handleFile(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("bucket", "portfolio-images");
      formData.set("alt_text", file.name);
      const result = await uploadMediaAsset(formData);
      if (result.success) {
        const next = [...gallery];
        while (next.length < 6) next.push({ image_url: "" });
        next[index] = { media_id: result.data.id, image_url: result.data.url };
        setValue("gallery", next);
        if (addInputRefs.current[index]) addInputRefs.current[index]!.value = "";
        if (replaceInputRefs.current[index]) replaceInputRefs.current[index]!.value = "";
      } else {
        setUploadError(result.error);
      }
    } catch {
      // Server actions can reject despite uploadMediaAsset returning results
      // (request body limits, network errors) — surface a message instead of
      // leaving the spinner stuck.
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploadingIndex(null);
    }
  }

  function handleRemove(index: number) {
    const next = [...gallery];
    next[index] = { image_url: "" };
    setValue("gallery", next);
    setUploadError(null);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }, (_, index) => gallery[index]).map(
          (slot, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-input border border-card-border bg-background"
            >
              {slot?.image_url ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail preview */}
                  <img
                    src={slot.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute right-1.5 top-1.5 rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white transition-colors hover:bg-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Remove
                  </button>
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1.5 pt-5">
                    <label className="cursor-pointer rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white transition-colors hover:bg-primary hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      Replace
                      <input
                        ref={(el) => {
                          replaceInputRefs.current[index] = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                        onChange={(e) => handleFile(index, e)}
                        className="sr-only"
                      />
                    </label>
                    <span className="rounded-sm bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      {index + 1}
                    </span>
                  </div>
                </>
              ) : (
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-center transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <input
                    ref={(el) => {
                      addInputRefs.current[index] = el;
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                    onChange={(e) => handleFile(index, e)}
                    className="sr-only"
                  />
                  <span className="text-[10px] font-medium text-text-muted">
                    Add image
                  </span>
                </label>
              )}
              {uploadingIndex === index ? (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-medium text-white">
                  Uploading…
                </span>
              ) : null}
            </div>
          )
        )}
      </div>
      {uploadError ? <p className="mt-2 text-xs text-error">{uploadError}</p> : null}
      <p className="mt-2 text-xs text-text-muted">
        Up to 6 images for the work card grid. The first image is the card
        cover; brand-design projects show a 2×2 grid of the first four.
      </p>
    </div>
  );
}

export function ContentForm({ type, id, initial, services = [] }: ContentFormProps) {
  const router = useRouter();
  const schema = SCHEMAS[type];
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [locale, setLocale] = React.useState<Locale>("en");
  const [activeSection, setActiveSection] = React.useState<"content" | "publishing">(
    "content"
  );
  const isEdit = Boolean(id);

  const defaultValues = React.useMemo(() => {
    if (!initial) return undefined;
    const d: Record<string, unknown> = {};
    if (type === "portfolio" || type === "insights" || type === "pricing") {
      d.slug = initial.slug ?? "";
      if (type !== "pricing") d.status = initial.status ?? "draft";
      else {
        d.display_order = initial.display_order ?? 0;
        d.is_visible = initial.is_visible ?? true;
        d.is_featured = initial.is_featured ?? false;
        d.status = initial.status ?? "draft";
      }
    }
    if (type === "portfolio") {
      d.client_name = initial.client_name ?? "";
      d.service_slug = initial.service_slug ?? "";
      d.gallery = initial.gallery ?? [];
      d.title_translations = tr(initial.title_translations as Record<string, string> | null);
      d.summary_translations = tr(initial.summary_translations as Record<string, string> | null);
      d.image_url = initial.image_url ?? "";
      d.seo_title_translations = tr(initial.seo_title_translations as Record<string, string> | null);
      d.seo_description_translations = tr(initial.seo_description_translations as Record<string, string> | null);
    }
    if (type === "insights") {
      d.title_translations = tr(initial.title_translations as Record<string, string> | null);
      d.excerpt_translations = tr(initial.excerpt_translations as Record<string, string> | null);
      d.reading_time_minutes = initial.reading_time_minutes ?? 5;
      d.seo_title_translations = tr(initial.seo_title_translations as Record<string, string> | null);
      d.seo_description_translations = tr(initial.seo_description_translations as Record<string, string> | null);
    }
    if (type === "testimonials") {
      d.person_name = initial.person_name ?? "";
      d.quote_translations = tr(initial.quote_translations as Record<string, string> | null);
      d.person_role_translations = tr(initial.person_role_translations as Record<string, string> | null);
      d.company_name = initial.company_name ?? "";
      d.source = initial.source ?? "website";
      d.is_visible = initial.is_visible ?? true;
      d.is_verified = initial.is_verified ?? false;
    }
    if (type === "pricing") {
      d.name_translations = tr(initial.name_translations as Record<string, string> | null);
      d.description_translations = tr(initial.description_translations as Record<string, string> | null);
      d.price_label_translations = tr(initial.price_label_translations as Record<string, string> | null);
      d.billing_label_translations = tr(initial.billing_label_translations as Record<string, string> | null);
      d.features_translations = {
        en: ((initial.features_translations as Record<string, unknown> | null)?.en as string[] | undefined) ?? [],
        de: ((initial.features_translations as Record<string, unknown> | null)?.de as string[] | undefined) ?? [],
        fr: ((initial.features_translations as Record<string, unknown> | null)?.fr as string[] | undefined) ?? [],
        es: ((initial.features_translations as Record<string, unknown> | null)?.es as string[] | undefined) ?? [],
      };
      d.cta_label_translations = tr(initial.cta_label_translations as Record<string, string> | null);
      d.cta_url = initial.cta_url ?? "";
    }
    if (type === "faq") {
      d.question_translations = tr(initial.question_translations as Record<string, string> | null);
      d.answer_translations = tr(initial.answer_translations as Record<string, string> | null);
      d.category = initial.category ?? "general";
      d.display_order = initial.display_order ?? 0;
      d.is_visible = initial.is_visible ?? true;
      d.is_ai_eligible = initial.is_ai_eligible ?? false;
      d.status = initial.status ?? "draft";
    }
    return d;
  }, [type, initial]);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      schema as z.ZodType<Record<string, unknown>, Record<string, unknown>>
    ),
    defaultValues,
  });
  async function onSubmit(values: unknown) {
    setServerError(null);
    let result;
    switch (type) {
      case "portfolio":
        result = await savePortfolio(values as PortfolioFormValues, id);
        break;
      case "insights":
        result = await saveInsight(values as InsightFormValues, id);
        break;
      case "testimonials":
        result = await saveTestimonial(values as TestimonialFormValues, id);
        break;
      case "pricing":
        result = await savePricing(values as PricingFormValues, id);
        break;
      case "faq":
        result = await saveFaq(values as FaqFormValues, id);
        break;
    }
    if (result.success) {
      const base = `/admin/content/${type}`;
      router.push(base);
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  const err = (name: string) =>
    (errors as Record<string, { message?: string }>)[name]?.message;

  const trErr = (field: string, l: Locale) => {
    const e = (errors as Record<string, { message?: string; [k: string]: unknown }>)[field];
    if (!e) return undefined;
    if (l === "en") {
      if (typeof e.message === "string" && e.message) return e.message;
      const en = e.en as { message?: string } | undefined;
      return en?.message;
    }
    const loc = e[l] as { message?: string } | undefined;
    return loc?.message;
  };

  const showSlug = type === "portfolio" || type === "insights" || type === "pricing";
  const showStatus = type !== "testimonials";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <EditorSectionSwitcher
        options={[
          { key: "content", label: "Content", description: "The visible content and its translations." },
          { key: "publishing", label: "Publishing", description: "Slug, status, order, and visibility." },
        ]}
        value={activeSection}
        onChange={setActiveSection}
        headerRight={
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium text-text-muted">Language</p>
            <LocaleTabs value={locale} onChange={setLocale} />
          </div>
        }
      >
        {activeSection === "content" ? (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
          {type === "portfolio" ? (
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input id="client_name" placeholder="Client" {...register("client_name")} />
              {err("client_name") ? <p className="text-sm text-error">{err("client_name")}</p> : null}
            </div>
          ) : null}

          {type === "portfolio" ? (
            <div className="space-y-2">
              <Label htmlFor="service_slug">Category</Label>
              <Select id="service_slug" defaultValue="" {...register("service_slug")}>
                <option value="">No category</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-text-muted">
                Shown as the badge on the work card.
              </p>
            </div>
          ) : null}

          {type === "portfolio" ? (
            <div className="space-y-2">
              <Label htmlFor="image_url">Cover Image URL (optional)</Label>
              <Input
                id="image_url"
                placeholder="https://images.unsplash.com/…"
                {...register("image_url")}
              />
            </div>
          ) : null}

          {type === "portfolio" || type === "insights" ? (
            <div className="space-y-2">
              <Label htmlFor={`title-${locale}`}>Title ({LOCALE_NAMES[locale]})</Label>
              <Input
                key={locale} id={`title-${locale}`}
                placeholder="Title"
                {...register(`title_translations.${locale}`)}
              />
              {trErr("title_translations", locale) ? (
                <p className="text-sm text-error">{trErr("title_translations", locale)}</p>
              ) : null}
            </div>
          ) : null}

          {type === "testimonials" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="person_name">Person Name</Label>
                <Input id="person_name" placeholder="Person" {...register("person_name")} />
                {err("person_name") ? <p className="text-sm text-error">{err("person_name")}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company (optional)</Label>
                <Input id="company_name" placeholder="Company" {...register("company_name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select id="source" {...register("source")}>
                  <option value="website">Website</option>
                  <option value="google">Google</option>
                </Select>
                <p className="text-xs text-text-muted">
                  Google reviews show a Google icon on the card.
                </p>
              </div>
            </>
          ) : null}

          {type === "pricing" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor={`name-${locale}`}>Name ({LOCALE_NAMES[locale]})</Label>
                <Input
                  key={locale} id={`name-${locale}`}
                  placeholder="Plan name"
                  {...register(`name_translations.${locale}`)}
                />
                {trErr("name_translations", locale) ? (
                  <p className="text-sm text-error">{trErr("name_translations", locale)}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`price-label-${locale}`}>Price Label ({LOCALE_NAMES[locale]})</Label>
                <Input
                  key={locale} id={`price-label-${locale}`}
                  placeholder="From $2,990"
                  {...register(`price_label_translations.${locale}`)}
                />
                {trErr("price_label_translations", locale) ? (
                  <p className="text-sm text-error">{trErr("price_label_translations", locale)}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`billing-label-${locale}`}>Billing Label ({LOCALE_NAMES[locale]})</Label>
                <Input
                  key={locale} id={`billing-label-${locale}`}
                  placeholder="/ project"
                  {...register(`billing_label_translations.${locale}`)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`cta-label-${locale}`}>CTA Label ({LOCALE_NAMES[locale]})</Label>
                <Input
                  key={locale} id={`cta-label-${locale}`}
                  placeholder="Get Started"
                  {...register(`cta_label_translations.${locale}`)}
                />
              </div>
            </>
          ) : null}

          {type === "faq" ? (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" placeholder="general" {...register("category")} />
              {err("category") ? <p className="text-sm text-error">{err("category")}</p> : null}
            </div>
          ) : null}

          {type === "pricing" ? (
            <div className="space-y-2">
              <Label htmlFor="cta_url">CTA URL (optional)</Label>
              <Input id="cta_url" placeholder="/contact" {...register("cta_url")} />
            </div>
          ) : null}

        </div>

        {type === "pricing" ? (
          <>
            <div className="mt-5 space-y-2">
              <Label htmlFor={`description-${locale}`}>
                Description ({LOCALE_NAMES[locale]})
              </Label>
              <Textarea
                key={locale} id={`description-${locale}`}
                rows={3}
                placeholder="Short plan description"
                {...register(`description_translations.${locale}`)}
              />
              {trErr("description_translations", locale) ? (
                <p className="text-sm text-error">
                  {trErr("description_translations", locale)}
                </p>
              ) : null}
            </div>
            <div className="mt-5 space-y-2">
              <Label htmlFor={`features-${locale}`}>
                Features ({LOCALE_NAMES[locale]})
              </Label>
              <Textarea
                key={locale} id={`features-${locale}`}
                rows={5}
                placeholder="One feature per line"
                value={
                  (getValues(
                    `features_translations.${locale}`
                  ) as string[] | undefined)?.join("\n") ?? ""
                }
                onChange={(e) =>
                  setValue(
                    `features_translations.${locale}` as const,
                    e.target.value.split("\n") as never
                  )
                }
              />
              <p className="text-xs text-text-muted">
                One feature per line — rendered as the plan checklist.
              </p>
            </div>
          </>
        ) : null}

        {type === "portfolio" || type === "insights" ? (
          <div className="mt-5 space-y-2">
            <Label htmlFor={`summary-${locale}`}>
              {type === "portfolio" ? "Summary" : "Excerpt"} ({LOCALE_NAMES[locale]})
            </Label>
            <Textarea
              key={locale} id={`summary-${locale}`}
              rows={3}
              placeholder={type === "portfolio" ? "Short summary" : "Short excerpt"}
              {...register(`${type === "portfolio" ? "summary_translations" : "excerpt_translations"}.${locale}`)}
            />
            {trErr(type === "portfolio" ? "summary_translations" : "excerpt_translations", locale) ? (
              <p className="text-sm text-error">
                {trErr(type === "portfolio" ? "summary_translations" : "excerpt_translations", locale)}
              </p>
            ) : null}
          </div>
        ) : null}

        {type === "portfolio" ? (
          <div className="mt-5 rounded-card border border-white/5 bg-background p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              Card images
            </p>
            <PortfolioGalleryUploader control={control} setValue={setValue} />
          </div>
        ) : null}

        {type === "portfolio" || type === "insights" ? (
          <div className="mt-5 rounded-card border border-white/5 bg-background p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              SEO ({LOCALE_NAMES[locale]})
            </p>
            <div className="space-y-2">
              <Label htmlFor={`seo-title-${locale}`}>SEO title</Label>
              <Input
                key={locale} id={`seo-title-${locale}`}
                placeholder="Title — Stratifit"
                {...register(`seo_title_translations.${locale}`)}
              />
              <Label htmlFor={`seo-description-${locale}`} className="mt-3 block">
                SEO description
              </Label>
              <Textarea
                key={locale} id={`seo-description-${locale}`}
                rows={2}
                placeholder="Short description for search engines…"
                {...register(`seo_description_translations.${locale}`)}
              />
              <p className="text-xs text-text-muted">
                Leave empty to use the item title and summary.
              </p>
            </div>
          </div>
        ) : null}

        {type === "testimonials" ? (
          <div className="mt-5 space-y-2">
            <Label htmlFor={`role-${locale}`}>Role ({LOCALE_NAMES[locale]})</Label>
            <Input
              key={locale} id={`role-${locale}`}
              placeholder="CEO, Founder, Marketing Lead…"
              {...register(`person_role_translations.${locale}`)}
            />
            <Label htmlFor={`quote-${locale}`} className="mt-4 block">
              Quote ({LOCALE_NAMES[locale]})
            </Label>
            <Textarea
              key={locale} id={`quote-${locale}`}
              rows={3}
              placeholder="Client quote"
              {...register(`quote_translations.${locale}`)}
            />
            {trErr("quote_translations", locale) ? (
              <p className="text-sm text-error">{trErr("quote_translations", locale)}</p>
            ) : null}
          </div>
        ) : null}

        {type === "faq" ? (
          <div className="mt-5 space-y-2">
            <Label htmlFor={`question-${locale}`}>Question ({LOCALE_NAMES[locale]})</Label>
            <Input
              key={locale} id={`question-${locale}`}
              placeholder="Question"
              {...register(`question_translations.${locale}`)}
            />
            {trErr("question_translations", locale) ? (
              <p className="text-sm text-error">{trErr("question_translations", locale)}</p>
            ) : null}
            <Label htmlFor={`answer-${locale}`} className="mt-4 block">
              Answer ({LOCALE_NAMES[locale]})
            </Label>
            <Textarea
              key={locale} id={`answer-${locale}`}
              rows={3}
              placeholder="Answer"
              {...register(`answer_translations.${locale}`)}
            />
            {trErr("answer_translations", locale) ? (
              <p className="text-sm text-error">{trErr("answer_translations", locale)}</p>
            ) : null}
          </div>
        ) : null}

          </div>
        ) : null}

        {activeSection === "publishing" ? (
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {showSlug ? (
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" placeholder="my-item" disabled={isEdit} {...register("slug")} />
                  {err("slug") ? <p className="text-sm text-error">{err("slug")}</p> : null}
                </div>
              ) : null}
              {type === "insights" ? (
                <div className="space-y-2">
                  <Label htmlFor="reading_time_minutes">Reading Time (minutes)</Label>
                  <Input
                    id="reading_time_minutes"
                    type="number"
                    min={1}
                    {...register("reading_time_minutes", { valueAsNumber: true })}
                  />
                </div>
              ) : null}
              {type === "pricing" || type === "faq" ? (
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min={0}
                    {...register("display_order", { valueAsNumber: true })}
                  />
                </div>
              ) : null}
              {showStatus ? (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" {...register("status")}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </Select>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-6">
              {type === "testimonials" ? (
                <>
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input type="checkbox" {...register("is_visible")} className="size-4" />
                    Visible
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input type="checkbox" {...register("is_verified")} className="size-4" />
                    Verified
                  </label>
                </>
              ) : null}
              {type === "pricing" ? (
                <>
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input type="checkbox" {...register("is_visible")} className="size-4" />
                    Visible
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input type="checkbox" {...register("is_featured")} className="size-4" />
                    Featured
                  </label>
                </>
              ) : null}
              {type === "faq" ? (
                <>
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input type="checkbox" {...register("is_visible")} className="size-4" />
                    Visible
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input type="checkbox" {...register("is_ai_eligible")} className="size-4" />
                    AI Eligible
                  </label>
                </>
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

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? "Save Changes" : `Create ${TITLES[type]}`}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push(`/admin/content/${type}`)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
