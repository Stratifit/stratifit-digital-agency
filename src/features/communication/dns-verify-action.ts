"use server";

import { verifyDomainDns, type DnsVerificationResult } from "./dns-verify";

export type { DnsVerificationResult };

/**
 * Server action for the admin dashboard "Run DNS check" button. Resolves the
 * live MX / SPF / DKIM / DMARC records for the sending domain (derived from
 * COMMUNICATION_FROM_EMAIL, falling back to stratifit.com) and returns what is
 * published, what is missing, and what is misconfigured.
 */
export async function verifyEmailDnsAction(): Promise<DnsVerificationResult> {
  const fromEmail = process.env.COMMUNICATION_FROM_EMAIL ?? "";
  const domain = fromEmail.split("@").pop()?.trim() || "stratifit.com";
  return verifyDomainDns(domain);
}
