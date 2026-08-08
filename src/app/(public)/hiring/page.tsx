import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";
import { HIRING_FALLBACK_BLOCKS } from "@/lib/i18n/detail-page-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("hiring");
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: page?.seo_title_translations,
    seoDescriptionTranslations: page?.seo_description_translations,
    locale,
    fallbackTitle: "We're Hiring — Stratifit",
    fallbackDescription:
      "Open roles at Stratifit. We hire strategists, designers, engineers, and marketers on a rolling basis.",
  });
  return pageMetadata({ title, description, path: "/hiring" });
}

const FALLBACK_EYEBROW = "Careers";
const FALLBACK_TITLE = "We're Hiring";
const FALLBACK_DESCRIPTION =
  "We're always looking for exceptional people to join our team. Here's how we hire and how to apply.";
const FALLBACK_SUBTITLE = "Open roles & hiring process";

export default async function HiringPage() {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("hiring");

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
    page && page.content.length > 0 ? page.content : HIRING_FALLBACK_BLOCKS;

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
