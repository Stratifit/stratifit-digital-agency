import { notFound } from "next/navigation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import type { Metadata } from "next";
import { pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";
import { IMPRINT_FALLBACK_BLOCKS } from "@/lib/i18n/detail-page-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("imprint");
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: page?.seo_title_translations,
    seoDescriptionTranslations: page?.seo_description_translations,
    locale,
    fallbackTitle: page?.title_translations?.[locale] || "Imprint",
    fallbackDescription: page?.description_translations?.[locale] || "",
  });
  return pageMetadata({ title, description, path: "/imprint" });
}

const FALLBACK_EYEBROW = "";
const FALLBACK_TITLE = "";
const FALLBACK_DESCRIPTION = "";
const FALLBACK_SUBTITLE = "";

export default async function ImprintPage() {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("imprint");

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
    page && page.content.length > 0 ? page.content : IMPRINT_FALLBACK_BLOCKS;

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
