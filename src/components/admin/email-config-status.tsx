import Link from "next/link";

interface EmailConfigStatusProps {
  status: {
    configured: boolean;
    smtp: { host: boolean; port: boolean; user: boolean; pass: boolean };
    fromEmail: boolean;
    replyAs: string[];
    missing: string[];
    warning?: string | null;
  };
}

/**
 * Shows the live email-sending configuration state in the admin. When SMTP is
 * not configured it renders an amber banner listing exactly which environment
 * variables are still missing (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS /
 * COMMUNICATION_FROM_EMAIL), so the setup is actionable instead of a bare
 * "Email sending is not configured." error. When the configured host looks
 * wrong (e.g. an AWS Mail Manager ingress endpoint instead of the SES SMTP
 * endpoint) a red warning is shown even though the variables are present,
 * because that setup accepts mail with 250 OK and silently drops it. Server
 * side env values are read in the page and passed in — nothing secret is ever
 * rendered.
 */
export function EmailConfigStatus({ status }: EmailConfigStatusProps) {
  return (
    <div className="space-y-3">
      {status.warning ? (
        <div
          role="alert"
          className="rounded-card border border-error-border bg-error-soft px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 size-2 shrink-0 rounded-full bg-error"
            />
            <div className="text-sm">
              <p className="font-medium text-error">
                SMTP host looks wrong — emails may never be delivered.
              </p>
              <p className="mt-0.5 leading-relaxed text-text-secondary">
                {status.warning}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                See{" "}
                <Link
                  href="https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-error underline decoration-error/30 underline-offset-2 hover:decoration-error"
                >
                  AWS SES SMTP credentials
                </Link>{" "}
                to create real SES SMTP credentials, verify your sender
                domain/address in SES, and update <code className="rounded bg-card-dark px-1.5 py-0.5 font-mono text-xs text-text-primary">SMTP_HOST</code>{" "}
                and <code className="rounded bg-card-dark px-1.5 py-0.5 font-mono text-xs text-text-primary">SMTP_USER</code> /{" "}
                <code className="rounded bg-card-dark px-1.5 py-0.5 font-mono text-xs text-text-primary">SMTP_PASS</code>.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {status.configured ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-card border border-success-green-border/40 bg-success-soft px-4 py-3"
        >
          <span
            aria-hidden="true"
            className="mt-1 size-2 shrink-0 rounded-full bg-success"
          />
          <div className="text-sm">
            <p className="font-medium text-success">
              Email sending is configured.
            </p>
            <p className="mt-0.5 text-text-secondary">
              SMTP is active and emails can be sent through the Communication
              Engine.
            </p>
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="rounded-card border border-amber-500/30 bg-primary/5 px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-1 size-2 shrink-0 rounded-full bg-primary"
            />
            <div className="text-sm">
              <p className="font-medium text-primary">
                Email sending is not configured yet.
              </p>
              <p className="mt-0.5 leading-relaxed text-text-secondary">
                Add the missing server-side environment variables to{" "}
                <code className="rounded bg-card-dark px-1.5 py-0.5 font-mono text-xs text-text-primary">
                  .env.local
                </code>{" "}
                (and to your hosting provider), then restart the dev server:
              </p>
              <ul className="mt-2 space-y-1">
                {status.missing.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 font-mono text-xs"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-primary/60"
                    />
                    <code className="text-text-primary">{key}</code>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">
                See{" "}
                <Link
                  href="https://docs.aws.amazon.com/ses/latest/dg/smtp-credentials.html"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
                >
                  AWS SES SMTP credentials
                </Link>{" "}
                to create them, and verify your sender domain/address in SES
                before sending.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
