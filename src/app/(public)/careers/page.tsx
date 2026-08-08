import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata, resolveSeoMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";
import { CAREERS_FALLBACK_BLOCKS } from "@/lib/i18n/detail-page-fallbacks";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("careers");
  const { title, description } = resolveSeoMetadata({
    seoTitleTranslations: page?.seo_title_translations,
    seoDescriptionTranslations: page?.seo_description_translations,
    locale,
    fallbackTitle: "Careers — Stratifit",
    fallbackDescription:
      "Join the Stratifit team. We hire strategists, designers, engineers, and marketers.",
  });
  return pageMetadata({ title, description, path: "/careers" });
}

const FALLBACK_EYEBROW = "Careers";
const FALLBACK_TITLE = "Careers";
const FALLBACK_DESCRIPTION =
  "Join the Stratifit team — strategists, designers, engineers, and marketers obsessed with craft.";
const FALLBACK_SUBTITLE = "Join the Stratifit team";

export default async function CareersPage() {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("careers");

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
    page && page.content.length > 0 ? page.content : CAREERS_FALLBACK_BLOCKS;

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
