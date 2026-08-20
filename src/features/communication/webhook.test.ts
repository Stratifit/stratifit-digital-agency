import { describe, expect, it } from "vitest";
import {
  messageIdCandidates,
  parseEmailWebhookPayload,
} from "./webhook";

describe("parseEmailWebhookPayload", () => {
  it("parses a real SES Delivery event from an SNS Notification envelope", () => {
    const payload = parseEmailWebhookPayload({
      Type: "Notification",
      Message: JSON.stringify({
        eventType: "Delivery",
        mail: { messageId: "0000018f00000000-1111-2222-3333-amazonses.com" },
      }),
    });
    expect(payload).toEqual({
      kind: "event",
      messageId: "0000018f00000000-1111-2222-3333-amazonses.com",
      status: "delivered",
    });
  });

  it("maps SES Bounce and Complaint events to their statuses", () => {
    const bounce = parseEmailWebhookPayload({
      Type: "Notification",
      Message: JSON.stringify({
        eventType: "Bounce",
        mail: { messageId: "bounce-1" },
      }),
    });
    expect(bounce).toEqual({ kind: "event", messageId: "bounce-1", status: "bounced" });

    const complaint = parseEmailWebhookPayload({
      Type: "Notification",
      Message: JSON.stringify({
        eventType: "Complaint",
        mail: { messageId: "complaint-1" },
      }),
    });
    expect(complaint).toEqual({
      kind: "event",
      messageId: "complaint-1",
      status: "complained",
    });
  });

  it("parses the legacy flat format", () => {
    const payload = parseEmailWebhookPayload({
      messageId: "flat-1",
      eventType: "delivered",
    });
    expect(payload).toEqual({ kind: "event", messageId: "flat-1", status: "delivered" });
  });

  it("returns subscription confirmation with the SubscribeURL", () => {
    const payload = parseEmailWebhookPayload({
      Type: "SubscriptionConfirmation",
      SubscribeURL: "https://sns.us-east-1.amazonaws.com/confirm?token=abc",
    });
    expect(payload).toEqual({
      kind: "subscription_confirmation",
      subscribeUrl: "https://sns.us-east-1.amazonaws.com/confirm?token=abc",
    });
  });

  it("returns unknown for malformed or unrecognized payloads", () => {
    expect(parseEmailWebhookPayload(null)).toEqual({ kind: "unknown" });
    expect(parseEmailWebhookPayload("nope")).toEqual({ kind: "unknown" });
    expect(parseEmailWebhookPayload({})).toEqual({ kind: "unknown" });
    expect(parseEmailWebhookPayload({ eventType: "delivered" })).toEqual({
      kind: "unknown",
    });
    // Unknown SES event type (e.g. Open/Click) → unknown, never a wrong status.
    expect(
      parseEmailWebhookPayload({
        Type: "Notification",
        Message: JSON.stringify({ eventType: "Open", mail: { messageId: "x" } }),
      })
    ).toEqual({ kind: "unknown" });
  });
});

describe("messageIdCandidates", () => {
  it("strips angle brackets and keeps the id as-is", () => {
    expect(messageIdCandidates("<abc123>")).toEqual(["abc123"]);
    expect(messageIdCandidates("abc123")).toEqual(["abc123"]);
  });

  it("adds the bare id without the @domain suffix when present", () => {
    expect(messageIdCandidates("abc123@amazonses.com")).toEqual([
      "abc123@amazonses.com",
      "abc123",
    ]);
  });
});
