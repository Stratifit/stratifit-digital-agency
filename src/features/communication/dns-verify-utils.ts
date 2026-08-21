/**
 * Pure DNS record classification for the Communication Engine (no server-only
 * import, no network) so the logic is unit-testable. Live resolution happens
 * in `dns-verify.ts`.
 */

export type DnsCheckStatus = "ok" | "partial" | "missing" | "error";

export interface DnsRecordCheck {
  key: "MX" | "SPF" | "DKIM" | "DMARC" | "MAIL_FROM";
  label: string;
  name: string;
  /** What should be published, for the admin UI. */
  expected: string;
  status: DnsCheckStatus;
  /** Values actually found on the domain. */
  found: string[];
  note?: string;
  /** Optional checks do not block "all good" (e.g. custom MAIL FROM). */
  optional?: boolean;
}

export interface DnsLookupData {
  mx: { exchange: string; priority: number }[];
  spfTxt: string[];
  dkimTxt: string[];
  dmarcTxt: string[];
  mailFromMx: { exchange: string; priority: number }[];
}

function fmtMx(mx: { exchange: string; priority: number }[]): string[] {
  return mx
    .slice()
    .sort((a, b) => a.priority - b.priority)
    .map((m) => `${m.priority} ${m.exchange}`);
}

export function buildDnsChecks(
  domain: string,
  data: DnsLookupData
): DnsRecordCheck[] {
  const zohoHosts = data.mx.filter((m) => /(^|\.)zoho\.eu$/i.test(m.exchange));
  const mxCheck: DnsRecordCheck = {
    key: "MX",
    label: "MX (inbound — Zoho Mail EU)",
    name: domain,
    expected: "mx.zoho.eu / mx2.zoho.eu / mx3.zoho.eu",
    status:
      data.mx.length === 0
        ? "missing"
        : zohoHosts.length > 0
          ? "ok"
          : "partial",
    found: fmtMx(data.mx),
    note:
      data.mx.length > 0 && zohoHosts.length === 0
        ? "MX records exist but do not point to Zoho Mail EU — inbound mail will not reach the Zoho mailbox."
        : data.mx.length === 0
          ? "No MX records. Inbound mail (customer replies) cannot be delivered to Zoho Mail EU."
          : undefined,
  };

  const spfRecord = data.spfTxt.find((t) => /^v=spf1/i.test(t));
  const spfOk =
    !!spfRecord &&
    /include:amazonses\.com/i.test(spfRecord) &&
    /include:zoho\.eu/i.test(spfRecord);
  const spfCheck: DnsRecordCheck = {
    key: "SPF",
    label: "SPF (authorizes SES + Zoho senders)",
    name: domain,
    expected: "v=spf1 include:amazonses.com include:zoho.eu -all",
    status:
      spfRecord === undefined
        ? "missing"
        : spfOk
          ? "ok"
          : spfRecord.includes("v=spf1")
            ? "partial"
            : "error",
    found: spfRecord ? [spfRecord] : [],
    note:
      spfRecord && !spfOk
        ? "An SPF record exists but is missing include:amazonses.com and/or include:zoho.eu. Mail may be flagged as spam."
        : spfRecord === undefined
          ? "No SPF record. Without it, Gmail/Outlook often quarantine or reject mail."
          : undefined,
  };

  const dkimTxt = data.dkimTxt.filter((t) => t.trim().length > 0).join(" ");
  const dkimCheck: DnsRecordCheck = {
    key: "DKIM",
    label: "DKIM (Zoho signing key)",
    name: `zoho._domainkey.${domain}`,
    expected: "TXT value from Zoho Mail admin console",
    status: dkimTxt ? "ok" : "missing",
    found: dkimTxt ? [dkimTxt.slice(0, 160)] : [],
    note: dkimTxt
      ? undefined
      : "No DKIM key. Publish the TXT value shown in Zoho Mail admin (Domain → DKIM) to sign mail.",
  };

  const dmarcRecord = data.dmarcTxt.find((t) => /^v=DMARC1/i.test(t));
  const dmarcOk =
    !!dmarcRecord && /p=(quarantine|reject)/i.test(dmarcRecord);
  const dmarcCheck: DnsRecordCheck = {
    key: "DMARC",
    label: "DMARC (policy)",
    name: `_dmarc.${domain}`,
    expected: "v=DMARC1; p=quarantine; rua=mailto:postmaster@stratifit.com",
    status:
      dmarcRecord === undefined
        ? "missing"
        : dmarcOk
          ? "ok"
          : dmarcRecord.includes("v=DMARC1")
            ? "partial"
            : "error",
    found: dmarcRecord ? [dmarcRecord] : [],
    note:
      dmarcRecord && !dmarcOk
        ? "DMARC exists but does not enforce a policy (p=none or missing p=). Consider p=quarantine."
        : dmarcRecord === undefined
          ? "No DMARC record. Add one to protect the domain from spoofing and improve deliverability."
          : undefined,
  };

  const sesHosts = data.mailFromMx.filter((m) =>
    /^feedback-smtp\.[a-z0-9-]+\.amazonses\.com$/i.test(m.exchange)
  );
  const mailFromCheck: DnsRecordCheck = {
    key: "MAIL_FROM",
    label: "SES MAIL FROM (optional)",
    name: `bounce.${domain}`,
    expected: "10 feedback-smtp.eu-north-1.amazonses.com",
    status: sesHosts.length > 0 ? "ok" : "missing",
    found: fmtMx(data.mailFromMx),
    optional: true,
    note:
      sesHosts.length > 0
        ? undefined
        : "Optional: set when you enable a custom MAIL FROM domain in the SES console.",
  };

  return [mxCheck, spfCheck, dkimCheck, dmarcCheck, mailFromCheck];
}
