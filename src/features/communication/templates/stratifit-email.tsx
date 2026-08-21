import {
  Body,
  Column,
  Container,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties } from "react";
import type { SupportedLanguage } from "../types";
import { EMAIL_PARTIALS } from "./partials";

/**
 * Branded Stratifit email template built with React Email components. This is
 * the single source of truth for the visual design of every outbound email
 * (dark brand header, amber accent bar, body, sign-off, dark footer). Content
 * (subject + body) is still CMS-editable in `email_templates`; this component
 * only supplies the chrome and layout.
 *
 * Rendered to HTML with `render()` from `@react-email/render` (the Resend
 * renderer) in `renderer.ts`, then sent through Nodemailer over AWS SES SMTP.
 */

const INK = "#080B10";
const AMBER = "#F59E0B";
const AMBER_BAR = "#FF9D00";
const CANVAS = "#EEF0F3";

export interface StratifitEmailProps {
  subject: string;
  body: string;
  language: SupportedLanguage;
  adminName?: string | null;
  /** Footer contact details; falls back to the Stratifit brand values. */
  contact?: {
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  };
  /** Absolute URL of the light Stratifit logo (rendered in the header). */
  logoUrl?: string;
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** Strip the protocol for display (https://www.stratifit.com → www.stratifit.com). */
function websiteLabel(website: string): string {
  return website.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

const LINK_STYLE: CSSProperties = {
  fontFamily: "Inter,Arial,sans-serif",
  fontSize: "11px",
  color: "#FFFFFF",
  textDecoration: "none",
  padding: "0 10px",
};

export function StratifitEmail({
  subject,
  body,
  language,
  adminName,
  contact,
  logoUrl = "https://www.stratifit.com/stratifit-main-logo.png",
}: StratifitEmailProps) {
  const p = EMAIL_PARTIALS[language] ?? EMAIL_PARTIALS.en;
  const signatureName = adminName?.trim() || "The Stratifit Team";
  const c = {
    email: contact?.email || "hello@stratifit.com",
    phone: contact?.phone || "+49 152 1743 6830",
    website: contact?.website || "https://www.stratifit.com",
  };
  const paragraphs = body.split(/\n+/).filter(Boolean);
  const year = new Date().getFullYear();
  const preheader = paragraphs[0] || subject;

  const bodyStyle: CSSProperties = {
    margin: 0,
    padding: 0,
    backgroundColor: CANVAS,
    fontFamily:
      "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif",
    WebkitFontSmoothing: "antialiased",
  };

  return (
    <Html lang={language}>
      <Preview>{preheader}</Preview>
      <Body
        style={{
          ...bodyStyle,
          background: `radial-gradient(circle at 50% -15%,rgba(245,158,11,.08),transparent 34rem),${CANVAS}`,
        }}
      >
        <Container
          style={{
            maxWidth: "640px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E1E3E6",
            borderRadius: "16px",
            overflow: "hidden",
            margin: "32px auto",
          }}
        >
          {/* Brand header — light logo + tagline on the dark brand bar */}
          <Section style={{ backgroundColor: INK, padding: "26px 34px" }}>
            <Row>
              <Column style={{ verticalAlign: "middle" }}>
                <Img
                  src={logoUrl}
                  alt="Stratifit"
                  width={168}
                  height={24}
                  style={{ display: "block", width: "168px", height: "auto" }}
                />
              </Column>
              <Column align="right" style={{ verticalAlign: "middle" }}>
                <Text
                  style={{
                    margin: 0,
                    fontFamily: "Inter,Arial,sans-serif",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: AMBER,
                  }}
                >
                  {p.tagline}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Amber accent bar */}
          <Section
            style={{
              height: "2px",
              fontSize: "0",
              lineHeight: "0",
              backgroundColor: AMBER_BAR,
            }}
          />

          {/* Body */}
          <Section style={{ padding: "34px 46px 26px" }}>
            <Text
              style={{
                margin: "0 0 10px",
                color: "#717986",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {p.eyebrow}
            </Text>
            <Heading
              as="h2"
              style={{
                margin: 0,
                fontSize: "28px",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              {subject}
            </Heading>
            <Section style={{ marginTop: "20px" }}>
              {paragraphs.map((line, index) => (
                <Text
                  key={index}
                  style={{
                    margin: "0 0 12px",
                    lineHeight: 1.7,
                    color: "#2D333C",
                    fontSize: "15px",
                  }}
                >
                  {line}
                </Text>
              ))}
            </Section>
            <Text
              style={{
                margin: "20px 0 0",
                color: "#303741",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {p.questionsNote}
            </Text>
            <Text
              style={{
                margin: "4px 0 0",
                color: INK,
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {signatureName}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: INK, padding: "20px 28px" }}>
            <Text
              style={{
                margin: "0 0 12px",
                textAlign: "center",
                color: "rgba(255,255,255,.72)",
                fontSize: "11px",
                lineHeight: 1.5,
              }}
            >
              {p.footerNote}
            </Text>
            <Text
              style={{
                margin: 0,
                textAlign: "center",
                fontFamily: "Inter,Arial,sans-serif",
                fontSize: "11px",
                color: "#FFFFFF",
              }}
            >
              <Link href={`mailto:${c.email}`} style={LINK_STYLE}>
                {c.email}
              </Link>
              <span style={{ color: AMBER, padding: 0 }}>·</span>
              <Link href={telHref(c.phone)} style={LINK_STYLE}>
                {c.phone}
              </Link>
              <span style={{ color: AMBER, padding: 0 }}>·</span>
              <Link href={c.website} style={LINK_STYLE}>
                {websiteLabel(c.website)}
              </Link>
            </Text>
            <Text
              style={{
                margin: "14px 0 0",
                textAlign: "center",
                color: "rgba(255,255,255,.5)",
                fontSize: "11px",
              }}
            >
              © {year} {p.legalDisclaimer}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
