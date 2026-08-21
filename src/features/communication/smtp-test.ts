import "server-only";
import net from "node:net";
import nodemailer from "nodemailer";
import {
  classifySmtpHost,
  getSmtpHostWarning,
  type SmtpHostKind,
} from "./smtp-config";
import { getSmtpConfig } from "./sender";

export interface SmtpProbeResult {
  configured: boolean;
  host: string;
  port: number;
  kind: SmtpHostKind;
  warning: string | null;
  /** SMTP greeting banner captured from the relay (e.g. "220 ... ESMTP ..."). */
  banner: string | null;
  /** True when the configured credentials authenticate on the host. */
  authOk: boolean;
  error: string | null;
}

/**
 * Live diagnostic for the admin dashboard. Connects to the configured SMTP
 * host, captures the greeting banner (which reveals whether the relay is real
 * SES SMTP or an AWS Mail Manager ingress gateway), and verifies the
 * credentials. Never sends an email — probe only.
 */
export async function probeSmtpConnection(): Promise<SmtpProbeResult> {
  const config = getSmtpConfig();
  if (!config) {
    return {
      configured: false,
      host: "",
      port: 587,
      kind: "other",
      warning: null,
      banner: null,
      authOk: false,
      error: "SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS missing).",
    };
  }

  const base = {
    configured: true,
    host: config.host,
    port: config.port,
    kind: classifySmtpHost(config.host),
    warning: getSmtpHostWarning(config.host, config.user),
  };

  // 1) Banner: raw TCP, read the greeting, then hang up. No credentials sent.
  let banner: string | null = null;
  try {
    banner = await new Promise<string | null>((resolve) => {
      const socket = net.connect({
        host: config.host,
        port: config.port,
      });
      const timer = setTimeout(() => {
        socket.destroy();
        resolve(null);
      }, 10_000);
      socket.once("connect", () => {
        // Relay sends the banner immediately on connect (or after TLS on 465).
        socket.setTimeout(10_000);
      });
      socket.once("data", (chunk) => {
        clearTimeout(timer);
        socket.destroy();
        resolve(chunk.toString("utf8").split("\r\n")[0].trim());
      });
      socket.once("error", () => {
        clearTimeout(timer);
        resolve(null);
      });
    });
  } catch {
    banner = null;
  }

  // 2) Auth: nodemailer verify against the configured credentials.
  let authOk = false;
  let authError: string | null = null;
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
  try {
    await transporter.verify();
    authOk = true;
  } catch (error) {
    authError = error instanceof Error ? error.message : "Authentication failed";
  } finally {
    transporter.close();
  }

  return {
    ...base,
    banner,
    authOk,
    error: authOk
      ? null
      : authError
        ? `Credentials failed on this host: ${authError}`
        : "Could not authenticate with the configured credentials.",
  };
}
