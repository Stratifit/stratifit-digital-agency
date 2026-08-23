import { notFound } from "next/navigation";
import { ContentForm } from "@/components/admin/content/content-form";
import { getContentItem } from "@/features/content/get-admin-item";
import { getAdminServices } from "@/features/content/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { FormCard } from "@/components/admin/form-card";

export default async function EditPortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getContentItem("portfolio", slug);
  if (!item) notFound();
  const services = await getAdminServices();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Portfolio Project" description={slug} />
      <FormCard>
        <ContentForm type="portfolio" id={slug} initial={item} services={services} />
      </FormCard>
    </div>
  );
}
