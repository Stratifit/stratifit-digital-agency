import type { CurrentAdmin } from "@/actions/auth";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function Topbar({ admin }: { admin: CurrentAdmin }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">
          {admin.display_name ?? admin.email}
        </p>
        <p className="text-xs capitalize text-text-muted">{admin.role}</p>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="secondary" size="small">
          Sign Out
        </Button>
      </form>
    </header>
  );
}
