import { getAdminConversations } from "@/features/chat/admin-queries";
import { ConversationsList } from "@/components/admin/conversations/conversations-list";

export default async function AdminConversationsPage() {
  const conversations = await getAdminConversations();

  return <ConversationsList conversations={conversations} />;
}
