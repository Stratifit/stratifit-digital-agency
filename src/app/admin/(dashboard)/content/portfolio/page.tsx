import Link from "next/link";
import { getAdminPortfolio } from "@/features/content/admin-queries";
import { deletePortfolioProject } from "@/features/content/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

export default async function AdminPortfolioPage() {
  const rows = await getAdminPortfolio();

  return (
    <AdminList
      title="Portfolio Projects"
      description="Manage case studies and project showcases."
      createHref="/admin/content/portfolio/new"
      createLabel="New Project"
      rows={rows}
      rowKey={(r) => r.slug}
      columns={[
        {
          header: "Title",
          render: (r) => (
            <span className="font-medium">
              {resolveTranslation(r.title_translations, "en") || r.slug}
            </span>
          ),
        },
        { header: "Client", render: (r) => r.client_name },
        { header: "Slug", render: (r) => <code className="text-text-muted">{r.slug}</code> },
        {
          header: "Status",
          render: (r) => (
            <Badge variant={r.status === "published" ? "success" : "warning"}>{r.status}</Badge>
          ),
        },
      ]}
      actions={(r) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/portfolio/${r.slug}/edit`}
            className="rounded-radius-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deletePortfolioProject.bind(null, r.slug)}
            title="Delete project"
            description={`This will permanently delete "${r.slug}".`}
          />
        </div>
      )}
    />
  );
}


