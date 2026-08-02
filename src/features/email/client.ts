import "server-only";
import { Resend } from "resend";

let cachedClient: Resend | null = null;

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new Resend(apiKey);
  }
  return cachedClient;
}

export function getEmailFrom(): string {
  return process.env.RESEND_FROM_EMAIL ?? "";
}
