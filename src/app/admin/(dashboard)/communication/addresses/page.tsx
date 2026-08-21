import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailConfigStatus } from "@/components/admin/email-config-status";
import { SenderAddressesManager } from "@/components/admin/sender-addresses-manager";
import { getSenderAddressRecords } from "@/features/communication/sender-addresses";
import { getEmailConfigStatus } from "@/features/communication/sender";

export const metadata = {
  title: "Communication — Sender Addresses",
};

export default async function AdminSenderAddressesPage() {
  const addresses = await getSenderAddressRecords();
  const configStatus = getEmailConfigStatus();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="Sender Addresses"
        description="The addresses emails are sent from and customers reply to — e.g. hello@stratifit.com, support@stratifit.com, info@stratifit.com."
      />
      <EmailConfigStatus status={configStatus} />
      <SenderAddressesManager addresses={addresses} />
    </div>
  );
}
