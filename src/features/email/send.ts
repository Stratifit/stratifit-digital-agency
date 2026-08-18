import "server-only";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service-role";
import type { Database } from "@/types/database.types";
import { getEmailFrom, getResendClient } from "./client";
import {
  buildEmailSubject,
  emailTemplateDataSchemas,
  type EmailTemplateDataMap,
} from "./templates";
import type { EmailTemplateKey } from "./types";

export interface SendEmailInput<TKey extends EmailTemplateKey> {
  templateKey: TKey;
  to: string;
  data: EmailTemplateDataMap[TKey];
  /**
   * Optional sender override (e.g. a section's from_address). Falls back to
   * RESEND_FROM_EMAIL. Must be on a verified Resend domain.
   */
  from?: string;
  /**
   * Optional raw headers, used for threading (In-Reply-To / References).
   */
  headers?: Record<string, string>;
  relatedType?: string;
  relatedId?: string;
  idempotencyKey?: string;
}

export interface SendEmailResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

function buildIdempotencyKey(
  templateKey: string,
  to: string,
  relatedType?: string,
  relatedId?: string
): string {
  if (relatedType && relatedId) {
    return `${templateKey}:${to}:${relatedType}:${relatedId}`;
  }
  return `${templateKey}:${to}:${Date.now()}`;
}

