import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminLead, LEAD_STATUSES } from "@/features/leads/admin-queries";
import { updateLeadStatus, deleteLead } from "@/features/leads/admin-mutations";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getAdminLead(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
            {lead.name ?? "Anonymous Lead"}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {lead.email ?? "No email"} · {lead.source}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/leads"
            className="rounded-radius-sm px-3 py-2 text-sm text-text-secondary hover:text-hover"
          >
            Back
          </Link>
          <ConfirmDelete
            action={deleteLead.bind(null, lead.id)}
            title="Delete lead"
            description="This will permanently delete this lead."
          />
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Status
        </h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="information">{lead.status}</Badge>
          <form
            className="flex gap-2"
            action={async (formData: FormData) => {
              "use server";
              await updateLeadStatus(lead.id, String(formData.get("status")));
            }}
          >
            <select
              name="status"
              defaultValue={lead.status}
              className="h-9 rounded-radius-sm border border-border bg-surface px-2 text-sm text-text-primary"
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-radius-sm bg-primary px-3 text-sm font-medium text-text-inverse"
            >
              Update
            </button>
          </form>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Details
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-text-muted">Company</dt>
            <dd className="mt-1 text-text-primary">{lead.company ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-muted">Business of Interest</dt>
            <dd className="mt-1 text-text-primary">
              {lead.business_interest ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-text-muted">Preferred Language</dt>
            <dd className="mt-1 text-text-primary">{lead.preferred_locale}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-muted">Created</dt>
            <dd className="mt-1 text-text-primary">
              {new Date(lead.created_at).toLocaleString()}
            </dd>
          </div>
        </dl>
      </Card>

      {lead.message ? (
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Message
          </h2>
          <p className="mt-3 text-base leading-7 text-text-primary">{lead.message}</p>
        </Card>
      ) : null}
    </div>
  );
}

