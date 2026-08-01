import Link from "next/link";
import { getAdminTestimonials } from "@/features/content/admin-queries";
import { deleteTestimonial } from "@/features/content/mutations";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

export default async function AdminTestimonialsPage() {
  const rows = await getAdminTestimonials();

  return (
    <AdminList
      title="Testimonials"
      description="Manage customer testimonials and quotes."
      createHref="/admin/content/testimonials/new"
      createLabel="New Testimonial"
      rows={rows}
      rowKey={(r) => r.id}
      columns={[
        { header: "Person", render: (r) => <span className="font-medium">{r.person_name}</span> },
        {
          header: "Quote",
          render: (r) => (
            <span className="text-text-secondary">
              {resolveTranslation(r.quote_translations, "en") || "—"}
            </span>
          ),
        },
        {
          header: "Visible",
          render: (r) => (r.is_visible ? <Badge variant="success">Visible</Badge> : <Badge variant="neutral">Hidden</Badge>),
        },
        {
          header: "Verified",
          render: (r) => (r.is_verified ? "Yes" : "No"),
        },
      ]}
      actions={(r) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/content/testimonials/${r.id}/edit`}
            className="rounded-radius-xs px-2 py-1 text-sm text-text-secondary hover:text-primary"
          >
            Edit
          </Link>
          <ConfirmDelete
            action={deleteTestimonial.bind(null, r.id)}
            title="Delete testimonial"
            description={`This will permanently delete "${r.person_name}".`}
          />
        </div>
      )}
    />
  );
}

