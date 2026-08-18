import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailSectionsManager } from "@/components/admin/email-sections-form";
import { getEmailSectionsForAdmin } from "@/features/email-inbox/queries";

export const metadata = {
  title: "Email Sections",
};

export default async function AdminEmailSectionsPage() {
  const sections = await getEmailSectionsForAdmin();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Email Sections"
        description="Inbox categories, routing addresses, and per-section auto-reply. Inbound emails and form enquiries land in these sections."
      />
      <EmailSectionsManager sections={sections} />
    </div>
  );
}
