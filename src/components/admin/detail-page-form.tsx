"use client";

import * as React from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type Path,
  type Resolver,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  detailPageSchema,
  type DetailPageFormValues,
  type DetailPageBlockValue,
} from "@/features/detail-pages/schemas";
import type { DetailPageIconKey } from "@/features/detail-pages/icons";
import {
  DETAIL_PAGE_ICON_KEYS,
  DETAIL_PAGE_ICON_LABELS,
} from "@/features/detail-pages/icons";
import { updateDetailPage } from "@/features/detail-pages/mutations";
import type { AdminDetailPage } from "@/features/detail-pages/queries";
import { DetailPagePreview } from "@/components/detail-pages/detail-page-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { cn } from "@/lib/cn";

const LOCALES = ["en", "de", "fr", "es"] as const;
type Locale = (typeof LOCALES)[number];

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const SHORT_LOCALE_NAMES: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
  es: "ES",
};

const BLOCK_TYPES = [
  { value: "heading", label: "Section heading (card)" },
  { value: "subheading", label: "Subheading" },
  { value: "paragraph", label: "Paragraph" },
  { value: "list", label: "Bullet list" },
  { value: "panel", label: "Info panel" },
  { value: "note", label: "Note box" },
] as const;

type FormValues = DetailPageFormValues;
type Register = UseFormRegister<FormValues>;
type FormControl = Control<FormValues>;

/**
 * react-hook-form's error typing struggles with discriminated-union arrays
 * (Zod 4 + zodResolver). We only ever read a few fields off each block error,
 * so a small structural cast keeps the editor type-safe and readable.
 */
type BlockFieldError = {
  type?: string;
  text_translations?: Record<string, { message?: string } | undefined>;
  title_translations?: Record<string, { message?: string } | undefined>;
  tag_translations?: Record<string, { message?: string } | undefined>;
  body_translations?: Record<string, { message?: string } | undefined>;
};

function toBlockError(
  value: unknown
): BlockFieldError | undefined {
  if (!value || typeof value !== "object") return undefined;
  return value as BlockFieldError;
}

const DEVICE_FRAMES = [
  { key: "mobile", label: "Mobile", width: "max-w-[390px]" },
  { key: "tablet", label: "Tablet", width: "max-w-[768px]" },
  { key: "desktop", label: "Desktop", width: "w-full" },
] as const;

type Device = (typeof DEVICE_FRAMES)[number]["key"];

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

function LocaleTextarea({
  controlName,
  label,
  locale,
  register,
  errors,
  placeholder,
  rows = 2,
}: {
  controlName: Path<DetailPageFormValues>;
  label: string;
  locale: Locale;
  register: Register;
  errors?: string;
  placeholder?: string;
  rows?: number;
}) {
  const name = `${controlName}.${locale}` as Path<DetailPageFormValues>;
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} ({LOCALE_NAMES[locale]})
      </Label>
      <Textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
      />
      <ErrorNote message={errors} />
    </div>
  );
}

function LocaleInput({
  controlName,
  label,
  locale,
  register,
  errors,
  placeholder,
}: {
  controlName: Path<DetailPageFormValues>;
  label: string;
  locale: Locale;
  register: Register;
  errors?: string;
  placeholder?: string;
}) {
  const name = `${controlName}.${locale}` as Path<DetailPageFormValues>;
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} ({LOCALE_NAMES[locale]})
      </Label>
      <Input
        id={name}
        placeholder={placeholder}
        {...register(name)}
      />
      <ErrorNote message={errors} />
    </div>
  );
}

function LocaleGrid({
  render,
}: {
  render: (locale: Locale) => React.ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {LOCALES.map((locale) => (
        <React.Fragment key={locale}>{render(locale)}</React.Fragment>
      ))}
    </div>
  );
}

