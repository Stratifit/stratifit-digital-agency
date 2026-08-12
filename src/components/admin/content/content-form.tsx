"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { cn } from "@/lib/cn";

export type ContentType = "portfolio" | "insights" | "testimonials" | "pricing" | "faq";

interface ContentFormProps {
  type: ContentType;
  id?: string;
  initial?: Record<string, unknown>;
}

const LOCALES = ["en", "de", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

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

function LocaleTabs({
  value,
  onChange,
}: {
  value: Locale;
  onChange: (l: Locale) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={cn(
            "rounded-button px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            value === l
              ? "bg-primary/15 text-primary"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ContentForm({ type, id, initial }: ContentFormProps) {
  const router = useRouter();
  const schema = SCHEMAS[type];
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [locale, setLocale] = React.useState<Locale>("en");
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
      d.company_name = initial.company_name ?? "";
      d.is_visible = initial.is_visible ?? true;
      d.is_verified = initial.is_verified ?? false;
    }
    if (type === "pricing") {
      d.name_translations = tr(initial.name_translations as Record<string, string> | null);
      d.price_label_translations = tr(initial.price_label_translations as Record<string, string> | null);
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
      <div className="rounded-card border border-card-border bg-card-dark p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-text-primary">
            {TITLES[type]} — language
          </p>
          <LocaleTabs value={locale} onChange={setLocale} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {showSlug ? (
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="my-item" disabled={isEdit} {...register("slug")} />
              {err("slug") ? <p className="text-sm text-error">{err("slug")}</p> : null}
            </div>
          ) : null}

          {type === "portfolio" ? (
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input id="client_name" placeholder="Client" {...register("client_name")} />
              {err("client_name") ? <p className="text-sm text-error">{err("client_name")}</p> : null}
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
                id={`title-${locale}`}
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
            </>
          ) : null}

          {type === "pricing" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor={`name-${locale}`}>Name ({LOCALE_NAMES[locale]})</Label>
                <Input
                  id={`name-${locale}`}
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
                  id={`price-label-${locale}`}
                  placeholder="From $2,990"
                  {...register(`price_label_translations.${locale}`)}
                />
                {trErr("price_label_translations", locale) ? (
                  <p className="text-sm text-error">{trErr("price_label_translations", locale)}</p>
                ) : null}
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

        {type === "portfolio" || type === "insights" ? (
          <div className="mt-5 space-y-2">
            <Label htmlFor={`summary-${locale}`}>
              {type === "portfolio" ? "Summary" : "Excerpt"} ({LOCALE_NAMES[locale]})
            </Label>
            <Textarea
              id={`summary-${locale}`}
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

        {type === "portfolio" || type === "insights" ? (
          <div className="mt-5 rounded-card border border-white/5 bg-background p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              SEO ({LOCALE_NAMES[locale]})
            </p>
            <div className="space-y-2">
              <Label htmlFor={`seo-title-${locale}`}>SEO title</Label>
              <Input
                id={`seo-title-${locale}`}
                placeholder="Title — Stratifit"
                {...register(`seo_title_translations.${locale}`)}
              />
              <Label htmlFor={`seo-description-${locale}`} className="mt-3 block">
                SEO description
              </Label>
              <Textarea
                id={`seo-description-${locale}`}
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
            <Label htmlFor={`quote-${locale}`}>Quote ({LOCALE_NAMES[locale]})</Label>
            <Textarea
              id={`quote-${locale}`}
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
              id={`question-${locale}`}
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
              id={`answer-${locale}`}
              rows={3}
              placeholder="Answer"
              {...register(`answer_translations.${locale}`)}
            />
            {trErr("answer_translations", locale) ? (
              <p className="text-sm text-error">{trErr("answer_translations", locale)}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-6">
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
