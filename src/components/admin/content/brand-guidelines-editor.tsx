"use client";

import * as React from "react";
import { useWatch, type Control, type FieldValues, type UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { uploadMediaAsset } from "@/features/media/mutations";
import { PROCESS_ICON_OPTIONS } from "@/components/ui/process-icon";
import {
  EMPTY_BRAND_GUIDELINES,
  type BrandGuidelines,
} from "@/features/portfolio/brand-guidelines";

/**
 * Admin editor for the editable brand-guidelines document
 * (portfolio_projects.brand_guidelines). Mirrors the sections of the public
 * document: primary logo, logo variants, clearspace rules, colour palette,
 * typography weights, and cards/UI components — each with images, icons, and
 * per-locale copy so every brand-design project can fill it in.
 */

const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
};

const EMPTY_TRANSLATIONS = () => ({ en: "", de: "", fr: "", es: "" });

const emptyVariant = () => ({
  media_id: "",
  image_url: "",
  label_translations: EMPTY_TRANSLATIONS(),
});

const emptyColor = () => ({
  name: "",
  hex: "",
  usage_translations: EMPTY_TRANSLATIONS(),
});

const emptyWeight = () => ({
  name: "",
  weight: "400",
  sample: "",
});

const emptyComponent = () => ({
  icon_name: "image",
  title_translations: EMPTY_TRANSLATIONS(),
  description_translations: EMPTY_TRANSLATIONS(),
  media_id: "",
  image_url: "",
});

/* ------------------------------------------------------------------ */
/* Shared image uploader — uploads to the portfolio bucket and reports  */
/* back a { url, id } pair for the caller to store wherever it likes.  */
/* ------------------------------------------------------------------ */

interface ImageValue {
  url: string;
  mediaId: string;
}

function useImageUploader(onUpload: (value: ImageValue) => void) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

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
        onUpload({ url: result.data.url, mediaId: result.data.id });
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

  return { uploading, error, handleFile, inputRef };
}

function ImageField({
  value,
  onChange,
  className,
}: {
  value: ImageValue;
  onChange: (value: ImageValue) => void;
  className?: string;
}) {
  const { uploading, error, handleFile, inputRef } = useImageUploader(onChange);

  return (
    <div className={className}>
      <div className="relative aspect-video w-full overflow-hidden rounded-input border border-card-border bg-background">
        {value.url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail preview */}
            <img src={value.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange({ url: "", mediaId: "" })}
              className="absolute right-1.5 top-1.5 rounded-sm bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white transition-colors hover:bg-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Remove
            </button>
          </>
        ) : (
          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-center transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
              onChange={handleFile}
              className="sr-only"
            />
            <span className="text-[10px] font-medium text-text-muted">Add image</span>
          </label>
        )}
        {uploading ? (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] font-medium text-white">
            Uploading…
          </span>
        ) : null}
      </div>
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Repeatable editors                                                  */
/* ------------------------------------------------------------------ */

