import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminServicePage } from "@/features/service-pages/queries";
import { ServicePageForm } from "@/components/admin/service-page-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Edit Service Page — Stratifit CMS" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getAdminServicePage(slug);

  if (!page) {
    notFound();
  }

  const initial = {
    is_visible: page.is_visible,
    hero_eyebrow_translations: page.hero_eyebrow_translations ?? {},
    hero_title_translations: page.hero_title_translations ?? {},
    hero_highlight_translations: page.hero_highlight_translations ?? {},
    hero_description_translations: page.hero_description_translations ?? {},
    hero_stats: page.hero_stats ?? [],
    why_title_translations: page.why_title_translations ?? {},
    why_description_translations: page.why_description_translations ?? {},
    why_badges: page.why_badges ?? [],
    capabilities_title_translations: page.capabilities_title_translations ?? {},
    capabilities: page.capabilities ?? [],
    deliverables_title_translations: page.deliverables_title_translations ?? {},
    deliverables: page.deliverables ?? [],
    process_title_translations: page.process_title_translations ?? {},
    process: page.process ?? [],
    toolkit_title_translations: page.toolkit_title_translations ?? {},
    toolkit: page.toolkit ?? [],
    cta_title_translations: page.cta_title_translations ?? {},
    cta_subtitle_translations: page.cta_subtitle_translations ?? {},
    cta_button_label_translations: page.cta_button_label_translations ?? {},
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Edit Service Page"
        description={`/${slug}`}
        actions={
          <>
            <Link
              href="/admin/content/service-pages"
              className="rounded-button border border-border bg-card-dark px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
            >
              Back
            </Link>
            <a
              href={`/services/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-button border border-border bg-card-dark px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
            >
              View page ↗
            </a>
          </>
        }
      />

      <ServicePageForm slug={slug} initial={initial} />
    </div>
  );
}
