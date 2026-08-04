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

export type ContentType = "portfolio" | "insights" | "testimonials" | "pricing" | "faq";

interface ContentFormProps {
  type: ContentType;
  id?: string;
  initial?: Record<string, unknown>;
}

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
};

export function ContentForm({ type, id, initial }: ContentFormProps) {
  const router = useRouter();
  const schema = SCHEMAS[type];
  const [serverError, setServerError] = React.useState<string | null>(null);
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
      d.title = (initial.title_translations as Record<string, string>)?.en ?? "";
      d.summary = (initial.summary_translations as Record<string, string>)?.en ?? "";
    }
    if (type === "insights") {
      d.title = (initial.title_translations as Record<string, string>)?.en ?? "";
      d.excerpt = (initial.excerpt_translations as Record<string, string>)?.en ?? "";
      d.reading_time_minutes = initial.reading_time_minutes ?? 5;
    }
    if (type === "testimonials") {
      d.person_name = initial.person_name ?? "";
      d.quote = (initial.quote_translations as Record<string, string>)?.en ?? "";
      d.company_name = initial.company_name ?? "";
      d.is_visible = initial.is_visible ?? true;
      d.is_verified = initial.is_verified ?? false;
    }
    if (type === "pricing") {
      d.name = (initial.name_translations as Record<string, string>)?.en ?? "";
      d.price_label = (initial.price_label_translations as Record<string, string>)?.en ?? "";
    }
    if (type === "faq") {
      d.question = (initial.question_translations as Record<string, string>)?.en ?? "";
      d.answer = (initial.answer_translations as Record<string, string>)?.en ?? "";
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
        result = await savePortfolio(values as never, id as string | undefined);
        break;
      case "insights":
        result = await saveInsight(values as never, id as string | undefined);
        break;
      case "testimonials":
        result = await saveTestimonial(values as never, id as string | undefined);
        break;
      case "pricing":
        result = await savePricing(values as never, id as string | undefined);
        break;
      case "faq":
        result = await saveFaq(values as never, id as string | undefined);
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

  const showSlug = type === "portfolio" || type === "insights" || type === "pricing";
  const showStatus = type !== "testimonials";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        {type === "portfolio" || type === "insights" ? (
          <div className="space-y-2">
            <Label htmlFor="title">Title (English)</Label>
            <Input id="title" placeholder="Title" {...register("title")} />
            {err("title") ? <p className="text-sm text-error">{err("title")}</p> : null}
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
              <Label htmlFor="name">Name (English)</Label>
              <Input id="name" placeholder="Plan name" {...register("name")} />
              {err("name") ? <p className="text-sm text-error">{err("name")}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_label">Price Label (English)</Label>
              <Input id="price_label" placeholder="From $2,990" {...register("price_label")} />
              {err("price_label") ? <p className="text-sm text-error">{err("price_label")}</p> : null}
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
        <div className="space-y-2">
          <Label htmlFor="summary">Summary / Excerpt (English)</Label>
          <Textarea
            id="summary"
            placeholder={type === "portfolio" ? "Short summary" : "Short excerpt"}
            {...register(type === "portfolio" ? "summary" : "excerpt")}
          />
          {err(type === "portfolio" ? "summary" : "excerpt") ? (
            <p className="text-sm text-error">
              {err(type === "portfolio" ? "summary" : "excerpt")}
            </p>
          ) : null}
        </div>
      ) : null}

      {type === "testimonials" ? (
        <div className="space-y-2">
          <Label htmlFor="quote">Quote (English)</Label>
          <Textarea id="quote" placeholder="Client quote" {...register("quote")} />
          {err("quote") ? <p className="text-sm text-error">{err("quote")}</p> : null}
        </div>
      ) : null}

      {type === "faq" ? (
        <div className="space-y-2">
          <Label htmlFor="question">Question (English)</Label>
          <Input id="question" placeholder="Question" {...register("question")} />
          {err("question") ? <p className="text-sm text-error">{err("question")}</p> : null}
          <Label htmlFor="answer" className="mt-4 block">Answer (English)</Label>
          <Textarea id="answer" placeholder="Answer" {...register("answer")} />
          {err("answer") ? <p className="text-sm text-error">{err("answer")}</p> : null}
        </div>
      ) : null}

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
