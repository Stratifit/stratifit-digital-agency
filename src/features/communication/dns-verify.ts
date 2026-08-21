import "server-only";
import { resolveMx, resolveTxt } from "node:dns/promises";
import { buildDnsChecks, type DnsLookupData } from "./dns-verify-utils";

/**
 * DNS verification for the email domain. Checks the records required for the
 * Stratifit email setup:
 *
 *   MX      — Zoho Mail EU (mx.zoho.eu / mx2.zoho.eu / mx3.zoho.eu) for inbound
 *   SPF     — v=spf1 include:amazonses.com include:zoho.eu -all
 *   DKIM    — TXT on zoho._domainkey.<domain> (from the Zoho admin console)
 *   DMARC   — TXT on _dmarc.<domain>
 *   MAIL FROM — optional MX on bounce.<domain> for the SES custom MAIL FROM
 *
 * Classification logic lives in `dns-verify-utils.ts` (pure, unit-tested);
 * this module only performs the live lookups.
 */

export type {
  DnsCheckStatus,
  DnsLookupData,
  DnsRecordCheck,
} from "./dns-verify-utils";

export interface DnsVerificationResult {
  domain: string;
  checkedAt: string;
  records: ReturnType<typeof buildDnsChecks>;
  allOk: boolean;
}

async function resolveMxSafe(
  name: string
): Promise<{ exchange: string; priority: number }[]> {
  try {
    return await resolveMx(name);
  } catch {
    return [];
  }
}

async function resolveTxtSafe(name: string): Promise<string[]> {
  try {
    const rows = await resolveTxt(name);
    return rows.map((row) => row.join(""));
  } catch {
    return [];
  }
}

/** Live DNS verification for a domain (server-side only). */
export async function verifyDomainDns(
  domain: string
): Promise<DnsVerificationResult> {
  const cleaned = domain.trim().toLowerCase().replace(/^\.+|\.+$/g, "");
  const data: DnsLookupData = {
    mx: await resolveMxSafe(cleaned),
    spfTxt: await resolveTxtSafe(cleaned),
    dkimTxt: await resolveTxtSafe(`zoho._domainkey.${cleaned}`),
    dmarcTxt: await resolveTxtSafe(`_dmarc.${cleaned}`),
    mailFromMx: await resolveMxSafe(`bounce.${cleaned}`),
  };
  const records = buildDnsChecks(cleaned, data);
  return {
    domain: cleaned,
    checkedAt: new Date().toISOString(),
    records,
    allOk: records
      .filter((r) => !r.optional)
      .every((r) => r.status === "ok"),
  };
}
