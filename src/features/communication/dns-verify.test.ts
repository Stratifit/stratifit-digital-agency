import { describe, expect, it } from "vitest";
import { buildDnsChecks } from "./dns-verify-utils";
import type { DnsLookupData } from "./dns-verify-utils";

const empty: DnsLookupData = {
  mx: [],
  spfTxt: [],
  dkimTxt: [],
  dmarcTxt: [],
  mailFromMx: [],
};

function check(
  data: DnsLookupData,
  key: string
): { status: string; note?: string; found: string[] } {
  const record = buildDnsChecks("stratifit.com", data).find(
    (r) => r.key === key
  );
  if (!record) throw new Error(`check ${key} missing`);
  return { status: record.status, note: record.note, found: record.found };
}

describe("buildDnsChecks — MX (Zoho inbound)", () => {
  it("reports ok when Zoho EU MX records exist", () => {
    const result = check(
      {
        ...empty,
        mx: [
          { exchange: "mx.zoho.eu", priority: 10 },
          { exchange: "mx2.zoho.eu", priority: 20 },
          { exchange: "mx3.zoho.eu", priority: 50 },
        ],
      },
      "MX"
    );
    expect(result.status).toBe("ok");
  });

  it("reports missing when no MX records exist", () => {
    expect(check(empty, "MX").status).toBe("missing");
  });

  it("reports partial when MX exist but do not point to Zoho", () => {
    const result = check(
      { ...empty, mx: [{ exchange: "aspmx.l.google.com", priority: 10 }] },
      "MX"
    );
    expect(result.status).toBe("partial");
    expect(result.note).toContain("Zoho");
  });
});

describe("buildDnsChecks — SPF", () => {
  it("reports ok when both includes are present", () => {
    const result = check(
      {
        ...empty,
        spfTxt: ["v=spf1 include:amazonses.com include:zoho.eu -all"],
      },
      "SPF"
    );
    expect(result.status).toBe("ok");
  });

  it("reports missing when no SPF record exists", () => {
    expect(check(empty, "SPF").status).toBe("missing");
  });

  it("reports partial when SPF exists but lacks an include", () => {
    const result = check(
      { ...empty, spfTxt: ["v=spf1 include:zoho.eu -all"] },
      "SPF"
    );
    expect(result.status).toBe("partial");
  });
});

describe("buildDnsChecks — DKIM (Zoho)", () => {
  it("reports ok when the zoho._domainkey TXT is published", () => {
    const result = check(
      { ...empty, dkimTxt: ["v=DKIM1; k=rsa; p=MIGfMA0GCSq..."] },
      "DKIM"
    );
    expect(result.status).toBe("ok");
  });

  it("reports missing when the DKIM key is absent", () => {
    expect(check(empty, "DKIM").status).toBe("missing");
  });
});

describe("buildDnsChecks — DMARC", () => {
  it("reports ok when DMARC enforces quarantine or reject", () => {
    const result = check(
      {
        ...empty,
        dmarcTxt: [
          "v=DMARC1; p=quarantine; rua=mailto:postmaster@stratifit.com; fo=1",
        ],
      },
      "DMARC"
    );
    expect(result.status).toBe("ok");
  });

  it("reports partial when DMARC policy is none", () => {
    const result = check(
      { ...empty, dmarcTxt: ["v=DMARC1; p=none"] },
      "DMARC"
    );
    expect(result.status).toBe("partial");
  });

  it("reports missing when no DMARC record exists", () => {
    expect(check(empty, "DMARC").status).toBe("missing");
  });
});

describe("buildDnsChecks — optional SES MAIL FROM", () => {
  it("is optional and does not block allOk", () => {
    const records = buildDnsChecks("stratifit.com", empty);
    expect(records.find((r) => r.key === "MAIL_FROM")?.optional).toBe(true);
  });

  it("reports ok when feedback-smtp MX is published", () => {
    const result = check(
      {
        ...empty,
        mailFromMx: [
          { exchange: "feedback-smtp.eu-north-1.amazonses.com", priority: 10 },
        ],
      },
      "MAIL_FROM"
    );
    expect(result.status).toBe("ok");
  });
});
