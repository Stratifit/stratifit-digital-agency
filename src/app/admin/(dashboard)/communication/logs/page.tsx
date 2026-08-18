import { AdminList } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";
import { getEmailLogs } from "@/features/communication/queries";

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

export const metadata = {
  title: "Communication — Email Logs",
};

export default async function AdminCommunicationLogsPage() {
  const logs = await getEmailLogs();

  return (
    <AdminList
      title="Email Logs"
      description="Every email sent through the Communication Engine — automatic replies, manual sends, and admin replies."
      rows={logs}
      rowKey={(e) => e.id}
      columns={[
        {
          header: "Template",
          render: (e) => (
            <span className="font-medium">{e.template_key ?? "—"}</span>
          ),
        },
        {
          header: "To",
          render: (e) => (
            <span className="text-text-secondary">{e.recipient_email}</span>
          ),
        },
        {
          header: "From",
          render: (e) => (
            <span className="text-text-muted">{e.sender_email}</span>
          ),
        },
        {
          header: "Language",
          render: (e) => (
            <span className="uppercase text-text-muted">{e.language}</span>
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
