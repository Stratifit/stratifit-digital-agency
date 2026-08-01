import Link from "next/link";
import { getAdminServices } from "@/features/services/admin-queries";
import { deleteService } from "@/features/services/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

export default async function AdminServicesPage() {
  const services = await getAdminServices();

  return (
    <AdminList
      title="Services"
      description="Manage the core service offerings."
      createHref="/admin/content/services/new"
      createLabel="New Service"
      rows={services}
      rowKey={(s) => s.slug}
      columns={[
        {
          header: "Title",
          render: (s) => (
            <Link
              href={`/admin/content/services/${s.slug}/edit`}
              className="font-medium hover:text-hover"
            >
              {resolveTranslation(s.title_translations, "en") || s.slug}
            </Link>
          ),
        },
        { header: "Slug", render: (s) => <code className="text-text-muted">{s.slug}</code> },
        {
          header: "Status",
          render: (s) => (
            <Badge
              variant={
                s.status === "published"
                  ? "success"
                  : s.status === "draft"
                    ? "warning"
                    : "neutral"
              }
            >
              {s.status}
            </Badge>
          ),
        },
        { header: "Visible", render: (s) => (s.is_visible ? "Yes" : "No") },
        { header: "Order", render: (s) => s.display_order },
      ]}
      actions={(s) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/services/${s.slug}/edit`}
            className="rounded-radius-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteService.bind(null, s.slug)}
            title="Delete service"
            description={`This will permanently delete "${s.slug}".`}
          />
        </div>
      )}
    />
  );
}

