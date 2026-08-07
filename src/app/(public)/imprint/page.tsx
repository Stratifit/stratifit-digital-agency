import { notFound } from "next/navigation";
import { getPublicSiteSettings } from "@/features/site-settings/queries";
import { getPublicDetailPageIncludingHidden } from "@/features/detail-pages/queries";
import { pageMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/i18n/get-locale";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { DetailPageView } from "@/components/detail-pages/detail-page-view";

export const metadata = pageMetadata({
  title: "Imprint — Stratifit",
  description: "Imprint and legal information for Stratifit.",
  path: "/imprint",
});

const FALLBACK_TITLE = "Imprint";
const FALLBACK_SUBTITLE = "Legal notice / Impressum";

export default async function ImprintPage() {
  const locale = await getLocale();
  const [page, settings] = await Promise.all([
    getPublicDetailPageIncludingHidden("imprint"),
    getPublicSiteSettings(),
  ]);

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
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Company</h2>
            <p className="mt-2">
              {settings?.site_name ?? "Stratifit"}
              <br />
              Address to be provided
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Contact</h2>
            <p className="mt-2">
              {settings?.contact_email ? (
                <>
                  Email:{" "}
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-hover">
                    {settings.contact_email}
                  </a>
                  <br />
                </>
              ) : null}
              {settings?.contact_phone ? (
                <>Phone: {settings.contact_phone}</>
              ) : null}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Represented by</h2>
            <p className="mt-2">Managing director / owner to be provided.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Responsible for content</h2>
            <p className="mt-2">To be provided.</p>
          </div>
          <p className="rounded-sm border border-border bg-surface p-4 text-text-muted">
            Note: This placeholder must be completed with the legally required
            company information before launch.
          </p>
        </div>
        )
      }
    />
  );
}
