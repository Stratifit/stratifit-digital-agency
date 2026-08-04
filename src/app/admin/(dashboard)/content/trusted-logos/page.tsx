import { getAdminTrustedLogos } from "@/features/trusted-logos/admin-queries";
import { getAdminMedia } from "@/features/media/queries";
import { TrustedLogosManager } from "@/components/admin/trusted-logos-manager";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminTrustedLogosPage() {
  const [logos, media] = await Promise.all([
    getAdminTrustedLogos(),
    getAdminMedia(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Trusted Logos"
        description="The client and partner logos shown under the hero."
      />
      <TrustedLogosManager logos={logos} media={media} />
    </div>
  );
}