async function logEmailEvent(input: {
  templateKey: string;
  to: string;
  senderEmail: string;
  idempotencyKey: string;
  status: "queued" | "sent" | "failed";
  providerMessageId?: string;
  errorCode?: string;
  errorMessage?: string;
  relatedType?: string;
  relatedId?: string;
}) {
  const supabase = createSupabaseServiceRoleClient();

  if (input.status === "queued") {
    const { data, error } = await supabase
      .from("email_events")
      .upsert(
        {
          template_key: input.templateKey,
          recipient_email: input.to,
          sender_email: input.senderEmail,
          status: "queued",
          idempotency_key: input.idempotencyKey,
          related_type: input.relatedType ?? null,
          related_id: input.relatedId ?? null,
          metadata: {},
        },
        { onConflict: "idempotency_key", ignoreDuplicates: true }
      )
      .select("id");
    return error
      ? { inserted: false, error }
      : { inserted: (data?.length ?? 0) > 0, error: null };
  }

  const updates: Database["public"]["Tables"]["email_events"]["Update"] = {
    status: input.status,
  };
  if (input.providerMessageId) {
    updates.provider_message_id = input.providerMessageId;
  }
  if (input.status === "sent") {
    updates.sent_at = new Date().toISOString();
  }
  if (input.errorCode) {
    updates.error_code = input.errorCode;
  }
  if (input.errorMessage) {
    updates.error_message = input.errorMessage;
  }

  const { error } = await supabase
    .from("email_events")
    .update(updates)
    .eq("idempotency_key", input.idempotencyKey);

  return error ? { inserted: false, error } : { inserted: true, error: null };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailHtml(title: string, bodyLines: string[]): string {
  const body = bodyLines
    .map(
      (line) =>
        `<p style="margin:0 0 12px 0;line-height:1.6;">${escapeHtml(line)}</p>`
    )
    .join("");
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#0A0A0A;font-family:Inter,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111827;border:1px solid #1F2937;border-radius:12px;padding:32px;">
            <tr>
              <td style="padding-bottom:20px;border-bottom:1px solid #1F2937;">
                <span style="font-family:Inter,Arial,sans-serif;font-size:18px;font-weight:700;color:#F59E0B;">Stratifit</span>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0;">
                <h1 style="font-family:Inter,Arial,sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;margin:0 0 16px 0;">${escapeHtml(title)}</h1>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding-top:20px;border-top:1px solid #1F2937;">
                <p style="font-family:Inter,Arial,sans-serif;font-size:12px;color:#6B7280;margin:0;">This is an automated message from Stratifit Digital Agency.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderBody<TKey extends EmailTemplateKey>(
  templateKey: TKey,
  data: EmailTemplateDataMap[TKey]
): { title: string; bodyLines: string[] } {
  switch (templateKey) {
    case "contact_acknowledgement": {
      const d = data as EmailTemplateDataMap["contact_acknowledgement"];
      return {
        title: "Thank you for contacting Stratifit",
        bodyLines: [
          `Hi ${d.name},`,
          "Thank you for your message. We have received your enquiry and a team member will get back to you within 24 hours.",
          "If you need anything in the meantime, reply to this email or visit our contact page.",
        ],
      };
    }
    case "lead_notification": {
      const d = data as EmailTemplateDataMap["lead_notification"];
      return {
        title: "New lead received",
        bodyLines: [
          `A new lead was submitted via the website (${d.locale ?? "en"}).`,
          `Name: ${d.name ?? "—"}`,
          `Email: ${d.email ?? "—"}`,
          `Company: ${d.company ?? "—"}`,
          `Service: ${d.requested_service ?? "—"}`,
          `Budget: ${d.budget_range ?? "—"}`,
          `Message: ${d.message ?? "—"}`,
          "Open the lead in the CMS to update its status.",
        ],
      };
    }
    case "chat_escalation": {
      const d = data as EmailTemplateDataMap["chat_escalation"];
      return {
        title: "A visitor asked for human support",
        bodyLines: [
          `${d.visitor_label} has requested a human in the chat conversation (${d.conversation_id}).`,
          "Open the conversation in the CMS inbox to respond.",
        ],
      };
    }
    case "admin_invitation": {
      const d = data as EmailTemplateDataMap["admin_invitation"];
      return {
        title: "You have been invited to the Stratifit CMS",
        bodyLines: [
          "You have been invited to manage content for the Stratifit website.",
          `Open the following link to set up your account: ${d.invite_url}`,
        ],
      };
    }
    case "email_inbox_auto_reply": {
      const d = data as EmailTemplateDataMap["email_inbox_auto_reply"];
      const greeting = d.customer_name
        ? `Hi ${d.customer_name},`
        : `Hello,`;
      return {
        title: d.subject,
        bodyLines: [greeting, ...d.body.split(/\n+/).filter(Boolean)],
      };
    }
    case "email_inbox_reply": {
      const d = data as EmailTemplateDataMap["email_inbox_reply"];
      return {
        title: d.subject,
        bodyLines: d.body.split(/\n+/).filter(Boolean),
      };
    }
    case "email_inbox_template": {
      const d = data as EmailTemplateDataMap["email_inbox_template"];
      return {
        title: d.subject,
        bodyLines: d.body.split(/\n+/).filter(Boolean),
      };
    }
  }
}

export async function sendEmail<TKey extends EmailTemplateKey>(
  input: SendEmailInput<TKey>
): Promise<SendEmailResult> {
  const schema = emailTemplateDataSchemas[input.templateKey];
  const parsed = schema.safeParse(input.data);

  if (!parsed.success) {
    console.error("Email template data invalid:", input.templateKey);
    return { ok: false, error: "Invalid email template data." };
  }

  const client = getResendClient();
  const from = input.from || getEmailFrom();

  if (!client || !from) {
    console.warn("Resend not configured; skipping email:", input.templateKey);
    return { ok: true };
  }

  const idempotencyKey =
    input.idempotencyKey ??
    buildIdempotencyKey(input.templateKey, input.to, input.relatedType, input.relatedId);

  const queued = await logEmailEvent({
    templateKey: input.templateKey,
    to: input.to,
    senderEmail: from,
    idempotencyKey,
    status: "queued",
    relatedType: input.relatedType,
    relatedId: input.relatedId,
  });

  if (queued.error) {
    console.error("Email event log error:", queued.error.message);
  }

  if (!queued.inserted) {
    return { ok: true };
  }

  const subject = buildEmailSubject(
    input.templateKey,
    parsed.data as EmailTemplateDataMap[TKey]
  );
  const { title, bodyLines } = renderBody(
    input.templateKey,
    parsed.data as EmailTemplateDataMap[TKey]
  );

  try {
    const response = await client.emails.send({
      from,
      to: input.to,
      subject,
      html: renderEmailHtml(title, bodyLines),
      text: [title, ...bodyLines].join("\n\n"),
      ...(input.headers ? { headers: input.headers } : {}),
    });

    if (response.error) {
      await logEmailEvent({
        templateKey: input.templateKey,
        to: input.to,
        senderEmail: from,
        idempotencyKey,
        status: "failed",
        errorCode: response.error.name,
        errorMessage: response.error.message,
        relatedType: input.relatedType,
        relatedId: input.relatedId,
      });
      return { ok: false, error: response.error.message };
    }

    const messageId = response.data?.id;
    await logEmailEvent({
      templateKey: input.templateKey,
      to: input.to,
      senderEmail: from,
      idempotencyKey,
      status: "sent",
      providerMessageId: messageId,
      relatedType: input.relatedType,
      relatedId: input.relatedId,
    });

    return { ok: true, messageId };
  } catch (error) {
    console.error("Resend error:", error);
    await logEmailEvent({
      templateKey: input.templateKey,
      to: input.to,
      senderEmail: from,
      idempotencyKey,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      relatedType: input.relatedType,
      relatedId: input.relatedId,
    });
    return { ok: false, error: "Email could not be sent." };
  }
}
