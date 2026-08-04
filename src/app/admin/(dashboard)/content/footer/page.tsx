import { getAdminFooterGroups } from "@/features/footer/admin-queries";
import { FooterManager } from "@/components/admin/footer-manager";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminFooterPage() {
  const groups = await getAdminFooterGroups();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Footer"
        description="Footer link groups shown at the bottom of every page."
      />
      <FooterManager groups={groups} />
    </div>
  );
}
