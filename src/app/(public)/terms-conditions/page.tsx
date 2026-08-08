import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";
import { TERMS_FALLBACK_BLOCKS } from "@/lib/i18n/detail-page-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("terms-conditions");
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: page?.seo_title_translations,
    seoDescriptionTranslations: page?.seo_description_translations,
    locale,
    fallbackTitle: "Terms of Service — Stratifit",
    fallbackDescription: "Terms and conditions for using the Stratifit website.",
  });
  return pageMetadata({ title, description, path: "/terms-conditions" });
}

const FALLBACK_EYEBROW = "Legal";
const FALLBACK_TITLE = "Terms of Service";
const FALLBACK_DESCRIPTION =
  "These terms set out the rules for using the Stratifit website and the services we provide.";
const FALLBACK_SUBTITLE = "Last updated: July 2026";

export default async function TermsConditionsPage() {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("terms-conditions");

  if (page && !page.is_visible) {
    notFound();
  }

  const eyebrow =
    resolveTranslation(page?.eyebrow_translations, locale) || FALLBACK_EYEBROW;
  const title =
    resolveTranslation(page?.title_translations, locale) || FALLBACK_TITLE;
  const description =
    resolveTranslation(page?.description_translations, locale) ||
    FALLBACK_DESCRIPTION;
  const subtitle =
    resolveTranslation(page?.subtitle_translations, locale) || FALLBACK_SUBTITLE;
  const blocks =
    page && page.content.length > 0 ? page.content : TERMS_FALLBACK_BLOCKS;

  return (
    <DetailPageView
      eyebrow={eyebrow}
      title={title}
      description={description}
      subtitle={subtitle}
      blocks={blocks}
      locale={locale}
    />
  );
}
