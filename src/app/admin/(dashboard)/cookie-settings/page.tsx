import { getAdminCookieSettings } from "@/features/cookie-settings/queries";
import { CookieSettingsForm } from "@/components/admin/cookie-settings-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export const metadata = {
  title: "Cookie Settings",
};

export default async function AdminCookieSettingsPage() {
  const settings = await getAdminCookieSettings();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Cookie Settings"
        description="Manage the cookie consent banner: on/off toggles, multilingual copy, and cookie categories."
      />
      <FormCard>
        <CookieSettingsForm initial={settings} />
      </FormCard>
    </div>
  );
}
