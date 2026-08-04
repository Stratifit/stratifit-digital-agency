import { getAdminLeads } from "@/features/leads/admin-queries";
import { LeadsTable } from "@/components/admin/leads-table";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminLeadsPage() {
  const leads = await getAdminLeads();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Leads"
        description="Enquiries submitted through public forms and chat."
      />
      <LeadsTable leads={leads} />
    </div>
  );
}
