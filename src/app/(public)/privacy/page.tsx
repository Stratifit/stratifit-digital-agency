import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";

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
              This privacy policy explains how Stratifit collects, uses, and
              protects personal information submitted through this website.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">
              1. Data we collect
            </h2>
            <p>
              When you contact us, we collect the details you provide: name,
              email, phone, company, and message content. We also collect basic
              technical data such as the pages you visit.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">
              2. How we use data
            </h2>
            <p>
              We use your information to respond to enquiries, qualify leads,
              and improve our services. We do not sell your personal data.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">
              3. Legal basis
            </h2>
            <p>
              We process personal data based on your consent and on our
              legitimate interest in operating our business and responding to
              enquiries.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">
              4. Your rights
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal data at any time. Contact us to exercise these rights.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">
              5. Contact
            </h2>
            <p>
              For privacy questions, contact us through the contact page or
              email the address listed on this website.
            </p>
          </div>
        )
      }
    />
  );
}
