/**
 * Shared types + normalizer for the editable brand-guidelines document
 * (portfolio_projects.brand_guidelines JSONB).
 *
 * Pure functions only — no server/client imports — so the same normalizer is
 * used by the public case-study query (server) and the admin form (client).
 */

export interface BrandGuidelinesVariant {
  media_id: string;
  image_url: string;
  label_translations: Record<string, string>;
}

export interface BrandGuidelinesColor {
  name: string;
  hex: string;
  usage_translations: Record<string, string>;
}

export interface BrandGuidelinesWeight {
  name: string;
  weight: string;
  sample: string;
}

export interface BrandGuidelinesComponent {
  icon_name: string;
  title_translations: Record<string, string>;
  description_translations: Record<string, string>;
  media_id: string;
  image_url: string;
}

export interface BrandGuidelines {
  logo_media_id: string;
  logo_url: string;
  logo_caption_translations: Record<string, string>;
  variants: BrandGuidelinesVariant[];
  clearspace_translations: Record<string, string>;
  clearspace_min_size_translations: Record<string, string>;
  clearspace_media_id: string;
  clearspace_url: string;
  colors: BrandGuidelinesColor[];
  primary_font: string;
  typography_translations: Record<string, string>;
  weights: BrandGuidelinesWeight[];
  components: BrandGuidelinesComponent[];
}

export const EMPTY_BRAND_GUIDELINES: BrandGuidelines = {
  logo_media_id: "",
  logo_url: "",
  logo_caption_translations: { en: "", de: "", fr: "", es: "" },
  variants: [],
  clearspace_translations: { en: "", de: "", fr: "", es: "" },
  clearspace_min_size_translations: { en: "", de: "", fr: "", es: "" },
  clearspace_media_id: "",
  clearspace_url: "",
  colors: [],
  primary_font: "",
  typography_translations: { en: "", de: "", fr: "", es: "" },
  weights: [],
  components: [],
};

const emptyTranslations = () => ({ en: "", de: "", fr: "", es: "" });

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asTranslations(
  value: unknown,
  fallback: Record<string, string>
): Record<string, string> {
  if (!value || typeof value !== "object") return fallback;
  const out: Record<string, string> = { ...fallback };
  for (const locale of ["en", "de", "fr", "es"] as const) {
    const entry = (value as Record<string, unknown>)[locale];
    if (typeof entry === "string") out[locale] = entry;
  }
  return out;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** Normalizes raw JSONB into a complete, safe BrandGuidelines shape. */
export function normalizeBrandGuidelines(raw: unknown): BrandGuidelines {
  if (!raw || typeof raw !== "object") {
    return { ...EMPTY_BRAND_GUIDELINES };
  }
  const data = raw as Record<string, unknown>;
  const empty = emptyTranslations();

  const variants = asArray(data.variants)
    .map((v) => {
      const item = (v && typeof v === "object" ? v : {}) as Record<
        string,
        unknown
      >;
      return {
        media_id: asString(item.media_id),
        image_url: asString(item.image_url),
        label_translations: asTranslations(item.label_translations, empty),
      };
    })
    .filter((v) => v.image_url || v.media_id);

  const colors = asArray(data.colors)
    .map((c) => {
      const item = (c && typeof c === "object" ? c : {}) as Record<
        string,
        unknown
      >;
      return {
        name: asString(item.name),
        hex: asString(item.hex),
        usage_translations: asTranslations(item.usage_translations, empty),
      };
    })
    .filter((c) => c.hex || c.name);

  const weights = asArray(data.weights)
    .map((w) => {
      const item = (w && typeof w === "object" ? w : {}) as Record<
        string,
        unknown
      >;
      return {
        name: asString(item.name),
        weight: asString(item.weight),
        sample: asString(item.sample),
      };
    })
    .filter((w) => w.name || w.weight || w.sample);

  const components = asArray(data.components)
    .map((c) => {
      const item = (c && typeof c === "object" ? c : {}) as Record<
        string,
        unknown
      >;
      return {
        icon_name: asString(item.icon_name),
        title_translations: asTranslations(item.title_translations, empty),
        description_translations: asTranslations(
          item.description_translations,
          empty
        ),
        media_id: asString(item.media_id),
        image_url: asString(item.image_url),
      };
    })
    .filter(
      (c) =>
        c.title_translations.en ||
        c.description_translations.en ||
        c.image_url ||
        c.media_id
    );

  return {
    logo_media_id: asString(data.logo_media_id),
    logo_url: asString(data.logo_url),
    logo_caption_translations: asTranslations(
      data.logo_caption_translations,
      empty
    ),
    variants,
    clearspace_translations: asTranslations(
      data.clearspace_translations,
      empty
    ),
    clearspace_min_size_translations: asTranslations(
      data.clearspace_min_size_translations,
      empty
    ),
    clearspace_media_id: asString(data.clearspace_media_id),
    clearspace_url: asString(data.clearspace_url),
    colors,
    primary_font: asString(data.primary_font),
    typography_translations: asTranslations(
      data.typography_translations,
      empty
    ),
    weights,
    components,
  };
}

/** True when the document carries no meaningful content yet. */
export function hasBrandGuidelinesContent(guidelines: BrandGuidelines): boolean {
  return Boolean(
    guidelines.logo_url ||
      guidelines.logo_media_id ||
      guidelines.variants.length > 0 ||
      guidelines.clearspace_translations.en ||
      guidelines.clearspace_min_size_translations.en ||
      guidelines.colors.length > 0 ||
      guidelines.primary_font ||
      guidelines.typography_translations.en ||
      guidelines.weights.length > 0 ||
      guidelines.components.length > 0
  );
}
