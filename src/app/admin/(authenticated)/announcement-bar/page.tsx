// ============================================================================
// Stratifit — Admin Announcement Bar Page
// ============================================================================

import { AnnouncementBarAdmin } from "@/components/cms/admin/AnnouncementBarAdmin";

export default function AdminAnnouncementBarPage() {
  return (
    <div className="p-6 max-w-4xl">
      <h1 className="font-display text-heading-xl text-white mb-2">
        Announcement Bar
      </h1>
      <p className="font-body text-body-md text-neutral-400 mb-8">
        Manage announcement slides with multilingual support.
      </p>

      <AnnouncementBarAdmin />
    </div>
  );
}
