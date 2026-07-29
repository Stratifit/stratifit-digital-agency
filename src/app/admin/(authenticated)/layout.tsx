// ============================================================================
// Stratifit — Admin Layout
// Server component with role-based auth guard and sidebar.
// ============================================================================

import { redirect } from "next/navigation";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = await isCurrentUserAdmin();

  // Middleware handles session check; this layout handles the admin role check.
  if (!user) {
    redirect("/admin/login");
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-display text-display-md text-white mb-4">
            Access Denied
          </h1>
          <p className="font-body text-body-lg text-neutral-400 mb-6">
            You need admin privileges to access this area. Contact your
            administrator to grant access.
          </p>
          <pre className="text-left text-caption text-neutral-500 bg-surface-darkCard p-4 rounded-xl border border-surface-darkBorder overflow-auto">
            {`-- Grant admin role via Supabase SQL Editor:\n\nUPDATE profiles\nSET role = 'admin'\nWHERE user_id = '${user.id}';`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-dark">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-surface-darkBorder flex items-center justify-end px-6 bg-surface-darkAlt">
          <div className="flex items-center gap-3">
            <span className="font-body text-body-sm text-neutral-400">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
