import { getAdminUsers } from "@/features/admin-users/queries";
import { AdminList } from "@/components/admin/admin-list";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <AdminList
      title="Admin Users"
      description="Administrators with access to the CMS."
      rows={users}
      rowKey={(u) => u.user_id}
      columns={[
        {
          header: "Name",
          render: (u) => (
            <span className="font-medium">{u.display_name ?? "—"}</span>
          ),
        },
        {
          header: "Role",
          render: (u) => (
            <Badge variant={u.role === "owner" ? "information" : "neutral"}>
              {u.role}
            </Badge>
          ),
        },
        {
          header: "Status",
          render: (u) => (
            <Badge variant={u.status === "active" ? "success" : "error"}>
              {u.status}
            </Badge>
          ),
        },
        {
          header: "Added",
          render: (u) => new Date(u.created_at).toLocaleDateString(),
        },
      ]}
      actions={() => null}
    />
  );
}