function VariantsEditor({
  guidelines,
  setValue,
  locale,
}: {
  guidelines: BrandGuidelines;
  setValue: UseFormSetValue<FieldValues>;
  locale: string;
}) {
  const variants = guidelines.variants;

  function patch(index: number, patch: Partial<BrandGuidelines["variants"][number]>) {
    const next = [...variants];
    while (next.length <= index) next.push(emptyVariant());
    next[index] = { ...next[index], ...patch };
    setValue("brand_guidelines", { ...guidelines, variants: next });
  }

  function patchLabel(index: number, value: string) {
    const next = [...variants];
    while (next.length <= index) next.push(emptyVariant());
    next[index] = {
      ...next[index],
      label_translations: { ...next[index].label_translations, [locale]: value },
    };
    setValue("brand_guidelines", { ...guidelines, variants: next });
  }

  function remove(index: number) {
    setValue(
      "brand_guidelines",
      { ...guidelines, variants: variants.filter((_, i) => i !== index) }
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted">
        Shown as a 2×2 grid on the public page — the first four tiles are the
        grid, any extra tiles stack below. Label e.g. “Primary”, “Reversed”,
        “Monochrome”.
      </p>
      {variants.map((variant, index) => (
        <div
          key={index}
          className="rounded-card border border-white/5 bg-background p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              Variant {index + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
            <ImageField
              value={{ url: variant.image_url, mediaId: variant.media_id }}
              onChange={(value) =>
                patch(index, { image_url: value.url, media_id: value.mediaId })
              }
            />
            <div className="space-y-1.5">
              <Label htmlFor={`variant-label-${index}-${locale}`}>
                Label ({LOCALE_NAMES[locale]})
              </Label>
              <Input
                key={locale}
                id={`variant-label-${index}-${locale}`}
                placeholder="Primary"
                value={variant.label_translations?.[locale] ?? ""}
                onChange={(e) => patchLabel(index, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => patch(variants.length, emptyVariant())}
        className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add variant
      </button>
    </div>
  );
}

function ColorsEditor({
  guidelines,
  setValue,
  locale,
}: {
  guidelines: BrandGuidelines;
  setValue: UseFormSetValue<FieldValues>;
  locale: string;
}) {
  const colors = guidelines.colors;

  function patch(index: number, patch: Partial<BrandGuidelines["colors"][number]>) {
    const next = [...colors];
    while (next.length <= index) next.push(emptyColor());
    next[index] = { ...next[index], ...patch };
    setValue("brand_guidelines", { ...guidelines, colors: next });
  }

  function patchUsage(index: number, value: string) {
    const next = [...colors];
    while (next.length <= index) next.push(emptyColor());
    next[index] = {
      ...next[index],
      usage_translations: { ...next[index].usage_translations, [locale]: value },
    };
    setValue("brand_guidelines", { ...guidelines, colors: next });
  }

  function remove(index: number) {
    setValue(
      "brand_guidelines",
      { ...guidelines, colors: colors.filter((_, i) => i !== index) }
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted">
        The swatches rendered under “Colour Palette”. Pick any hex — a dark
        theme is recommended but the identity&apos;s own colours are yours.
      </p>
      {colors.map((color, index) => (
        <div
          key={index}
          className="rounded-card border border-white/5 bg-background p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              Colour {index + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[120px_150px_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor={`color-name-${index}`}>Name</Label>
              <Input
                id={`color-name-${index}`}
                placeholder="Primary"
                value={color.name}
                onChange={(e) => patch(index, { name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`color-hex-${index}`}>Hex</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(color.hex) ? color.hex : "#F59E0B"}
                  onChange={(e) => patch(index, { hex: e.target.value })}
                  className="h-9 w-10 shrink-0 cursor-pointer rounded-input border border-card-border bg-transparent p-0.5"
                  aria-label={`Colour ${index + 1} picker`}
                />
                <Input
                  id={`color-hex-${index}`}
                  placeholder="#F59E0B"
                  value={color.hex}
                  onChange={(e) => patch(index, { hex: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`color-usage-${index}-${locale}`}>
                Usage ({LOCALE_NAMES[locale]})
              </Label>
              <Input
                key={locale}
                id={`color-usage-${index}-${locale}`}
                placeholder="Primary accent — buttons, links"
                value={color.usage_translations?.[locale] ?? ""}
                onChange={(e) => patchUsage(index, e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => patch(colors.length, emptyColor())}
        className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add colour
      </button>
    </div>
  );
}

function WeightsEditor({
  guidelines,
  setValue,
}: {
  guidelines: BrandGuidelines;
  setValue: UseFormSetValue<FieldValues>;
}) {
  const weights = guidelines.weights;

  function patch(index: number, patch: Partial<BrandGuidelines["weights"][number]>) {
    const next = [...weights];
    while (next.length <= index) next.push(emptyWeight());
    next[index] = { ...next[index], ...patch };
    setValue("brand_guidelines", { ...guidelines, weights: next });
  }

  function remove(index: number) {
    setValue(
      "brand_guidelines",
      { ...guidelines, weights: weights.filter((_, i) => i !== index) }
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted">
        Font-weight samples shown under “Typography”. The sample text previews
        the weight; the weight value (e.g. 700) drives the rendered stroke.
      </p>
      {weights.map((weight, index) => (
        <div
          key={index}
          className="rounded-card border border-white/5 bg-background p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              Weight {index + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-[160px_120px_1fr]">
            <div className="space-y-1.5">
              <Label htmlFor={`weight-name-${index}`}>Name</Label>
              <Input
                id={`weight-name-${index}`}
                placeholder="Regular"
                value={weight.name}
                onChange={(e) => patch(index, { name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`weight-value-${index}`}>Weight</Label>
              <Input
                id={`weight-value-${index}`}
                placeholder="400"
                inputMode="numeric"
                value={weight.weight}
                onChange={(e) => patch(index, { weight: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`weight-sample-${index}`}>Sample text</Label>
              <Input
                id={`weight-sample-${index}`}
                placeholder="Aa — the quick brown fox"
                value={weight.sample}
                onChange={(e) => patch(index, { sample: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => patch(weights.length, emptyWeight())}
        className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add weight
      </button>
    </div>
  );
}

function ComponentsEditor({
  guidelines,
  setValue,
  locale,
}: {
  guidelines: BrandGuidelines;
  setValue: UseFormSetValue<FieldValues>;
  locale: string;
}) {
  const components = guidelines.components;

  function patch(
    index: number,
    patch: Partial<BrandGuidelines["components"][number]>
  ) {
    const next = [...components];
    while (next.length <= index) next.push(emptyComponent());
    next[index] = { ...next[index], ...patch };
    setValue("brand_guidelines", { ...guidelines, components: next });
  }

  function patchTranslations(
    index: number,
    field: "title_translations" | "description_translations",
    value: string
  ) {
    const next = [...components];
    while (next.length <= index) next.push(emptyComponent());
    next[index] = {
      ...next[index],
      [field]: { ...next[index][field], [locale]: value },
    };
    setValue("brand_guidelines", { ...guidelines, components: next });
  }

  function remove(index: number) {
    setValue(
      "brand_guidelines",
      { ...guidelines, components: components.filter((_, i) => i !== index) }
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-muted">
        The “Cards &amp; UI Components” section — each card carries an icon, a
        title, a description, and an optional image (buttons, icons, spacing,
        cards, footer mock-ups…).
      </p>
      {components.map((component, index) => (
        <div
          key={index}
          className="rounded-card border border-white/5 bg-background p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
              Component {index + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-xs text-text-muted transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Remove
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`component-icon-${index}`}>Icon</Label>
                <Select
                  id={`component-icon-${index}`}
                  value={component.icon_name}
                  onChange={(e) => patch(index, { icon_name: e.target.value })}
                >
                  {PROCESS_ICON_OPTIONS.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`component-title-${index}-${locale}`}>
                  Title ({LOCALE_NAMES[locale]})
                </Label>
                <Input
                  key={locale}
                  id={`component-title-${index}-${locale}`}
                  placeholder="Buttons"
                  value={component.title_translations?.[locale] ?? ""}
                  onChange={(e) =>
                    patchTranslations(index, "title_translations", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[240px_1fr]">
              <ImageField
                value={{ url: component.image_url, mediaId: component.media_id }}
                onChange={(value) =>
                  patch(index, { image_url: value.url, media_id: value.mediaId })
                }
              />
              <div className="space-y-1.5">
                <Label htmlFor={`component-desc-${index}-${locale}`}>
                  Description ({LOCALE_NAMES[locale]})
                </Label>
                <Textarea
                  key={locale}
                  id={`component-desc-${index}-${locale}`}
                  rows={3}
                  placeholder="How the component behaves and when it is used"
                  value={component.description_translations?.[locale] ?? ""}
                  onChange={(e) =>
                    patchTranslations(index, "description_translations", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => patch(components.length, emptyComponent())}
        className="rounded-button border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add component
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root editor                                                         */
/* ------------------------------------------------------------------ */

function EditorBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-white/5 bg-card-dark/60 p-4">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-subtle">
        {title}
      </p>
      {hint ? <p className="mb-3 text-xs text-text-muted">{hint}</p> : null}
      {children}
    </div>
  );
}

export function BrandGuidelinesEditor({
  control,
  setValue,
  locale,
}: {
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  locale: string;
}) {
  const guidelines = (useWatch({ control, name: "brand_guidelines" }) ??
    EMPTY_BRAND_GUIDELINES) as BrandGuidelines;

  const patch = (patch: Partial<BrandGuidelines>) =>
    setValue("brand_guidelines", { ...guidelines, ...patch });

  return (
    <div className="space-y-4">
      <EditorBlock
        title="Primary logo"
        hint="The hero lockup shown at the top of the guidelines document."
      >
        <div className="grid gap-4 sm:grid-cols-[240px_1fr]">
          <ImageField
            value={{ url: guidelines.logo_url, mediaId: guidelines.logo_media_id }}
            onChange={(value) =>
              patch({ logo_url: value.url, logo_media_id: value.mediaId })
            }
          />
          <div className="space-y-1.5">
            <Label htmlFor={`logo-caption-${locale}`}>
              Caption ({LOCALE_NAMES[locale]})
            </Label>
            <Textarea
              key={locale}
              id={`logo-caption-${locale}`}
              rows={3}
              placeholder="The primary lockup — wordmark and mark on dark"
              value={guidelines.logo_caption_translations?.[locale] ?? ""}
              onChange={(e) =>
                patch({
                  logo_caption_translations: {
                    ...guidelines.logo_caption_translations,
                    [locale]: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </EditorBlock>

      <EditorBlock
        title="Logo variants"
        hint="Alternative lockups, colourways, and arrangements."
      >
        <VariantsEditor guidelines={guidelines} setValue={setValue} locale={locale} />
      </EditorBlock>

      <EditorBlock
        title="Clearspace & minimum size"
        hint="Rules for the safe zone around the logo and the smallest usable size."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`clearspace-${locale}`}>
              Clearspace rule ({LOCALE_NAMES[locale]})
            </Label>
            <Textarea
              key={locale}
              id={`clearspace-${locale}`}
              rows={3}
              placeholder="Keep the height of the mark clear on all sides…"
              value={guidelines.clearspace_translations?.[locale] ?? ""}
              onChange={(e) =>
                patch({
                  clearspace_translations: {
                    ...guidelines.clearspace_translations,
                    [locale]: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`clearspace-min-${locale}`}>
              Minimum size ({LOCALE_NAMES[locale]})
            </Label>
            <Textarea
              key={locale}
              id={`clearspace-min-${locale}`}
              rows={3}
              placeholder="Never reproduce the mark below 32 px wide…"
              value={guidelines.clearspace_min_size_translations?.[locale] ?? ""}
              onChange={(e) =>
                patch({
                  clearspace_min_size_translations: {
                    ...guidelines.clearspace_min_size_translations,
                    [locale]: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-text-secondary">
            Clearspace diagram (optional)
          </p>
          <ImageField
            value={{
              url: guidelines.clearspace_url,
              mediaId: guidelines.clearspace_media_id,
            }}
            onChange={(value) =>
              patch({ clearspace_url: value.url, clearspace_media_id: value.mediaId })
            }
          />
        </div>
      </EditorBlock>

      <EditorBlock
        title="Primary colour palette"
        hint="Swatch rows — name, hex, and where the colour is used."
      >
        <ColorsEditor guidelines={guidelines} setValue={setValue} locale={locale} />
      </EditorBlock>

      <EditorBlock
        title="Typography"
        hint="The identity's display font and its weights."
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="primary-font">Primary typeface</Label>
            <Input
              id="primary-font"
              placeholder="Satoshi"
              value={guidelines.primary_font}
              onChange={(e) => patch({ primary_font: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`typography-${locale}`}>
              Note ({LOCALE_NAMES[locale]})
            </Label>
            <Input
              key={locale}
              id={`typography-${locale}`}
              placeholder="Geometric grotesque — headings and large figures"
              value={guidelines.typography_translations?.[locale] ?? ""}
              onChange={(e) =>
                patch({
                  typography_translations: {
                    ...guidelines.typography_translations,
                    [locale]: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
        <WeightsEditor guidelines={guidelines} setValue={setValue} />
      </EditorBlock>

      <EditorBlock
        title="Cards & UI components"
        hint="Visual system touchpoints — buttons, icons, spacing, cards, footer."
      >
        <ComponentsEditor guidelines={guidelines} setValue={setValue} locale={locale} />
      </EditorBlock>
    </div>
  );
}
