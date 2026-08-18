import { NextResponse } from "next/server";
import { Resend } from "resend";
import { processInboundEmail } from "@/features/email-inbox/inbound";

export const dynamic = "force-dynamic";

/**
 * Resend `email.received` webhook (metadata only). The full email — body and
 * threading headers — is fetched from the Received emails API inside
 * `processInboundEmail`.
 *
 * Returns 200 for every verified delivery (including duplicates), because
 * Resend retries webhooks on non-2xx responses and the processor is
 * idempotent by the Resend email id.
 */
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SIGNING_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  const body = await request.text();

  let payload: unknown;
  try {
    const client = new Resend(process.env.RESEND_API_KEY ?? "unused");
    payload = client.webhooks.verify({
      payload: body,
      webhookSecret: secret,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const raw = payload as { type?: string; data?: Record<string, unknown> };

  // Only handle inbound email events; ignore everything else.
  if (raw.type && raw.type !== "email.received") {
    return NextResponse.json({ received: true });
  }

  const result = await processInboundEmail({
    type: raw.type,
    data: raw.data,
  });

  if (!result.ok) {
    // Processing failed after a verified signature: return 200 so Resend
    // doesn't retry a payload we will keep failing on; the error is logged.
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true, duplicate: result.duplicate });
}
