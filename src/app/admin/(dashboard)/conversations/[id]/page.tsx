import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminConversation } from "@/features/chat/admin-queries";
import { ConversationDetail } from "@/components/admin/conversations/conversation-detail";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversation = await getAdminConversation(id);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/conversations"
          className="text-sm text-text-secondary hover:text-hover"
        >
          ← Back to conversations
        </Link>
        <AdminPageHeader title="Conversation" className="mt-3" />
      </div>
      <ConversationDetail conversation={conversation} />
    </div>
  );
}

