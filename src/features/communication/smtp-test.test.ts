import { describe, expect, it } from "vitest";
import { getSendBlockError } from "./smtp-config";

describe("getSendBlockError", () => {
  it("blocks AWS Mail Manager ingress hosts", () => {
    const error = getSendBlockError(
      "jrgurtusuu2d.fips.wmjb.mail-manager-smtp.amazonaws.com",
      "inp-vyg7pudgqsjmetxw2m3d24tv"
    );
    expect(error).toContain("Mail Manager");
    expect(error).toContain("email-smtp");
  });

  it("blocks hosts whose username starts with inp- even if the hostname is masked", () => {
    const error = getSendBlockError("smtp.stratifit.com", "inp-whatever");
    expect(error).toContain("Mail Manager");
  });

  it("allows the real SES SMTP endpoint", () => {
    expect(
      getSendBlockError("email-smtp.us-east-1.amazonaws.com", "AKIAUSERNAME")
    ).toBeNull();
  });

  it("allows an empty config", () => {
    expect(getSendBlockError("", "")).toBeNull();
  });

  it("allows unrelated hosts with normal credentials", () => {
    expect(getSendBlockError("smtp.gmail.com", "user")).toBeNull();
  });
});
