import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminDetailPage } from "@/features/detail-pages/queries";
import { DetailPageForm } from "@/components/admin/detail-page-form";
import { AdminPageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Edit Page — Stratifit CMS" };

export default async function EditDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getAdminDetailPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="Edit Page"
        description={`/${slug}`}
        actions={
          <>
            <Link
              href="/admin/content/pages"
              className="rounded-button border border-border bg-card-dark px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
            >
              Back
            </Link>
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-button border border-border bg-card-dark px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-primary/30 hover:text-text-primary"
            >
              View page ↗
            </a>
          </>
        }
      />

      <DetailPageForm slug={slug} initial={page} />
    </div>
  );
}
