import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";
import { ContactAwareLink } from "@/components/contact/contact-aware-link";

export const metadata = pageMetadata({
  title: "Careers — Stratifit",
  description: "Join the Stratifit team. We hire strategists, designers, engineers, and marketers.",
  path: "/careers",
});

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

  return (
    <>
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
              We are building a team of strategists, designers, engineers, and
              marketers obsessed with craft — people who want to build digital
              experiences that move businesses forward.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">Why Stratifit</h2>
            <p>
              You will work on premium projects with modern technology, collaborate
              directly with leadership, and see the real impact of your work on
              client outcomes.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">How we work</h2>
            <p>
              We are async-first: tight specs, short meetings, and high trust. We
              hire for seniority, autonomy, and judgment.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">Open positions</h2>
            <p>
              We hire on a rolling basis for design, engineering, and growth roles.
              If you are exceptional at what you do, we want to hear from you.
            </p>
            <h2 className="text-lg font-semibold text-text-primary">Apply</h2>
            <p>
              Send your portfolio or CV through the contact page and we will get
              back to you within a few days.
            </p>
            <p>
              <ContactAwareLink href="/contact">Get in touch</ContactAwareLink>
            </p>
          </div>
          )
        }
      />
    </>
  );
}
