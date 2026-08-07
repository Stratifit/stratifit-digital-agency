"use client";

import * as React from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  detailPageSchema,
  type DetailPageFormValues,
} from "@/features/detail-pages/schemas";
import { updateDetailPage } from "@/features/detail-pages/mutations";
import type { AdminDetailPage } from "@/features/detail-pages/queries";
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

const BLOCK_TYPES = [
  { value: "paragraph", label: "Paragraph" },
  { value: "heading", label: "Heading" },
  { value: "note", label: "Note box" },
] as const;

function tr(v: Record<string, string> | null | undefined) {
  return { en: v?.en ?? "", de: v?.de ?? "", fr: v?.fr ?? "", es: v?.es ?? "" };
}

function emptyTranslations() {
  return { en: "", de: "", fr: "", es: "" };
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

function ErrorNote({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-error">{message}</p>;
}

export function DetailPageForm({
  slug,
  initial,
}: {
  slug: string;
  initial: AdminDetailPage;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DetailPageFormValues>({
    resolver: zodResolver(detailPageSchema),
    defaultValues: {
      title_translations: tr(initial.title_translations),
      subtitle_translations: tr(initial.subtitle_translations),
      content: (initial.content ?? []).map((block) => ({
        type: block.type,
        text_translations: tr(block.text_translations),
      })),
      is_visible: initial.is_visible,
    },
  });

  const isVisible = useWatch({ control, name: "is_visible" });
  const blocks = useFieldArray({ control, name: "content" });

  async function onSubmit(values: DetailPageFormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateDetailPage(slug, values);
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
          <p className="text-sm font-medium text-text-primary">Show this page</p>
          <p className="text-xs text-text-muted">
            Hidden pages are not reachable on the public site.
          </p>
        </div>
        <Switch
          checked={isVisible}
          onCheckedChange={(checked) => setValue("is_visible", checked)}
          aria-label="Detail page visible"
        />
      </div>

      <SectionCard title="Title & subtitle">
        {LOCALES.map((locale) => (
          <div key={locale} className="space-y-3 rounded-sm border border-border-subtle bg-background p-4">
            <p className="text-sm font-semibold text-text-primary">
              {LOCALE_NAMES[locale]}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`title-${locale}`}>Title</Label>
                <Input
                  id={`title-${locale}`}
                  placeholder="Privacy Policy"
                  {...register(`title_translations.${locale}`)}
                />
                <ErrorNote
                  message={errors.title_translations?.[locale]?.message}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`subtitle-${locale}`}>Subtitle</Label>
                <Input
                  id={`subtitle-${locale}`}
                  placeholder="Last updated: August 2026"
                  {...register(`subtitle_translations.${locale}`)}
                />
              </div>
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title="Content blocks"
        description="Headings, paragraphs, and note boxes rendered in order."
      >
        {blocks.fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-md border border-border bg-background p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-display text-base font-semibold text-text-primary">
                Block {index + 1}
              </h4>
              <Button
                type="button"
                variant="destructive"
                size="small"
                onClick={() => blocks.remove(index)}
              >
                Remove
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`block-type-${index}`}>Type</Label>
              <Select id={`block-type-${index}`} {...register(`content.${index}.type`)}>
                {BLOCK_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mt-4 space-y-3">
              {LOCALES.map((locale) => (
                <div key={locale} className="space-y-2">
                  <Label htmlFor={`block-${index}-${locale}`}>
                    Text ({LOCALE_NAMES[locale]})
                  </Label>
                  <Textarea
                    id={`block-${index}-${locale}`}
                    rows={2}
                    placeholder={
                      field.type === "heading"
                        ? "1. Data we collect"
                        : field.type === "note"
                          ? "Note: …"
                          : "Write a paragraph…"
                    }
                    {...register(`content.${index}.text_translations.${locale}`)}
                  />
                  <ErrorNote
                    message={
                      errors.content?.[index]?.text_translations?.[locale]?.message
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {errors.content?.message ? (
          <p className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
            {errors.content.message}
          </p>
        ) : null}

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            blocks.append({
              type: "paragraph",
              text_translations: emptyTranslations(),
            })
          }
        >
          Add block
        </Button>
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
        {isSubmitting ? "Saving…" : "Save Page"}
      </Button>
    </form>
  );
}
