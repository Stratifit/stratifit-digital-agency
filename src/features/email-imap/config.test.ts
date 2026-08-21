import { describe, expect, it } from "vitest";
import { isPlaceholderValue, resolveImapConfig } from "./config";

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
      mailboxes: ["INBOX"],
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

  it("parses multiple mailboxes from IMAP_MAILBOXES", () => {
    const result = resolveImapConfig({
      IMAP_HOST: "imap.zoho.eu",
      IMAP_USER: "u",
      IMAP_PASS: "p",
      IMAP_MAILBOXES: "INBOX, Junk",
    });
    expect(result.config?.mailboxes).toEqual(["INBOX", "Junk"]);
    expect(result.config?.mailbox).toBe("INBOX");
  });

  it("defaults to INBOX when no mailbox is configured", () => {
    const result = resolveImapConfig({
      IMAP_HOST: "imap.zoho.eu",
      IMAP_USER: "u",
      IMAP_PASS: "p",
    });
    expect(result.config?.mailboxes).toEqual(["INBOX"]);
  });

  it("reports missing keys and returns no config", () => {
    const result = resolveImapConfig({});
    expect(result.config).toBeNull();
    expect(result.missing).toEqual(["IMAP_HOST", "IMAP_USER", "IMAP_PASS"]);
    expect(result.placeholders).toEqual([]);
  });

  it("treats placeholder values as not configured", () => {
    const result = resolveImapConfig({
      IMAP_HOST: "imap.zoho.eu",
      IMAP_USER: "your-zoho-email@stratifit.com",
      IMAP_PASS: "your-zoho-app-password",
    });
    expect(result.config).toBeNull();
    expect(result.placeholders).toEqual(["IMAP_USER", "IMAP_PASS"]);
  });

  it("does not flag real-looking addresses", () => {
    const result = resolveImapConfig({
      IMAP_HOST: "imap.zoho.eu",
      IMAP_USER: "inbox@stratifit.com",
      IMAP_PASS: "aB3dE9fG1hJ2kL4mN",
    });
    expect(result.config).not.toBeNull();
    expect(result.placeholders).toEqual([]);
  });

  it("isPlaceholderValue matches common placeholder patterns", () => {
    expect(isPlaceholderValue("your-zoho-app-password")).toBe(true);
    expect(isPlaceholderValue("your-zoho-email@stratifit.com")).toBe(true);
    expect(isPlaceholderValue("changeme")).toBe(true);
    expect(isPlaceholderValue("name@example.com")).toBe(true);
    expect(isPlaceholderValue("inbox@stratifit.com")).toBe(false);
    expect(isPlaceholderValue("aB3dE9fG1hJ2kL4mN")).toBe(false);
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
