import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import {
  messageIdCandidates,
  parseEmailWebhookPayload,
} from "@/features/communication/webhook";

export const dynamic = "force-dynamic";

/**
 * Delivery webhook for the Communication Engine.
 *
 * Two payload shapes are accepted:
 *
 * 1. Real AWS SES via SNS (recommended): the route confirms the SNS
 *    subscription automatically (fetching the signed SubscribeURL) and then
 *    updates `email_logs` from SES Delivery / Bounce / Complaint events.
 *    SNS HTTPS subscriptions cannot set custom headers, so SNS envelopes are
 *    accepted without the header secret; the legacy flat format below keeps
 *    the stricter check.
 *
 * 2. Legacy flat format (custom adapter):
 *      { "messageId": "…", "eventType": "delivered"|"bounced"|"complained"|"failed"|"sent" }
 *    When `COMMUNICATION_WEBHOOK_SECRET` is set, these requests must carry it
 *    in the `x-communication-secret` header.
 *
 * Unknown events are acknowledged without error (safe to retry).
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = parseEmailWebhookPayload(payload);

  // SNS subscription confirmation: fetch the signed SubscribeURL to accept.
  if (parsed.kind === "subscription_confirmation") {
    if (parsed.subscribeUrl) {
      try {
        await fetch(parsed.subscribeUrl, { signal: AbortSignal.timeout(10_000) });
      } catch (error) {
        console.error(
          "Email webhook: could not confirm SNS subscription:",
          error instanceof Error ? error.message : error
        );
        return NextResponse.json(
          { error: "Could not confirm subscription." },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ received: true });
  }

  if (parsed.kind === "unsubscribe_confirmation" || parsed.kind === "unknown") {
    return NextResponse.json({ received: true });
  }

  // Legacy flat format requires the shared secret when one is configured.
  if (!isSnsEnvelope(payload)) {
    const secret = process.env.COMMUNICATION_WEBHOOK_SECRET;
    if (secret) {
      const provided = request.headers.get("x-communication-secret");
      if (provided !== secret) {
        return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
      }
    }
  }

  const supabase = createSupabaseServiceRoleClient();

  // SES message ids are not globally unique, so also scope the update to a
  // recent window to avoid touching stale rows.
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const candidates = messageIdCandidates(parsed.messageId);
  const filters = candidates.map((id) => `provider_message_id.eq.${id}`);

  const { error } = await supabase
    .from("email_logs")
    .update({
      status: parsed.status,
      delivered_at: parsed.status === "delivered" ? new Date().toISOString() : null,
      metadata: {
        webhook_type: parsed.status,
        provider_message_id: parsed.messageId,
      },
    })
    .or(filters.join(","))
    .gte("created_at", since);

  if (error) {
    console.error("Email delivery webhook update error:", error.message);
    return NextResponse.json(
      { error: "Could not update the email log." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

function isSnsEnvelope(body: unknown): boolean {
  return Boolean(
    body &&
      typeof body === "object" &&
      typeof (body as Record<string, unknown>).Type === "string"
  );
}
