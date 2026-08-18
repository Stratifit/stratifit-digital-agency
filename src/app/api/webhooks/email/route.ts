import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { EmailLogStatus } from "@/features/communication/types";

export const dynamic = "force-dynamic";

const EVENT_STATUS_MAP: Record<string, EmailLogStatus> = {
  sent: "sent",
  delivered: "delivered",
  failed: "failed",
  bounced: "bounced",
  complained: "complained",
};

/**
 * Delivery webhook for the Communication Engine. SES bounce / complaint /
 * delivery notifications arrive via SNS → this route updates `email_logs`
 * by the provider message id:
 *
 *   { "messageId": "…", "eventType": "delivered"|"bounced"|"complained"|"failed", "timestamp": "…" }
 *
 * When `COMMUNICATION_WEBHOOK_SECRET` is set, the request must carry it in
 * the `x-communication-secret` header.
 */
export async function POST(request: Request) {
  const secret = process.env.COMMUNICATION_WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get("x-communication-secret");
    if (provided !== secret) {
      return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const status = EVENT_STATUS_MAP[String(payload.eventType ?? "")];
  const messageId =
    typeof payload.messageId === "string" ? payload.messageId : null;

  if (!status || !messageId) {
    return NextResponse.json({ received: true });
  }

  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("email_logs")
    .update({
      status,
      delivered_at: status === "delivered" ? new Date().toISOString() : null,
      metadata: {
        ...payload,
        webhook_type: status,
      },
    })
    .eq("provider_message_id", messageId);

  if (error) {
    console.error("Email delivery webhook update error:", error.message);
    return NextResponse.json(
      { error: "Could not update the email log." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
