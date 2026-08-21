"use client";

import * as React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Globe } from "lucide-react";
import {
  verifyEmailDnsAction,
  type DnsVerificationResult,
} from "@/features/communication/dns-verify-action";
import { cn } from "@/lib/cn";

/**
 * "Run DNS check" panel for the admin Communication page. Resolves the live
 * MX / SPF / DKIM / DMARC records for the sending domain and shows exactly
 * what is published, missing, or misconfigured — so deliverability problems
 * (no SPF/DKIM/DMARC, wrong inbound MX) are visible instead of mysterious.
 */
export function DnsCheckPanel() {
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<DnsVerificationResult | null>(null);

  async function runCheck() {
    setBusy(true);
    try {
      const res = await verifyEmailDnsAction();
      setResult(res);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-card border border-card-border bg-card-dark p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-text-primary">
              Domain authentication (DNS)
            </p>
            <p className="mt-0.5 text-xs text-text-muted">
              Verifies live MX, SPF, DKIM and DMARC records. DNS changes take
              up to 24h to propagate.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={runCheck}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-button border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Checking…" : "Run DNS check"}
        </button>
      </div>

      {result ? (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <p className="text-xs text-text-muted">
            Domain: <span className="font-mono text-text-secondary">{result.domain}</span>
            {result.allOk ? (
              <span className="ml-2 rounded-full border border-success-green-border/40 bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
                All required records OK
              </span>
            ) : (
              <span className="ml-2 rounded-full border border-error-border bg-error-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-error">
                Missing or misconfigured records
              </span>
            )}
          </p>

          <div className="space-y-1.5">
            {result.records.map((record) => (
              <div
                key={record.key}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  record.status === "ok"
                    ? "border-success-green-border/30 bg-success-soft/40"
                    : record.status === "partial"
                      ? "border-amber-500/30 bg-primary/5"
                      : "border-error-border/40 bg-error-soft/30"
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {record.status === "ok" ? (
                    <CheckCircle2 className="size-3.5 text-success" aria-hidden="true" />
                  ) : record.status === "partial" ? (
                    <AlertTriangle className="size-3.5 text-primary" aria-hidden="true" />
                  ) : (
                    <XCircle className="size-3.5 text-error" aria-hidden="true" />
                  )}
                  <span className="text-xs font-semibold text-text-primary">
                    {record.label}
                  </span>
                  {record.optional ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-text-muted">
                      optional
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "ml-auto rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      record.status === "ok"
                        ? "border-success-green-border/40 bg-success-soft text-success"
                        : record.status === "partial"
                          ? "border-amber-500/30 bg-primary/5 text-primary"
                          : "border-error-border bg-error-soft text-error"
                    )}
                  >
                    {record.status}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-text-muted">
                  {record.name}
                </p>
                <p className="mt-0.5 text-[11px] text-text-secondary">
                  Expected: {record.expected}
                </p>
                {record.found.length > 0 ? (
                  <p className="mt-0.5 font-mono text-[11px] text-success">
                    Found: {record.found.join(" · ")}
                  </p>
                ) : null}
                {record.note ? (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-error">
                    {record.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
