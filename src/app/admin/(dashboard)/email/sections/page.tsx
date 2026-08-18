import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailSectionsManager } from "@/components/admin/email-sections-form";
import { getEmailSectionsForAdmin } from "@/features/email-inbox/queries";
import { getEnabledEmailTemplates } from "@/features/email-inbox/template-queries";

export const metadata = {
  title: "Email Sections",
};

export default async function AdminEmailSectionsPage() {
  const [sections, templates] = await Promise.all([
    getEmailSectionsForAdmin(),
    getEnabledEmailTemplates(),
  ]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Email Sections"
        description="Inbox categories, routing addresses, and per-section automatic sends. Inbound emails and form enquiries land in these sections."
      />
      <EmailSectionsManager sections={sections} templates={templates} />
    </div>
  );
}
