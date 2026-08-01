import Link from "next/link";
import { getAdminConversations } from "@/features/chat/admin-queries";
import { AdminList } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT: Record<string, "neutral" | "success" | "warning" | "error" | "information"> = {
  open: "information",
  waiting_for_admin: "warning",
  waiting_for_visitor: "success",
  resolved: "neutral",
  archived: "neutral",
};

export default async function AdminConversationsPage() {
  const conversations = await getAdminConversations();

  return (
    <AdminList
      title="Conversations"
      description="Visitor chats with AI and human handling."
      createHref="/admin/conversations"
      createLabel="Refresh"
      rows={conversations}
      rowKey={(c) => c.id}
      columns={[
        {
          header: "Conversation",
          render: (c) => (
            <Link href={`/admin/conversations/${c.id}`} className="font-medium hover:text-primary">
              {c.id.slice(0, 8)}…
            </Link>
          ),
        },
        {
          header: "Status",
          render: (c) => (
            <Badge variant={STATUS_VARIANT[c.status] ?? "neutral"}>{c.status}</Badge>
          ),
        },
        { header: "Mode", render: (c) => c.mode },
        { header: "Source", render: (c) => c.source_page ?? "—" },
        {
          header: "Last Activity",
          render: (c) => new Date(c.last_message_at).toLocaleString(),
        },
      ]}
      actions={(c) => (
        <Link
          href={`/admin/conversations/${c.id}`}
          className="rounded-radius-xs px-2 py-1 text-sm text-text-secondary hover:text-primary"
        >
          Open
        </Link>
      )}
    />
  );
}
