import type { CurrentAdmin } from "@/actions/auth";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({
  admin,
  children,
}: {
  admin: CurrentAdmin;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar admin={admin} />
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
