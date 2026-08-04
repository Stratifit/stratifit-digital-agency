import { getAdminAcquisitionSection } from "@/features/acquisition/admin-queries";
import { AcquisitionManager } from "@/components/admin/acquisition-manager";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminAcquisitionPage() {
  const section = await getAdminAcquisitionSection();

  if (!section) {
    return (
      <AdminPageHeader
        title="Buy a Business"
        description="No acquisition section record found. Run the database seed to create one."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Buy a Business"
        description="Marketplace heading and the business listings shown on the homepage and /buy-business."
      />
      <AcquisitionManager section={section} />
    </div>
  );
}
