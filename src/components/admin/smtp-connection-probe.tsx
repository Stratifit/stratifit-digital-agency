"use client";

import * as React from "react";
import {
  testSmtpConnectionAction,
  type SmtpProbeResult,
} from "@/features/communication/smtp-test-action";
import { cn } from "@/lib/cn";

/**
 * "Test SMTP connection" button for the admin Communication page. Runs a live
 * probe against the configured relay (banner + credentials) and shows exactly
 * which relay is in use and whether mail will actually be delivered:
 * real SES SMTP endpoint, an AWS Mail Manager ingress gateway (accepts then
 * drops), or something else entirely.
 */
export function SmtpConnectionProbe() {
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<SmtpProbeResult | null>(null);

  async function runProbe() {
    setBusy(true);
    try {
      const res = await testSmtpConnectionAction();
      setResult(res);
    } finally {
      setBusy(false);
    }
  }

  const mailManager = result?.kind === "mail-manager";
  const ses = result?.kind === "ses";

  return (
    <div className="rounded-card border border-card-border bg-card-dark p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Test SMTP connection
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            Probes the configured relay and credentials. Never sends an email.
          </p>
        </div>
        <button
          type="button"
          onClick={runProbe}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-button border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Testing…" : "Test connection"}
        </button>
      </div>

      {result ? (
        <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
          {!result.configured ? (
            <p className="text-text-secondary">{result.error}</p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-text-secondary">
                  {result.host}:{result.port}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    mailManager
                      ? "border-error-border bg-error-soft text-error"
                      : ses
                        ? "border-success-green-border/40 bg-success-soft text-success"
                        : "border-amber-500/30 bg-primary/5 text-primary"
                  )}
                >
                  {mailManager
                    ? "Mail Manager ingress (drops mail)"
                    : ses
                      ? "AWS SES SMTP"
                      : "Unknown relay"}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    result.authOk
                      ? "border-success-green-border/40 bg-success-soft text-success"
                      : "border-error-border bg-error-soft text-error"
                  )}
                >
                  {result.authOk ? "Credentials OK" : "Credentials failed"}
                </span>
              </div>
              {result.banner ? (
                <p className="font-mono text-[11px] text-text-muted">
                  Banner: {result.banner}
                </p>
              ) : null}
              {result.error ? (
                <p className="rounded bg-error-soft px-2.5 py-1.5 text-error">
                  {result.error}
                </p>
              ) : null}
              {result.warning ? (
                <p className="rounded bg-error-soft px-2.5 py-1.5 leading-relaxed text-error">
                  {result.warning}
                </p>
              ) : null}
              {ses && result.authOk ? (
                <p className="rounded bg-success-soft px-2.5 py-1.5 leading-relaxed text-success">
                  Relay is real AWS SES SMTP and credentials authenticate.
                  Delivery now depends on SES sandbox status, verified sender
                  identity, SPF/DKIM DNS records, and the SNS delivery webhook.
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
