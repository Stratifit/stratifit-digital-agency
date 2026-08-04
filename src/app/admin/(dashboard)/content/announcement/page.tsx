import { getAdminAnnouncement } from "@/features/announcement/admin-queries";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function AdminAnnouncementPage() {
  const announcement = await getAdminAnnouncement();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Announcement Bar"
        description="The rotating messages shown above the header on every page."
      />
      <FormCard>
        <AnnouncementForm announcement={announcement} />
      </FormCard>
    </div>
  );
}
