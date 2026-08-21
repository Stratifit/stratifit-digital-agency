import { describe, expect, it } from "vitest";
import {
  extractMessageIds,
  isFromSelf,
  normalizeInReplyTo,
  normalizeReferences,
  normalizeSubject,
  plainTextFromHtml,
  resolveThreadId,
  sanitizeFilename,
  summarizeAttachment,
} from "./parse";

describe("extractMessageIds", () => {
  it("extracts bracketed ids from raw headers", () => {
    expect(
      extractMessageIds("<abc@x.com> <def@y.com>")
    ).toEqual(["abc@x.com", "def@y.com"]);
  });

  it("returns an empty array for missing headers", () => {
    expect(extractMessageIds(null)).toEqual([]);
    expect(extractMessageIds(undefined)).toEqual([]);
    expect(extractMessageIds("")).toEqual([]);
  });
});

describe("normalizeSubject", () => {
  it("strips reply prefixes and collapses whitespace", () => {
    expect(normalizeSubject("Re:  Project  update")).toBe("project update");
    expect(normalizeSubject("AW: Angebot")).toBe("angebot");
    expect(normalizeSubject("Fwd: Hello")).toBe("hello");
  });
});

describe("normalizeInReplyTo / normalizeReferences", () => {
  it("handles string, array and absent values", () => {
    expect(normalizeInReplyTo("<a@b.c>")).toBe("<a@b.c>");
    expect(normalizeInReplyTo(["<a@b.c>", "<d@e.f>"])).toBe("<a@b.c>");
    expect(normalizeInReplyTo(null)).toBeNull();
    expect(normalizeReferences("<a@b.c> <d@e.f>")).toEqual([
      "a@b.c",
      "d@e.f",
    ]);
    expect(normalizeReferences(["a@b.c"])).toEqual(["a@b.c"]);
    expect(normalizeReferences(undefined)).toEqual([]);
  });
});

describe("resolveThreadId", () => {
  const messageIdThreads = new Map([
    ["root@stratifit.com", "thread-1"],
    ["reply-2@customer.com", "thread-1"],
  ]);
  const candidates = [
    {
      id: "thread-2",
      customer_email: "bob@example.com",
      subject: "New Website Quote",
      status: "needs_reply",
      last_message_at: "2026-08-20T10:00:00Z",
    },
  ];

  it("resolves via in-reply-to / references message-id index", () => {
    expect(
      resolveThreadId({
        inReplyTo: "<reply-2@customer.com>",
        references: ["root@stratifit.com"],
        messageIdThreads,
        customerEmail: "bob@example.com",
        subject: "Re: New Website Quote",
        candidateThreads: candidates,
      })
    ).toBe("thread-1");
  });

  it("resolves via customer email + normalized subject on open threads", () => {
    expect(
      resolveThreadId({
        inReplyTo: null,
        references: [],
        messageIdThreads: new Map(),
        customerEmail: "bob@example.com",
        subject: "Re: new website quote",
        candidateThreads: candidates,
      })
    ).toBe("thread-2");
  });

  it("returns null when nothing matches (new thread)", () => {
    expect(
      resolveThreadId({
        inReplyTo: null,
        references: [],
        messageIdThreads: new Map(),
        customerEmail: "new@example.com",
        subject: "Completely new enquiry",
        candidateThreads: candidates,
      })
    ).toBeNull();
  });
});

describe("isFromSelf", () => {
  const aliases = ["info@stratifit.com", "Sales@Stratifit.com"];

  it("matches the imap user and aliases case-insensitively", () => {
    expect(isFromSelf("inbox@stratifit.com", "inbox@stratifit.com", [])).toBe(
      true
    );
    expect(isFromSelf("INFO@stratifit.com", "inbox@stratifit.com", aliases)).toBe(
      true
    );
    expect(isFromSelf("sales@stratifit.com", "inbox@stratifit.com", aliases)).toBe(
      true
    );
  });

  it("rejects foreign senders and empty values", () => {
    expect(isFromSelf("client@example.com", "inbox@stratifit.com", aliases)).toBe(
      false
    );
    expect(isFromSelf("", "inbox@stratifit.com", aliases)).toBe(false);
    expect(isFromSelf("  ", "inbox@stratifit.com", aliases)).toBe(false);
  });
});

describe("plainTextFromHtml", () => {
  it("converts HTML to clean text", () => {
    const html =
      "<p>Hello <b>world</b></p><p>Line two</p><br/>Done &amp; dusted";
    const text = plainTextFromHtml(html);
    expect(text).toContain("Hello world");
    expect(text).toContain("Line two");
    expect(text).toContain("Done & dusted");
  });

  it("strips style and script blocks", () => {
    const html = "<style>p{color:red}</style><p>Hi</p><script>alert(1)</script>";
    const text = plainTextFromHtml(html);
    expect(text).not.toContain("color:red");
    expect(text).not.toContain("alert");
    expect(text).toContain("Hi");
  });
});

describe("summarizeAttachment / sanitizeFilename", () => {
  it("normalizes attachment metadata", () => {
    expect(
      summarizeAttachment({
        filename: "invoice.pdf",
        contentType: "application/pdf",
        size: 1234,
      })
    ).toEqual({
      name: "invoice.pdf",
      mimeType: "application/pdf",
      size: 1234,
      contentId: null,
    });
    expect(summarizeAttachment({})).toBeNull();
  });

  it("sanitizes filenames into storage-safe keys", () => {
    expect(sanitizeFilename("My Invoice (final).pdf")).toBe(
      "My_Invoice_final_.pdf"
    );
    expect(sanitizeFilename("../../etc/passwd")).toBe("etc_passwd");
  });
});
