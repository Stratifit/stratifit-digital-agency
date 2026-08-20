import { describe, expect, it } from "vitest";
import { classifySmtpHost, getSmtpHostWarning } from "./smtp-config";

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
