import { describe, expect, it } from "vitest";
import {
  classifySmtpHost,
  getSmtpHostWarning,
  resolveSmtpEnv,
} from "./smtp-config";

describe("classifySmtpHost", () => {
  it("recognizes standard SES SMTP endpoints", () => {
    expect(classifySmtpHost("email-smtp.us-east-1.amazonaws.com")).toBe("ses");
    expect(classifySmtpHost("email-smtp-fips.us-west-2.amazonaws.com")).toBe(
      "ses"
    );
  });

  it("recognizes AWS Mail Manager ingress endpoints", () => {
    expect(
      classifySmtpHost(
        "jrgurtusuu2d.fips.wmjb.mail-manager-smtp.amazonaws.com"
      )
    ).toBe("mail-manager");
    expect(
      classifySmtpHost("abc123.ingress.us-east-1.mail-manager-smtp.amazonaws.com")
    ).toBe("mail-manager");
  });

  it("classifies anything else as other", () => {
    expect(classifySmtpHost("smtp.gmail.com")).toBe("other");
    expect(classifySmtpHost("localhost:1025")).toBe("other");
    expect(classifySmtpHost("")).toBe("other");
    expect(classifySmtpHost("   ")).toBe("other");
  });
});

describe("getSmtpHostWarning", () => {
  it("warns loudly on Mail Manager hosts", () => {
    const warning = getSmtpHostWarning(
      "jrgurtusuu2d.fips.wmjb.mail-manager-smtp.amazonaws.com",
      "inp-vyg7pudgqsjmetxw2m3d24tv"
    );
    expect(warning).toContain("Mail Manager");
    expect(warning).toContain("silently dropped");
  });

  it("warns on inp- prefixed credentials even with a generic host", () => {
    expect(getSmtpHostWarning("smtp.example.com", "inp-abc")).toContain(
      "Mail Manager"
    );
  });

  it("warns generically on non-SES hosts", () => {
    const warning = getSmtpHostWarning("smtp.gmail.com", "user");
    expect(warning).toContain("not a standard AWS SES SMTP endpoint");
  });

  it("returns null for real SES endpoints", () => {
    expect(
      getSmtpHostWarning("email-smtp.us-east-1.amazonaws.com", "AKIA...")
    ).toBeNull();
  });
});

describe("resolveSmtpEnv", () => {
  it("prefers the canonical SES_SMTP_* names", () => {
    const resolved = resolveSmtpEnv({
      SES_SMTP_HOST: "email-smtp.eu-north-1.amazonaws.com",
      SES_SMTP_PORT: "587",
      SES_SMTP_USER: "ses-user",
      SES_SMTP_PASS: "ses-pass",
      SMTP_HOST: "smtp.example.com",
      SMTP_USER: "legacy-user",
      SMTP_PASS: "legacy-pass",
    });
    expect(resolved.host).toBe("email-smtp.eu-north-1.amazonaws.com");
    expect(resolved.user).toBe("ses-user");
    expect(resolved.pass).toBe("ses-pass");
    expect(resolved.port).toBe(587);
    expect(resolved.missing).toEqual([]);
  });

  it("falls back to the legacy SMTP_* names", () => {
    const resolved = resolveSmtpEnv({
      SMTP_HOST: "email-smtp.us-east-1.amazonaws.com",
      SMTP_PORT: "465",
      SMTP_USER: "legacy-user",
      SMTP_PASS: "legacy-pass",
    });
    expect(resolved.host).toBe("email-smtp.us-east-1.amazonaws.com");
    expect(resolved.user).toBe("legacy-user");
    expect(resolved.pass).toBe("legacy-pass");
    expect(resolved.port).toBe(465);
    expect(resolved.missing).toEqual([]);
  });

  it("defaults the port to 587 and reports missing canonical keys", () => {
    const resolved = resolveSmtpEnv({});
    expect(resolved.host).toBeNull();
    expect(resolved.user).toBeNull();
    expect(resolved.pass).toBeNull();
    expect(resolved.port).toBe(587);
    expect(resolved.missing).toEqual([
      "SES_SMTP_HOST",
      "SES_SMTP_USER",
      "SES_SMTP_PASS",
    ]);
  });

  it("treats placeholder values as configured (they will fail auth until replaced)", () => {
    const resolved = resolveSmtpEnv({
      SES_SMTP_HOST: "email-smtp.eu-north-1.amazonaws.com",
      SES_SMTP_USER: "your-ses-smtp-username",
      SES_SMTP_PASS: "your-ses-smtp-password",
    });
    expect(resolved.missing).toEqual([]);
    expect(resolved.host).toContain("amazonaws.com");
  });
});
