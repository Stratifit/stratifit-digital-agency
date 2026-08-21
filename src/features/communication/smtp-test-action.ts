"use server";

import { probeSmtpConnection, type SmtpProbeResult } from "./smtp-test";

export type { SmtpProbeResult };

/**
 * Server action for the admin dashboard "Test SMTP connection" button.
 * Probes the configured relay (banner + credentials) and returns the result
 * so the UI can show exactly which relay is in use and whether the
 * credentials authenticate. Probe only — never sends an email.
 */
export async function testSmtpConnectionAction(): Promise<SmtpProbeResult> {
  return probeSmtpConnection();
}
