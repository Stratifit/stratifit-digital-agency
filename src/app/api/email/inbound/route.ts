import { NextResponse } from "next/server";
import { processInboundEmail } from "@/features/email-inbox/inbound";

export const dynamic = "force-dynamic";

/**
 * Inbound email webhook. Expects a JSON envelope for one received email:
 *
 *   {
 *     id: string,               // unique provider message id (dedup key)
 *     message_id?: string,      // RFC message-id
 *     from: string,             // "Name <name@example.com>" or bare
 *     to: string[],
 *     received_for?: string[],
 *     subject?: string,
 *     text?: string,
 *     html?: string,
 *     headers?: Record<string, string>,
 *     created_at?: string
 *   }
 *
 * AWS SES inbound delivers via SNS → a receipt rule. Point the SNS
 * subscription at this route (SES → SNS → HTTPS). When
 * `COMMUNICATION_WEBHOOK_SECRET` is set, the request must carry it in the
 * `x-communication-secret` header. Processing is idempotent by `id`, so
 * retries are safe and 200 is returned for every verified delivery.
 */
export async function POST(request: Request) {
  const secret = process.env.COMMUNICATION_WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get("x-communication-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const raw = payload as Record<string, unknown>;
  if (typeof raw.id !== "string" || raw.id.length === 0) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  const result = await processInboundEmail(raw as never);

  if (!result.ok) {
    // Return 200 so the provider doesn't retry a payload we keep failing on;
    // the error is logged server-side.
    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true, duplicate: result.duplicate });
}