/** Nested editor for a list block's items. */
function ListItemFields({
  control,
  register,
  blockIndex,
}: {
  control: FormControl;
  register: Register;
  blockIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `content.${blockIndex}.items` as "content" | `content.${number}.items`,
  });

  return (
    <div className="space-y-3">
      {fields.map((item, itemIndex) => (
        <div
          key={item.id}
          className="space-y-2 rounded-sm border border-border-subtle bg-background p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-text-secondary">
              Item {itemIndex + 1}
            </p>
            <Button
              type="button"
              variant="destructive"
              size="small"
              onClick={() => remove(itemIndex)}
            >
              Remove
            </Button>
          </div>
          <LocaleGrid
            render={(locale) => (
              <div className="space-y-2">
                <Label
                  htmlFor={`content.${blockIndex}.items.${itemIndex}.text_translations.${locale}`}
                >
                  Text ({LOCALE_NAMES[locale]})
                </Label>
                <Input
                  id={`content.${blockIndex}.items.${itemIndex}.text_translations.${locale}`}
                  {...register(
                    `content.${blockIndex}.items.${itemIndex}.text_translations.${locale}` as Path<DetailPageFormValues>
                  )}
                />
              </div>
            )}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() =>
          append({ text_translations: emptyTranslations() })
        }
      >
        Add item
      </Button>
    </div>
  );
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
  const [device, setDevice] = React.useState<Device>("desktop");
  const [previewLocale, setPreviewLocale] = React.useState<Locale>("en");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(detailPageSchema) as Resolver<FormValues>,
    defaultValues: {
      eyebrow_translations: tr(initial.eyebrow_translations),
      title_translations: tr(initial.title_translations),
      description_translations: tr(initial.description_translations),
      subtitle_translations: tr(initial.subtitle_translations),
      content: (initial.content ?? []).map((block) => {
        const base = { ...block };
        if (base.type === "heading") {
          return {
            type: "heading" as const,
            icon: base.icon as DetailPageIconKey | undefined,
            text_translations: tr(base.text_translations),
          };
        }
        if (base.type === "subheading") {
          return {
            type: "subheading" as const,
            divider: base.divider === true,
            text_translations: tr(base.text_translations),
          };
        }
        if (base.type === "paragraph") {
          return {
            type: "paragraph" as const,
            text_translations: tr(base.text_translations),
          };
        }
        if (base.type === "list") {
          return {
            type: "list" as const,
            items: (base.items ?? []).map((item) => ({
              text_translations: tr(item.text_translations),
            })),
          };
        }
        if (base.type === "panel") {
          return {
            type: "panel" as const,
            title_translations: tr(base.title_translations),
            tag_translations: tr(base.tag_translations),
            body_translations: tr(base.body_translations),
          };
        }
        return {
          type: "note" as const,
          text_translations: tr(base.text_translations),
        };
      }) as DetailPageFormValues["content"],
      is_visible: initial.is_visible,
    },
  });

  const isVisible = useWatch({ control, name: "is_visible" });
  const eyebrowTranslations = useWatch({
    control,
    name: "eyebrow_translations",
  });
  const titleTranslations = useWatch({ control, name: "title_translations" });
  const descriptionTranslations = useWatch({
    control,
    name: "description_translations",
  });
  const subtitleTranslations = useWatch({
    control,
    name: "subtitle_translations",
  });
  const watchedBlocks = useWatch({ control, name: "content" });
  const blocks = useFieldArray({ control, name: "content" });

  const previewBlocks = watchedBlocks ?? [];

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSaved(false);
    const result = await updateDetailPage(slug, values);
    if (result.success) {
      setSaved(true);
    } else {
      setServerError(result.error);
    }
  }

  const blockErrors = errors.content ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
        {/* Form column */}
        <div className="space-y-8">
          <div className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Show this page
              </p>
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

          <SectionCard title="Page hero">
            <div className="space-y-4">
              <LocaleGrid
                render={(locale) => (
                  <LocaleInput
                    controlName="eyebrow_translations"
                    label="Eyebrow"
                    locale={locale}
                    register={register}
                    placeholder="Legal"
                  />
                )}
              />
              <LocaleGrid
                render={(locale) => (
                  <LocaleInput
                    controlName="title_translations"
                    label="Title"
                    locale={locale}
                    register={register}
                    placeholder="Privacy Policy"
                    errors={
                      errors.title_translations?.[locale]?.message
                    }
                  />
                )}
              />
              <LocaleGrid
                render={(locale) => (
                  <LocaleTextarea
                    controlName="description_translations"
                    label="Hero description"
                    locale={locale}
                    register={register}
                    placeholder="Your privacy matters to us…"
                    rows={2}
                  />
                )}
              />
              <LocaleGrid
                render={(locale) => (
                  <LocaleInput
                    controlName="subtitle_translations"
                    label="Subtitle"
                    locale={locale}
                    register={register}
                    placeholder="Last updated: July 2026"
                  />
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Content blocks"
            description="Each section heading starts a card. Subheadings, paragraphs, bullet lists, info panels, and notes live inside it."
          >
            {blocks.fields.map((field, index) => {
              const block = watchedBlocks?.[index];
              const type = block?.type ?? "paragraph";
              const blockError = toBlockError(blockErrors?.[index]);

              return (
                <div
                  key={field.id}
                  className="rounded-md border border-border bg-background p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
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
                    <Select
                      id={`block-type-${index}`}
                      value={type}
                      onChange={(event) => {
                        const next = event.target.value;
                        setValue(
                          `content.${index}.type` as Path<FormValues>,
                          next as FormValues["content"][number]["type"]
                        );
                      }}
                    >
                      {BLOCK_TYPES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  {type === "heading" ? (
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`block-icon-${index}`}>Icon</Label>
                        <Select
                          id={`block-icon-${index}`}
                          value={
                            (block as Extract<DetailPageBlockValue, { type: "heading" }> | undefined)
                              ?.icon ?? ""
                          }
                          onChange={(event) =>
                            setValue(
                              `content.${index}.icon` as Path<FormValues>,
                              (event.target.value || undefined) as
                                | DetailPageIconKey
                                | undefined
                            )
                          }
                        >
                          <option value="">No icon</option>
                          {DETAIL_PAGE_ICON_KEYS.map((key) => (
                            <option key={key} value={key}>
                              {DETAIL_PAGE_ICON_LABELS[key]}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <LocaleGrid
                        render={(locale) => (
                          <LocaleInput
                            controlName={`content.${index}.text_translations` as Path<FormValues>}
                            label="Heading"
                            locale={locale}
                            register={register}
                            placeholder="1. Introduction"
                            errors={
                              blockError?.type === "heading"
                                ? blockError.text_translations?.[locale]?.message
                                : undefined
                            }
                          />
                        )}
                      />
                    </div>
                  ) : null}

                  {type === "subheading" ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between rounded-sm border border-border-subtle bg-background px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            Divider above
                          </p>
                          <p className="text-xs text-text-muted">
                            Adds a separator line before this subheading (e.g. a
                            “Contact Us” block).
                          </p>
                        </div>
                        <Switch
                          checked={
                            (block as Extract<DetailPageBlockValue, { type: "subheading" }> | undefined)
                              ?.divider === true
                          }
                          onCheckedChange={(checked) =>
                            setValue(
                              `content.${index}.divider` as Path<FormValues>,
                              checked
                            )
                          }
                          aria-label="Divider above subheading"
                        />
                      </div>
                      <LocaleGrid
                        render={(locale) => (
                          <LocaleInput
                            controlName={`content.${index}.text_translations` as Path<FormValues>}
                            label="Subheading"
                            locale={locale}
                            register={register}
                            placeholder="Contact Us"
                            errors={
                              blockError?.type === "subheading"
                                ? blockError.text_translations?.[locale]?.message
                                : undefined
                            }
                          />
                        )}
                      />
                    </div>
                  ) : null}

                  {(type === "paragraph" || type === "note") && block ? (
                    <div className="mt-4 space-y-4">
                      <LocaleGrid
                        render={(locale) => (
                          <LocaleTextarea
                            controlName={`content.${index}.text_translations` as Path<FormValues>}
                            label={type === "note" ? "Note text" : "Paragraph"}
                            locale={locale}
                            register={register}
                            placeholder={
                              type === "note"
                                ? "Note: …"
                                : "Write a paragraph… Use [label](url) for links."
                            }
                            rows={3}
                            errors={
                              blockError &&
                              "text_translations" in blockError
                                ? (blockError as { text_translations?: { [k: string]: { message?: string } } })
                                    .text_translations?.[locale]?.message
                                : undefined
                            }
                          />
                        )}
                      />
                    </div>
                  ) : null}

                  {type === "list" ? (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-text-primary">
                        Bullet items
                      </p>
                      <ListItemFields
                        control={control}
                        register={register}
                        blockIndex={index}
                      />
                    </div>
                  ) : null}

                  {type === "panel" ? (
                    <div className="mt-4 space-y-4">
                      <LocaleGrid
                        render={(locale) => (
                          <LocaleInput
                            controlName={`content.${index}.title_translations` as Path<FormValues>}
                            label="Panel title"
                            locale={locale}
                            register={register}
                            placeholder="Essential Cookies"
                            errors={
                              blockError?.type === "panel"
                                ? blockError.title_translations?.[locale]?.message
                                : undefined
                            }
                          />
                        )}
                      />
                      <LocaleGrid
                        render={(locale) => (
                          <LocaleInput
                            controlName={`content.${index}.tag_translations` as Path<FormValues>}
                            label="Tag"
                            locale={locale}
                            register={register}
                            placeholder="Always active / Optional"
                          />
                        )}
                      />
                      <LocaleGrid
                        render={(locale) => (
                          <LocaleTextarea
                            controlName={`content.${index}.body_translations` as Path<FormValues>}
                            label="Body"
                            locale={locale}
                            register={register}
                            rows={3}
                            errors={
                              blockError?.type === "panel"
                                ? blockError.body_translations?.[locale]?.message
                                : undefined
                            }
                          />
                        )}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}

            {(errors.content as { message?: string } | undefined)?.message ? (
              <p className="rounded-card bg-error-soft px-3 py-2 text-sm text-error">
                {(errors.content as { message?: string }).message}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
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
                Add paragraph
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  blocks.append({
                    type: "heading",
                    text_translations: emptyTranslations(),
                  })
                }
              >
                Add section heading
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  blocks.append({
                    type: "subheading",
                    divider: false,
                    text_translations: emptyTranslations(),
                  })
                }
              >
                Add subheading
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => blocks.append({ type: "list", items: [] })}
              >
                Add list
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  blocks.append({
                    type: "panel",
                    title_translations: emptyTranslations(),
                    tag_translations: emptyTranslations(),
                    body_translations: emptyTranslations(),
                  })
                }
              >
                Add panel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  blocks.append({
                    type: "note",
                    text_translations: emptyTranslations(),
                  })
                }
              >
                Add note
              </Button>
            </div>
          </SectionCard>

          {serverError ? (
            <p
              role="alert"
              className="rounded-card bg-error-soft px-3 py-2 text-sm text-error"
            >
              {serverError}
            </p>
          ) : null}

          {saved ? (
            <p
              role="status"
              className="rounded-card bg-success-soft px-3 py-2 text-sm text-success"
            >
              Saved successfully.
            </p>
          ) : null}

          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Page"}
          </Button>
        </div>

        {/* Preview column */}
        <aside className="space-y-3 lg:sticky lg:top-20">
          <div className="rounded-md border border-border bg-background p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-primary">
                  Live preview
                </p>
                {isVisible ? null : <Badge variant="neutral">Hidden</Badge>}
              </div>
              <p className="text-xs text-text-muted">
                Draft changes shown as you type.
              </p>
            </div>

            {/* Preview controls */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div
                className="flex overflow-hidden rounded-button border border-border"
                role="group"
                aria-label="Preview device"
              >
                {DEVICE_FRAMES.map((frame) => (
                  <button
                    key={frame.key}
                    type="button"
                    aria-pressed={device === frame.key}
                    onClick={() => setDevice(frame.key)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium transition-colors",
                      device === frame.key
                        ? "bg-primary text-text-inverse"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    )}
                  >
                    {frame.label}
                  </button>
                ))}
              </div>
              <div
                className="flex overflow-hidden rounded-button border border-border"
                role="group"
                aria-label="Preview language"
              >
                {LOCALES.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    aria-pressed={previewLocale === locale}
                    onClick={() => setPreviewLocale(locale)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium transition-colors",
                      previewLocale === locale
                        ? "bg-primary text-text-inverse"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    )}
                  >
                    {SHORT_LOCALE_NAMES[locale]}
                  </button>
                ))}
              </div>
            </div>

            {/* Device frame */}
            <div
              className={cn(
                "mx-auto overflow-hidden rounded-card border border-border-subtle bg-background",
                DEVICE_FRAMES.find((f) => f.key === device)?.width
              )}
            >
              <div className="max-h-[70vh] overflow-y-auto overscroll-contain">
                <DetailPagePreview
                  eyebrow={resolveTranslation(
                    eyebrowTranslations ?? null,
                    previewLocale
                  )}
                  title={resolveTranslation(
                    titleTranslations ?? null,
                    previewLocale
                  )}
                  description={resolveTranslation(
                    descriptionTranslations ?? null,
                    previewLocale
                  )}
                  subtitle={resolveTranslation(
                    subtitleTranslations ?? null,
                    previewLocale
                  )}
                  blocks={previewBlocks}
                  locale={previewLocale}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
