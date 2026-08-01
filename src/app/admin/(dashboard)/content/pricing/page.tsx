import Link from "next/link";
import { getAdminPricing } from "@/features/content/admin-queries";
import { deletePricingPlan } from "@/features/content/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

export default async function AdminPricingPage() {
  const rows = await getAdminPricing();

  return (
    <AdminList
      title="Pricing Plans"
      description="Manage pricing packages and tiers."
      createHref="/admin/content/pricing/new"
      createLabel="New Plan"
      rows={rows}
      rowKey={(r) => r.slug}
      columns={[
        {
          header: "Name",
          render: (r) => (
            <span className="font-medium">
              {resolveTranslation(r.name_translations, "en") || r.slug}
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
        { header: "Visible", render: (r) => (r.is_visible ? "Yes" : "No") },
      ]}
      actions={(r) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/pricing/${r.slug}/edit`}
            className="rounded-radius-xs px-2 py-1 text-sm text-text-secondary hover:text-primary"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deletePricingPlan.bind(null, r.slug)}
            title="Delete plan"
            description={`This will permanently delete "${r.slug}".`}
          />
        </div>
      )}
    />
  );
}

