import type { Metadata } from "next";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
}

export function canonical(path = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(cleanPath, getSiteUrl()).toString();
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Stratifit",
    url: getSiteUrl(),
    logo: canonical("/icon.png"),
    description:
      "Premium digital agency specializing in brand design, website development, AI automation, and growth marketing.",
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
