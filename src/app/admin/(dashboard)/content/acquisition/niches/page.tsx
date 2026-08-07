import Link from "next/link";
import { getAdminAcquisitionNiches } from "@/features/acquisition/niche-queries";
import { deleteAcquisitionNiche } from "@/features/acquisition/niche-mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

export default async function AdminAcquisitionNichesPage() {
  const niches = await getAdminAcquisitionNiches();

  return (
    <AdminList
      title="Acquisition Niches"
      description="Manage the niche catalog shown on /buy-business and niche detail pages."
      createHref="/admin/content/acquisition/niches/new"
      createLabel="New Niche"
      rows={niches}
      rowKey={(n) => n.slug}
      columns={[
        {
          header: "Niche",
          render: (n) => (
            <Link
              href={`/admin/content/acquisition/niches/${n.slug}/edit`}
              className="flex items-center gap-2 font-medium hover:text-hover"
            >
              <span aria-hidden="true">{n.emoji}</span>
              {resolveTranslation(n.label_translations, "en") || n.slug}
            </Link>
          ),
        },
        { header: "Slug", render: (n) => <code className="text-text-muted">{n.slug}</code> },
        {
          header: "Visible",
          render: (n) =>
            n.is_visible ? (
              <Badge variant="success">Visible</Badge>
            ) : (
              <Badge variant="neutral">Hidden</Badge>
            ),
        },
        { header: "Order", render: (n) => n.display_order },
      ]}
      actions={(n) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/acquisition/niches/${n.slug}/edit`}
            className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteAcquisitionNiche.bind(null, n.slug)}
            title="Delete niche"
            description={`This will permanently delete "${n.slug}" and its translations.`}
          />
        </div>
      )}
    />
  );
}
