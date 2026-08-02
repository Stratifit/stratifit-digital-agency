import Link from "next/link";
import { getAdminLeads } from "@/features/leads/admin-queries";
import { deleteLead } from "@/features/leads/admin-mutations";
import { AdminList } from "@/components/admin/admin-list";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<string, "neutral" | "success" | "warning" | "error" | "information"> = {
  new: "information",
  contacted: "warning",
  qualified: "success",
  proposal: "success",
  won: "success",
  lost: "neutral",
  archived: "neutral",
};

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <AdminList
      title="Leads"
      description="Enquiries submitted through public forms and chat."
      createHref="/admin/leads"
      createLabel="Refresh"
      rows={leads}
      rowKey={(l) => l.id}
      columns={[
        {
          header: "Name",
          render: (l) => (
            <Link href={`/admin/leads/${l.id}`} className="font-medium hover:text-hover">
              {l.name ?? "Anonymous"}
            </Link>
          ),
        },
        { header: "Email", render: (l) => <span className="text-text-secondary">{l.email ?? "—"}</span> },
        { header: "Company", render: (l) => l.company ?? "—" },
        { header: "Source", render: (l) => l.source },
        {
          header: "Status",
          render: (l) => (
            <Badge variant={STATUS_VARIANT[l.status] ?? "neutral"}>{l.status}</Badge>
          ),
        },
        { header: "Created", render: (l) => new Date(l.created_at).toLocaleDateString() },
      ]}
      actions={(l) => (
        <div className="flex justify-end gap-2">
          <Link
            href={`/admin/leads/${l.id}`}
            className="rounded-xs px-2 py-1 text-sm text-text-secondary hover:text-hover"
          >
            View
          </Link>
          <ConfirmDelete
            action={deleteLead.bind(null, l.id)}
            title="Delete lead"
            description="This will permanently delete this lead."
          />
        </div>
      )}
    />
  );
}

