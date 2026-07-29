// ============================================================================
// Stratifit — Admin Logout Button
// ============================================================================

"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/admin/ui/Button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  );
}
