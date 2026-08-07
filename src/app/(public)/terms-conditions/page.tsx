import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";

export const metadata = pageMetadata({
  title: "Terms of Service — Stratifit",
  description: "Terms and conditions for using the Stratifit website.",
  path: "/terms-conditions",
});

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

  return (
    <DetailPageView
      eyebrow={eyebrow}
      title={title}
      description={description}
      subtitle={subtitle}
      blocks={page?.content ?? []}
      locale={locale}
      fallback={
        page ? undefined : (
        <div className="space-y-6 text-sm leading-7 text-text-secondary">
          <p>
            These terms govern the use of the Stratifit website and its services.
            By accessing this website, you agree to these terms.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">1. Services</h2>
          <p>
            Stratifit provides digital agency services including brand design,
            website development, AI & automation, and growth marketing.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">2. Intellectual property</h2>
          <p>
            All content, designs, and materials delivered remain the intellectual
            property of their respective owners unless agreed otherwise in writing.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">3. Limitation of liability</h2>
          <p>
            Stratifit is not liable for indirect or consequential damages arising
            from the use of this website or its services.
          </p>
          <h2 className="text-lg font-semibold text-text-primary">4. Contact</h2>
          <p>
            For questions about these terms, contact us through the contact page.
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
