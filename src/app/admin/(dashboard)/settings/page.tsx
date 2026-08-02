import { getPublicSiteSettings } from "@/features/site-settings/queries";
import {
  SiteSettingsForm,
  type SiteSettingsInitial,
} from "@/components/admin/site-settings-form";

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
    social: settings?.social_links ?? {},
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Site Settings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Manage your site identity, contact details, and social links.
        </p>
      </div>
      <div className="rounded-md border border-border bg-surface p-6">
        <SiteSettingsForm initial={initial} />
      </div>
    </div>
  );
}
