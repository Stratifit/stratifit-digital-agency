import { getAdminAnnouncement } from "@/features/announcement/admin-queries";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function AdminAnnouncementPage() {
  const announcement = await getAdminAnnouncement();

  if (!announcement) {
    return (
      <AdminPageHeader
        title="Announcement Bar"
        description="No announcement record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Announcement Bar"
        description="The message shown above the header on every page."
      />
      <FormCard>
        <AnnouncementForm announcement={announcement} />
      </FormCard>
    </div>
  );
}
