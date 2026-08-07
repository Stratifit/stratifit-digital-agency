import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";

export const metadata = pageMetadata({
  title: "Cookie Policy — Stratifit",
  description: "How Stratifit uses cookies.",
  path: "/cookie-policy",
});

const FALLBACK_TITLE = "Cookie Policy";
const FALLBACK_SUBTITLE = "Last updated: August 2026";

export default async function CookiePolicyPage() {
  const locale = await getLocale();
  const page = await getPublicDetailPageIncludingHidden("cookie-policy");

  if (page && !page.is_visible) {
    notFound();
  }

  const title =
    resolveTranslation(page?.title_translations, locale) || FALLBACK_TITLE;
  const subtitle =
    resolveTranslation(page?.subtitle_translations, locale) || FALLBACK_SUBTITLE;

  return (
    <DetailPageView
      title={title}
      subtitle={subtitle}
      blocks={page?.content ?? []}
      locale={locale}
      fallback={
        page ? undefined : (
        <div className="space-y-6 text-sm leading-7 text-text-secondary">
          <p>
            This cookie policy explains how Stratifit uses cookies and similar
            technologies on this website.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">1. What are cookies</h2>
          <p>
            Cookies are small text files stored on your device that help websites
            function and improve your browsing experience.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">2. How we use cookies</h2>
          <p>
            We use essential cookies for basic site functionality and, where
            enabled, analytics cookies to understand how visitors use the site.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">3. Managing cookies</h2>
          <p>
            You can control or delete cookies through your browser settings at any
            time. Disabling cookies may affect site functionality.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">4. Contact</h2>
          <p>
            For questions about this cookie policy, contact us through the contact
            page.
          </p>
          <p className="rounded-sm border border-border bg-surface p-4 text-text-muted">
            Note: This placeholder must be reviewed and finalized by qualified
            legal counsel before launch.
          </p>
        </div>
        )
      }
    />
  );
}
