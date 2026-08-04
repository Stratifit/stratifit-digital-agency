import { getAdminChatbotSettings } from "@/features/chat/chat-admin-queries";
import { ChatbotSettingsForm } from "@/components/admin/chatbot/chatbot-settings-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function AdminChatbotSettingsPage() {
  const settings = await getAdminChatbotSettings();

  if (!settings) {
    return (
      <AdminPageHeader
        title="Chatbot Settings"
        description="No chatbot settings record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Chatbot Settings"
        description="Behaviour, tone, and messages for the AI chat widget."
      />
      <FormCard>
        <ChatbotSettingsForm settings={settings} />
      </FormCard>
    </div>
  );
}
