import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminConversation } from "@/features/chat/admin-queries";
import { ConversationDetail } from "@/components/admin/conversations/conversation-detail";

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
          className="text-sm text-text-secondary hover:text-primary"
        >
          ← Back to conversations
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-text-primary">
          Conversation
        </h1>
      </div>
      <ConversationDetail conversation={conversation} />
    </div>
  );
}
