import { getPublicSiteSettings } from "@/features/site-settings/queries";
import {
  SiteSettingsForm,
  type SiteSettingsInitial,
} from "@/components/admin/site-settings-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function AdminSettingsPage() {
  const settings = await getPublicSiteSettings();

  const initial: SiteSettingsInitial = {
    site_name: settings?.site_name ?? "Stratifit",
    site_description_en:
      settings?.site_description_translations?.en ?? "",
    contact_email: settings?.contact_email ?? "",
    contact_phone: settings?.contact_phone ?? "",
    address_en: settings?.address_translations?.en ?? "",
    default_locale: settings?.default_locale ?? "en",
    seo_title_en: settings?.default_seo?.en?.title ?? "",
    seo_description_en: settings?.default_seo?.en?.description ?? "",
    social: settings?.social_links ?? {},
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Site Settings"
        description="Manage your site identity, contact details, and social links."
      />
      <FormCard>
        <SiteSettingsForm initial={initial} />
      </FormCard>
    </div>
  );
}
