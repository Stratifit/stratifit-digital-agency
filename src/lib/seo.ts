import type { Metadata } from "next";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

export function canonical(path = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanPath, getSiteUrl()).toString();
}

/**
 * Resolves a page's SEO title/description from optional DB translations,
 * falling back to the provided defaults (previously hardcoded per page).
 * Callers pass the row's `seo_title_translations` / `seo_description_translations`
 * (or null when the row is missing).
 */
export function resolveSeoMetadata(input: {
  seoTitleTranslations?: Record<string, string> | null;
  seoDescriptionTranslations?: Record<string, string> | null;
  locale: string;
  fallbackTitle: string;
  fallbackDescription: string;
}): { title: string; description: string } {
  const pick = (translations?: Record<string, string> | null) => {
    if (!translations) return "";
    return translations[input.locale] || translations.en || "";
  };
  return {
    title: pick(input.seoTitleTranslations) || input.fallbackTitle,
    description:
      pick(input.seoDescriptionTranslations) || input.fallbackDescription,
  };
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = canonical(input.path);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      type: "website",
      siteName: "Stratifit",
    },
    twitter: {
      card: "summary",
      title: input.title,
      description: input.description,
    },
  };
}

export function organizationJsonLd(input?: {
  name?: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input?.name || "Stratifit",
    url: getSiteUrl(),
    logo: canonical("/icon.png"),
    description: input?.description || "",
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  publishedAt?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    ...(input.publishedAt ? { datePublished: input.publishedAt } : {}),
    publisher: {
      "@type": "Organization",
      name: "Stratifit",
      url: getSiteUrl(),
    },
  };
}
