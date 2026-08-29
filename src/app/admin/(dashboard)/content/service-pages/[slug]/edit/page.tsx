import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminServicePage } from "@/features/service-pages/queries";
import { toServicePageFormValues } from "@/features/service-pages/form-values";
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

  const initial = toServicePageFormValues(page);

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
