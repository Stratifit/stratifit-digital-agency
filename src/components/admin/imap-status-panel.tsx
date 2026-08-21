import type { ImapStatus } from "@/features/email-imap/status";
import { Badge } from "@/components/ui/badge";

function formatTime(value: string | null): string {
  if (!value) return "never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "never";
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        {children}
      </div>
    </div>
  );
}

export function ImapStatusPanel({ status }: { status: ImapStatus }) {
  const configVariant: "success" | "error" | "warning" =
    !status.configured && status.placeholders.length > 0
      ? "warning"
      : status.configured
        ? "success"
        : "error";
  const configLabel = status.configured
    ? "Configured"
    : status.placeholders.length > 0
      ? "Placeholder values"
      : "Not configured";

  const reachableVariant: "success" | "error" = status.reachable
    ? "success"
    : "error";

  const problems = [...status.missing, ...status.placeholders];

  return (
    <div className="rounded-card border border-card-border bg-card-dark p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">
            Zoho IMAP inbox sync
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">
            Pulls inbound replies from the Zoho mailbox into these
            conversations. Runs hourly via cron, or on demand with the Sync
            button.
          </p>
        </div>
        <Badge variant={configVariant}>{configLabel}</Badge>
      </div>

      <div className="mt-3 divide-y divide-border border-y border-border">
        <StatusRow label="Config">
          {status.configured ? (
            <span className="font-medium text-text-primary">
              {status.host}:{status.port}
            </span>
          ) : (
            <span className="text-error">
              {problems.length > 0
                ? `Missing/placeholder: ${problems.join(", ")}`
                : "No IMAP_* environment variables found"}
            </span>
          )}
        </StatusRow>
        <StatusRow label="Server">
          {status.reachable ? (
            <>
              <Badge variant={reachableVariant}>Reachable</Badge>
              <span className="max-w-[420px] truncate text-xs text-text-muted">
                {status.banner}
              </span>
            </>
          ) : (
            <>
              <Badge variant={reachableVariant}>Unreachable</Badge>
              {status.reachabilityError ? (
                <span className="text-xs text-text-muted">
                  {status.reachabilityError}
                </span>
              ) : null}
            </>
          )}
        </StatusRow>
        <StatusRow label="Mailboxes swept">
          <span className="text-text-secondary">
            {status.mailboxes.join(", ")}
          </span>
        </StatusRow>
        <StatusRow label="Reply-as addresses">
          <span className="max-w-[420px] truncate text-xs text-text-muted">
            {status.senderAddresses.length > 0
              ? status.senderAddresses.join(", ")
              : "none configured"}
          </span>
        </StatusRow>
        <StatusRow label="Last inbound email">
          <span className="text-text-secondary">
            {formatTime(status.lastImapMessageAt)}
          </span>
        </StatusRow>
        <StatusRow label="Synced conversations">
          <span className="font-medium text-text-primary">
            {status.imapThreads}
          </span>
        </StatusRow>
      </div>

      {status.senderAddresses.length > 0 ? (
        <div className="mt-3 rounded-card bg-surface px-3 py-2.5 text-xs leading-relaxed text-text-muted">
          <p>
            <span className="font-semibold text-text-secondary">
              Receiving replies:{" "}
            </span>
            every reply-as address must exist in Zoho as a mailbox or an alias
            of the synced account ({" "}
            <code className="rounded-sm bg-surface-hover px-1 py-0.5">IMAP_USER</code>
            ). Replies sent to an address that is not a Zoho mailbox or alias
            of that account will not arrive in this inbox. Set them up under
            Zoho Mail → Settings → Mail Accounts → Aliases.
          </p>
        </div>
      ) : null}

      {!status.configured ? (
        <div className="mt-3 rounded-card bg-warning-soft px-3 py-2.5 text-xs leading-relaxed text-text-secondary">
          <p className="font-semibold text-text-primary">
            To start receiving emails in this inbox:
          </p>
          <ol className="mt-1 list-decimal space-y-1 pl-4">
            <li>
              Create a Zoho app password: Zoho Mail → Profile → App Passwords
              (enable IMAP for the mailbox).
            </li>
            <li>
              Set <code className="rounded-sm bg-surface-hover px-1 py-0.5">IMAP_USER</code>{" "}
              to the Zoho mailbox address and{" "}
              <code className="rounded-sm bg-surface-hover px-1 py-0.5">IMAP_PASS</code> to the
              app password — in{" "}
              <code className="rounded-sm bg-surface-hover px-1 py-0.5">.env.local</code> and
              in Vercel → Settings → Environment Variables.
            </li>
            <li>Click “Sync IMAP inbox” — messages appear here within seconds.</li>
          </ol>
        </div>
      ) : null}
    </div>
  );
}
