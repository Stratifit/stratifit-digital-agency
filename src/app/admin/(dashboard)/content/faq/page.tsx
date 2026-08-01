import Link from "next/link";
import { getAdminFaqs } from "@/features/content/admin-queries";
import { deleteFaq } from "@/features/content/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

export default async function AdminFaqPage() {
  const rows = await getAdminFaqs();

  return (
    <AdminList
      title="FAQs"
      description="Manage frequently asked questions."
      createHref="/admin/content/faq/new"
      createLabel="New FAQ"
      rows={rows}
      rowKey={(r) => r.id}
      columns={[
        {
          header: "Question",
          render: (r) => (
            <span className="font-medium">
              {resolveTranslation(r.question_translations, "en") || "—"}
            </span>
          ),
        },
        { header: "Category", render: (r) => r.category },
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
            href={`/admin/content/faq/${r.id}/edit`}
            className="rounded-radius-xs px-2 py-1 text-sm text-text-secondary hover:text-primary"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteFaq.bind(null, r.id)}
            title="Delete FAQ"
            description="This will permanently delete this FAQ."
          />
        </div>
      )}
    />
  );
}

