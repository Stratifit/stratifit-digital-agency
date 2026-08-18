import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailTemplatesManager } from "@/components/admin/email-templates-form";
import { getEmailTemplatesForAdmin } from "@/features/email-inbox/template-queries";
import { TEMPLATE_CATEGORIES } from "@/features/email-inbox/template-schemas";

export const metadata = {
  title: "Email Templates",
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

function isValidCategory(value: string | undefined): value is string {
  return (
    !!value && (TEMPLATE_CATEGORIES as readonly string[]).includes(value)
  );
}

export default async function AdminEmailTemplatesPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const category = isValidCategory(params.category)
    ? params.category
    : undefined;
  const templates = await getEmailTemplatesForAdmin(category);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Email Templates"
        description="Custom email designs for every activity — auto-replies per service, onboarding, follow-ups, payment reminders, and invoices. All in en / de / fr / es."
      />
      <EmailTemplatesManager
        templates={templates}
        activeCategory={category}
      />
    </div>
  );
}
