import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";
import { PRIVACY_FALLBACK_BLOCKS } from "@/lib/i18n/detail-page-fallbacks";

export const metadata = pageMetadata({
  title: "Privacy Policy — Stratifit",
  description: "How Stratifit collects, uses, and protects personal data.",
  path: "/privacy",
});

const FALLBACK_EYEBROW = "Legal";
const FALLBACK_TITLE = "Privacy Policy";
const FALLBACK_DESCRIPTION =
  "Your privacy matters to us. This policy explains how Stratifit collects, uses, and protects your personal information.";
const FALLBACK_SUBTITLE = "Last updated: July 2026";

export default async function PrivacyPage() {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("privacy");

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
    page && page.content.length > 0 ? page.content : PRIVACY_FALLBACK_BLOCKS;

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
