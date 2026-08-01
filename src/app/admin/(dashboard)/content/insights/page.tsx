import Link from "next/link";
import { getAdminInsights } from "@/features/content/admin-queries";
import { deleteInsight } from "@/features/content/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

export default async function AdminInsightsPage() {
  const rows = await getAdminInsights();

  return (
    <AdminList
      title="Insights"
      description="Manage articles and expert insights."
      createHref="/admin/content/insights/new"
      createLabel="New Insight"
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
            href={`/admin/content/insights/${r.slug}/edit`}
            className="rounded-radius-xs px-2 py-1 text-sm text-text-secondary hover:text-primary"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteInsight.bind(null, r.slug)}
            title="Delete insight"
            description={`This will permanently delete "${r.slug}".`}
          />
        </div>
      )}
    />
  );
}

