import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/actions/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
