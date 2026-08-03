import { getAdminEmailEvents } from "@/features/email/admin-queries";
import { AdminList } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<
  string,
  "neutral" | "success" | "warning" | "error" | "information"
> = {
  queued: "information",
  sent: "information",
  delivered: "success",
  failed: "error",
  bounced: "error",
  complained: "warning",
};

export default async function AdminEmailPage() {
  const events = await getAdminEmailEvents();

  return (
    <AdminList
      title="Email Activity"
      description="Transactional email events logged by the system."
      rows={events}
      rowKey={(e) => e.id}
      columns={[
        {
          header: "Template",
          render: (e) => <span className="font-medium">{e.template_key}</span>,
        },
        {
          header: "Recipient",
          render: (e) => (
            <span className="text-text-secondary">{e.recipient_email}</span>
          ),
        },
        {
          header: "Status",
          render: (e) => (
            <Badge variant={STATUS_VARIANT[e.status] ?? "neutral"}>
              {e.status}
            </Badge>
          ),
        },
        {
          header: "Sent",
          render: (e) =>
            e.sent_at ? new Date(e.sent_at).toLocaleString() : "—",
        },
        {
          header: "Created",
          render: (e) => new Date(e.created_at).toLocaleString(),
        },
        {
          header: "Error",
          render: (e) =>
            e.error_message ? (
              <span className="text-xs text-error">{e.error_message}</span>
            ) : (
              "—"
            ),
        },
      ]}
      actions={() => null}
    />
  );
}
