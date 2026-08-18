import { AdminPageHeader } from "@/components/admin/page-header";
import { EmailTemplatesManager } from "@/components/admin/email-templates-form";
import { getEmailTemplatesForAdmin } from "@/features/communication/queries";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_TYPES,
} from "@/features/communication/types";

export const metadata = {
  title: "Communication — Templates",
};

interface PageProps {
  searchParams: Promise<{ type?: string; category?: string }>;
}

export default async function AdminCommunicationTemplatesPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const type = (TEMPLATE_TYPES as readonly string[]).includes(
    params.type ?? ""
  )
    ? (params.type as "auto" | "manual")
    : undefined;
  const category = (TEMPLATE_CATEGORIES as readonly string[]).includes(
    params.category ?? ""
  )
    ? (params.category as (typeof TEMPLATE_CATEGORIES)[number])
    : undefined;

  const templates = await getEmailTemplatesForAdmin({ templateType: type, category });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="Email Templates"
        description="All automatic replies and manual templates in en / de / fr / es. Edit content in plain language — {{placeholders}} are auto-filled when sending."
      />
      <EmailTemplatesManager
        templates={templates}
        activeCategory={params.category}
        activeType={params.type}
      />
    </div>
  );
}
