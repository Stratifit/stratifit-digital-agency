import { getAdminFaqBotSettings } from "@/features/chat/chat-admin-queries";
import { FaqBotSettingsForm } from "@/components/admin/chatbot/faq-bot-settings-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function AdminFaqBotSettingsPage() {
  const settings = await getAdminFaqBotSettings();

  if (!settings) {
    return (
      <AdminPageHeader
        title="FAQ Bot Settings"
        description="No FAQ bot settings record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="FAQ Bot Settings"
        description="Welcome message, default questions, and categories for the FAQ section bot."
      />
      <FormCard>
        <FaqBotSettingsForm settings={settings} />
      </FormCard>
    </div>
  );
}
