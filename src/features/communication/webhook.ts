import type { EmailLogStatus } from "./types";

/**
 * Delivery webhook payload parsing for the Communication Engine.
 *
 * Two payload shapes are accepted:
 *
 * 1. Real AWS SES via SNS (recommended). SNS POSTs an envelope:
 *      { "Type": "SubscriptionConfirmation", "SubscribeURL": "…", … }
 *      { "Type": "Notification", "Message": "{ \"eventType\": \"Delivery\", \"mail\": { \"messageId\": \"…\" }, … }", … }
 *    SES event types are capitalized ("Delivery", "Bounce", "Complaint", …).
 *
 * 2. Legacy flat format (custom adapter):
 *      { "messageId": "…", "eventType": "delivered"|"bounced"|"complained"|"failed"|"sent" }
 */

export type WebhookPayload =
  | { kind: "subscription_confirmation"; subscribeUrl: string | null }
  | { kind: "unsubscribe_confirmation" }
  | { kind: "event"; messageId: string; status: EmailLogStatus }
  | { kind: "unknown" };

const LEGACY_EVENT_STATUS_MAP: Record<string, EmailLogStatus> = {
  sent: "sent",
  delivered: "delivered",
  failed: "failed",
  bounced: "bounced",
  complained: "complained",
};

/** SES event names from SNS notifications → our email_logs status. */
const SES_EVENT_STATUS_MAP: Record<string, EmailLogStatus> = {
  Send: "sent",
  Delivery: "delivered",
  Bounce: "bounced",
  Complaint: "complained",
  Reject: "failed",
  RenderingFailure: "failed",
};

function parseSesEvent(messageJson: string): {
  messageId: string | null;
  status: EmailLogStatus | null;
} {
  try {
    const parsed = JSON.parse(messageJson) as {
      eventType?: string;
      mail?: { messageId?: string };
    };
    return {
      messageId: typeof parsed.mail?.messageId === "string" ? parsed.mail.messageId : null,
      status: SES_EVENT_STATUS_MAP[parsed.eventType ?? ""] ?? null,
    };
  } catch {
    return { messageId: null, status: null };
  }
}

/**
 * Normalize an unknown webhook body into a typed payload. Never throws.
 */
export function parseEmailWebhookPayload(body: unknown): WebhookPayload {
  if (!body || typeof body !== "object") return { kind: "unknown" };

  const record = body as Record<string, unknown>;

  // SNS envelope
  if (typeof record.Type === "string") {
    if (record.Type === "SubscriptionConfirmation") {
      return {
        kind: "subscription_confirmation",
        subscribeUrl: typeof record.SubscribeURL === "string" ? record.SubscribeURL : null,
      };
    }
    if (record.Type === "UnsubscribeConfirmation") {
      return { kind: "unsubscribe_confirmation" };
    }
    if (record.Type === "Notification" && typeof record.Message === "string") {
      const { messageId, status } = parseSesEvent(record.Message);
      if (messageId && status) {
        return { kind: "event", messageId, status };
      }
    }
    return { kind: "unknown" };
  }

  // Legacy flat format
  const status = LEGACY_EVENT_STATUS_MAP[String(record.eventType ?? "")];
  const messageId = typeof record.messageId === "string" ? record.messageId : null;
  if (status && messageId) {
    return { kind: "event", messageId, status };
  }

  return { kind: "unknown" };
}

/**
 * Candidate provider message ids to look up in `email_logs`. The canonical
 * id is the one from the notification; the fallback handles senders that
 * store the id with a `<domain>` suffix (nodemailer sometimes normalizes
 * Message-ID headers that way).
 */
export function messageIdCandidates(messageId: string): string[] {
  const bare = messageId.replace(/^<|>$/g, "");
  const candidates = [bare];
  if (bare.includes("@")) {
    candidates.push(bare.slice(0, bare.indexOf("@")));
  }
  return [...new Set(candidates)];
}
