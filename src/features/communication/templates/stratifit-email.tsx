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
import { SOCIAL_ICONS } from "@/components/ui/social-icons";
import type { SupportedLanguage } from "../types";
import { EMAIL_PARTIALS } from "./partials";

/**
 * Branded Stratifit email template built with React Email components. This is
 * the single source of truth for the visual design of every outbound email:
 * dark brand header (main logo), amber accent bars, body, amber CTA, and a
 * dark footer with contact details and social icons. Content
 * (subject + body) is still CMS-editable in `email_templates`; this component
 * only supplies the chrome and layout.
 *
 * Rendered to HTML with `render()` from `@react-email/render` (the Resend
 * renderer) in `renderer.ts`, then sent through Nodemailer over AWS SES SMTP.
 */

const INK = "#0B0F17";
const AMBER = "#F59E0B";
const CANVAS = "#F1F3F5";

export interface StratifitEmailProps {
  subject: string;
  body: string;
  language: SupportedLanguage;
  /** Footer contact details; falls back to the Stratifit brand values. */
  contact?: {
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  };
  /** Absolute URL of the light Stratifit logo (rendered in the header). */
  logoUrl?: string;
  /** Social profile URLs, keyed like the site footer (linkedin, instagram…). */
  socialLinks?: Record<string, string>;
  /**
   * Absolute URLs of the footer social icon images (amber PNGs, keyed like
   * the site footer). Email clients strip inline SVG, so the icons render as
   * <img> tags pointing at public/email-icons/<key>.png.
   */
  iconUrls?: Record<string, string>;
}

/** Strip the protocol for display (https://www.stratifit.com → www.stratifit.com). */
function websiteLabel(website: string): string {
  return website.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

const FOOTER_LINK: CSSProperties = {
  fontFamily: "Inter,Arial,sans-serif",
  fontSize: "14px",
  color: "#FFFFFF",
  textDecoration: "none",
};

export function StratifitEmail({
  subject,
  body,
  language,
  contact,
  logoUrl = "https://www.stratifit.com/stratifit-main-logo.png",
  socialLinks = {},
  iconUrls = {},
}: StratifitEmailProps) {
  const p = EMAIL_PARTIALS[language] ?? EMAIL_PARTIALS.en;
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
      <Body style={bodyStyle}>
        <Container
          style={{
            maxWidth: "680px",
            margin: "32px auto",
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          {/* Brand header — main logo on the dark bar */}
          <Section
            style={{
              backgroundColor: INK,
              padding: "42px 42px 38px",
              borderBottom: `3px solid ${AMBER}`,
            }}
          >
            <Row>
              <Column style={{ verticalAlign: "middle" }}>
                <Img
                  src={logoUrl}
                  alt="Stratifit"
                  width={170}
                  height={24}
                  style={{ display: "block", width: "170px", height: "auto" }}
                />
              </Column>
            </Row>
          </Section>

          {/* Body */}
          <Section style={{ padding: "56px 42px 58px" }}>
            <Text
              style={{
                margin: "0 0 30px",
                color: AMBER,
                fontSize: "13px",
                fontWeight: 750,
                letterSpacing: "0.045em",
                lineHeight: 1.35,
                textTransform: "uppercase",
              }}
            >
              {p.eyebrow}
            </Text>
            <Heading
              as="h2"
              style={{
                maxWidth: "540px",
                margin: "0 0 28px",
                color: "#111318",
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {subject}
            </Heading>
            <Section style={{ marginTop: "0" }}>
              {paragraphs.map((line, index) => (
                <Text
                  key={index}
                  style={{
                    maxWidth: "560px",
                    margin: "0 0 24px",
                    lineHeight: 1.75,
                    color: "#2F343B",
                    fontSize: "16px",
                  }}
                >
                  {line}
                </Text>
              ))}
            </Section>
            {/* CTA row */}
            <Section style={{ paddingTop: "32px" }}>
              <Link
                href={`mailto:${c.email}`}
                style={{
                  display: "inline-block",
                  minWidth: "176px",
                  padding: "15px 22px",
                  border: `1px solid ${AMBER}`,
                  borderRadius: "6px",
                  backgroundColor: AMBER,
                  color: `${INK} !important`,
                  fontSize: "15px",
                  fontWeight: 750,
                  lineHeight: 1.15,
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                {p.ctaLabel}
              </Link>
            </Section>
          </Section>

          {/* Footer — dark bar with amber top border */}
          <Section
            style={{
              backgroundColor: INK,
              padding: "28px 30px 26px",
              borderTop: `3px solid ${AMBER}`,
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#FFFFFF",
                fontSize: "14px",
                lineHeight: 1.4,
              }}
            >
              <Link href={c.website} style={FOOTER_LINK}>
                <span style={{ fontWeight: 700 }}>
                  {websiteLabel(c.website)}
                </span>
              </Link>
            </Text>
            <Text
              style={{
                margin: "15px 0 0",
                color: "#B8C0CC",
                fontSize: "13px",
                lineHeight: 1.4,
              }}
            >
              {p.location}
            </Text>

            {/* Social icons — same icons and links as the site footer, rendered
                as PNG images because email clients (notably Gmail) strip
                inline SVG from email HTML. */}
            <Section style={{ marginTop: "14px" }}>
              {SOCIAL_ICONS.map(({ key, label }) => {
                const href = socialLinks[key] ?? "#";
                const round = key === "facebook" || key === "tiktok";
                return (
                  <Link
                    key={key}
                    href={href}
                    aria-label={label}
                    title={label}
                    style={{
                      display: "inline-block",
                      width: "28px",
                      height: "28px",
                      margin: "0 5px",
                      padding: "0",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: round ? "50%" : "7px",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      textDecoration: "none",
                      verticalAlign: "middle",
                      lineHeight: "28px",
                    }}
                  >
                    <Img
                      src={
                        iconUrls[key] ??
                        `https://www.stratifit.com/email-icons/${key}.png`
                      }
                      alt=""
                      width={15}
                      height={15}
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    />
                  </Link>
                );
              })}
            </Section>

            <Text
              style={{
                margin: "17px 0 0",
                color: "#AEB6C2",
                fontSize: "11px",
                lineHeight: 1.45,
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
