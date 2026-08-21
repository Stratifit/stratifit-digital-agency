import { describe, expect, it } from "vitest";
import { resolveImapConfig } from "./config";

describe("resolveImapConfig", () => {
  it("resolves a full config with defaults", () => {
    const result = resolveImapConfig({
      IMAP_HOST: "imap.zoho.eu",
      IMAP_PORT: "993",
      IMAP_USER: "inbox@stratifit.com",
      IMAP_PASS: "app-password",
    });
    expect(result.missing).toEqual([]);
    expect(result.config).toEqual({
      host: "imap.zoho.eu",
      port: 993,
      user: "inbox@stratifit.com",
      pass: "app-password",
      mailbox: "INBOX",
      sinceDays: 7,
      secure: true,
    });
  });

  it("honors overrides for mailbox and sync window", () => {
    const result = resolveImapConfig({
      IMAP_HOST: "imap.zoho.eu",
      IMAP_USER: "u",
      IMAP_PASS: "p",
      IMAP_MAILBOX: "Support",
      IMAP_SYNC_SINCE_DAYS: "30",
    });
    expect(result.config?.mailbox).toBe("Support");
    expect(result.config?.sinceDays).toBe(30);
  });

  it("reports missing keys and returns no config", () => {
    const result = resolveImapConfig({});
    expect(result.config).toBeNull();
    expect(result.missing).toEqual(["IMAP_HOST", "IMAP_USER", "IMAP_PASS"]);
  });

  it("clamps the sync window to 1..90 days", () => {
    const config = resolveImapConfig({
      IMAP_HOST: "h",
      IMAP_USER: "u",
      IMAP_PASS: "p",
      IMAP_SYNC_SINCE_DAYS: "500",
    });
    expect(config.config?.sinceDays).toBe(90);
  });

  it("defaults to TLS on port 993 and never plaintext", () => {
    const config = resolveImapConfig({
      IMAP_HOST: "imap.zoho.eu",
      IMAP_PORT: "143",
      IMAP_USER: "u",
      IMAP_PASS: "p",
    });
    expect(config.config?.port).toBe(143);
    expect(config.config?.secure).toBe(true);
  });
});
