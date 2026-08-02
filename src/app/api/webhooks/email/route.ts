import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/types/database.types";
import type { EmailEventStatus } from "@/features/email/types";

export const dynamic = "force-dynamic";

const EVENT_STATUS_MAP: Record<string, EmailEventStatus> = {
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.failed": "failed",
  "email.bounced": "bounced",
  "email.complained": "complained",
};

interface ResendWebhookPayload {
  type?: string;
  data?: {
    id?: string;
    email_id?: string;
    created_at?: string;
    [key: string]: unknown;
  };
}

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SIGNING_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  const body = await request.text();

  let payload: ResendWebhookPayload;
  try {
    const client = new Resend(process.env.RESEND_API_KEY ?? "unused");
    const verified = client.webhooks.verify({
      payload: body,
      webhookSecret: secret,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
    });
    payload = {
      type:
        typeof verified.type === "string" ? verified.type : undefined,
      data: verified.data as unknown as ResendWebhookPayload["data"],
    };
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const eventType = payload.type ?? "";
  const status = EVENT_STATUS_MAP[eventType];

  if (!status) {
    return NextResponse.json({ received: true });
  }

  const messageId = payload.data?.email_id ?? payload.data?.id;

  if (!messageId) {
    return NextResponse.json({ received: true });
  }

  const supabase = createSupabaseServiceRoleClient();
  const updates: Database["public"]["Tables"]["email_events"]["Update"] = {
    status,
    metadata: {
      ...(typeof payload.data === "object" && payload.data
        ? payload.data
        : {}),
      webhook_type: eventType,
    },
  };

  if (eventType === "email.delivered" && payload.data?.created_at) {
    updates.delivered_at = payload.data.created_at;
  }

  const { error } = await supabase
    .from("email_events")
    .update(updates)
    .eq("provider_message_id", messageId);

  if (error) {
    console.error("Email webhook update error:", error.message);
    return NextResponse.json(
      { error: "Could not update email event." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
