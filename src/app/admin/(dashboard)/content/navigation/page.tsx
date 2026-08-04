import { getAdminNavigationItems } from "@/features/navigation/admin-queries";
import { NavigationManager } from "@/components/admin/navigation-manager";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminNavigationPage() {
  const items = await getAdminNavigationItems();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Navigation"
        description="Links shown in the header and footer, in all four languages."
      />
      <NavigationManager items={items} />
    </div>
  );
}
