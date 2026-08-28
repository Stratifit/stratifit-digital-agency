import Link from "next/link";
import {
  getAdminPortfolio,
  getAdminServices,
} from "@/features/content/admin-queries";
import { deletePortfolioProject } from "@/features/content/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";
import { PortfolioCategoryFilter } from "@/components/admin/content/portfolio-category-filter";
import { PortfolioVisibilityToggle } from "@/components/admin/content/portfolio-visibility-toggle";

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, rows, services] = await Promise.all([
    searchParams,
    getAdminPortfolio(),
    getAdminServices(),
  ]);

  const filtered = category
    ? rows.filter((r) => r.category_slug === category)
    : rows;

  return (
    <AdminList
      title="Portfolio Projects"
      description="Manage case studies and project showcases."
      createHref="/admin/content/portfolio/new"
      createLabel="New Project"
      rows={filtered}
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
        { header: "Category", render: (r) => r.category ?? "—" },
        {
          header: "Visible",
          render: (r) => (
            <div className="flex items-center gap-2">
              <PortfolioVisibilityToggle
                slug={r.slug}
                visible={r.status === "published"}
              />
              <Badge variant={r.status === "published" ? "success" : "warning"}>
                {r.status}
              </Badge>
            </div>
          ),
        },
      ]}
      actions={(r) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/portfolio/${r.slug}/edit`}
            className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
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
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-card-border bg-card-dark px-4 py-3 shadow-sm">
        <PortfolioCategoryFilter services={services} />
        {category ? (
          <p className="text-xs text-text-muted">
            Showing {filtered.length} project{filtered.length === 1 ? "" : "s"} in this section.
          </p>
        ) : (
          <p className="text-xs text-text-muted">
            {rows.length} project{rows.length === 1 ? "" : "s"} total.
          </p>
        )}
      </div>
    </AdminList>
  );
}