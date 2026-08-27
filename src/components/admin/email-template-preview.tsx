"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { SOCIAL_ICONS } from "@/components/ui/social-icons";
import { renderTemplateText } from "@/features/email-inbox/language";
import { cn } from "@/lib/cn";
import type { EditorLocale } from "./locale-tabs";

/**
 * Sample values injected into {{placeholders}} so the admin can see exactly
 * what a customer will receive. Mirrors the auto-fill variables documented in
 * the email system spec (customer name, project, invoice, meeting, …).
 */
const SAMPLE_VALUES: Record<string, string> = {
  name: "Roland",
  section_name: "Website Development",
  company: "Acme GmbH",
  amount: "€4,900",
  due_date: "31 August 2026",
  invoice_number: "INV-2026-0142",
  project_name: "Website Relaunch",
  project_stage: "Design",
  payment_status: "Failed",
  issue_description: "The invoice could not be processed by the payment provider.",
  meeting_date: "Thursday, 3 September 2026, 10:00",
  admin_name: "Alex",
  customer_email: "roland@example.com",
};

const PLACEHOLDER_LABELS: Record<string, string> = {
  name: "Customer name",
  section_name: "Section / service name",
  company: "Customer company",
  amount: "Invoice amount",
  due_date: "Invoice due date",
  invoice_number: "Invoice number",
  project_name: "Project name",
  project_stage: "Project stage",
  payment_status: "Payment status",
  issue_description: "Issue description",
  meeting_date: "Meeting date",
  admin_name: "Admin name",
  customer_email: "Customer email",
};

function resolveLocale(
  translations: Record<string, string>,
  locale: EditorLocale
): string {
  const value = translations[locale];
  if (typeof value === "string" && value.trim().length > 0) return value;
  const fallback = translations.en;
  return typeof fallback === "string" ? fallback : "";
}

function EmailShell({
  theme,
  subject,
  body,
}: {
  theme: "dark" | "light";
  subject: string;
  body: string;
}) {
  const light = theme === "light";
  const paragraphs = body.split(/\n+/).filter(Boolean);
  const year = new Date().getFullYear();

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border transition-colors",
        light ? "border-border bg-[#F1F3F5]" : "border-card-border bg-background"
      )}
    >
      {/* Email canvas */}
      <div className="p-4 sm:p-5">
        <div
          className={cn(
            "mx-auto max-w-[500px] overflow-hidden rounded-lg border shadow-sm",
            light ? "border-border bg-white" : "border-card-border bg-card-dark"
          )}
        >
          {/* Brand header — main logo + favicon mark on the dark bar */}
          <div className="border-b-4 border-primary bg-[#0B0F17] px-6 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- preview of the round favicon mark */}
              <img
                src="/icon.png"
                alt="Stratifit"
                className="size-10 shrink-0 rounded-full"
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- preview of the main logo */}
              <img
                src="/stratifit-main-logo.png"
                alt="Stratifit"
                className="h-5 w-auto"
              />
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 sm:px-8 sm:py-9">
            <p className="text-[11px] font-bold uppercase tracking-[0.045em] text-primary">
              Stratifit Digital Agency
            </p>
            <h2
              className={cn(
                "mt-3 max-w-md text-[28px] font-extrabold leading-tight tracking-tight",
                light ? "text-[#111318]" : "text-white"
              )}
            >
              {subject || "—"}
            </h2>

            <div className="mt-5 space-y-3">
              {paragraphs.length > 0 ? (
                paragraphs.map((line, index) => (
                  <p
                    key={index}
                    className={cn(
                      "text-sm leading-relaxed",
                      light ? "text-text-secondary" : "text-[#B8C0CC]"
                    )}
                  >
                    {line}
                  </p>
                ))
              ) : (
                <p className="text-sm text-text-muted">
                  Body preview appears here as you type…
                </p>
              )}
            </div>

            {/* CTA button */}
            <div className="mt-6">
              <span className="inline-block min-w-[160px] rounded-md bg-primary px-5 py-3 text-center text-sm font-bold text-[#0B0F17]">
                Ask a Question
              </span>
            </div>
          </div>

          {/* Footer — dark bar with amber top border */}
          <div className="border-t-4 border-primary bg-[#0B0F17] px-5 py-5 text-center">
            <p className="text-xs text-white">
              <span className="font-bold text-primary">stratifit.com</span>
              <span className="px-2 text-white" aria-hidden="true">
                •
              </span>
              <span className="text-white">Digital Agency</span>
            </p>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.035em] text-primary">
              Fit for Digital Excellence
            </p>
            <p className="mt-1.5 text-[11px] text-[#B8C0CC]">Leipzig, Germany</p>

            <div className="mt-3 flex items-center justify-center gap-2">
              {SOCIAL_ICONS.map(({ key, label, viewBox, path }) => (
                <span
                  key={key}
                  title={label}
                  aria-label={label}
                  className={cn(
                    "flex size-7 items-center justify-center border border-white/70 text-white",
                    key === "facebook" || key === "tiktok"
                      ? "rounded-full"
                      : "rounded-md"
                  )}
                >
                  <svg viewBox={viewBox} className="size-3.5" fill="currentColor" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </span>
              ))}
            </div>

            <p className="mt-3 text-[10px] text-[#AEB6C2]">
              © {year} Stratifit Digital Agency. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Live preview for an email template: renders the branded email shell with
 * sample data injected into {{placeholders}}, with a dark/light toggle.
 */
export function EmailTemplatePreview({
  subjectTranslations,
  bodyTranslations,
  locale,
}: {
  subjectTranslations: Record<string, string>;
  bodyTranslations: Record<string, string>;
  locale: EditorLocale;
}) {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  const [showPlaceholders, setShowPlaceholders] = React.useState(true);

  const subject = renderTemplateText(
    resolveLocale(subjectTranslations, locale),
    SAMPLE_VALUES
  );
  const body = renderTemplateText(
    resolveLocale(bodyTranslations, locale),
    SAMPLE_VALUES
  );

  return (
    <div className="rounded-card border border-card-border bg-card-dark shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-text-primary">Preview</p>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            {locale}
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-button border border-white/10 bg-background p-1">
          <button
            type="button"
            onClick={() => setTheme("dark")}
            aria-label="Dark preview"
            className={cn(
              "flex size-7 items-center justify-center rounded-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              theme === "dark"
                ? "bg-primary/15 text-primary"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Moon className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setTheme("light")}
            aria-label="Light preview"
            className={cn(
              "flex size-7 items-center justify-center rounded-button transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              theme === "light"
                ? "bg-primary/15 text-primary"
                : "text-text-muted hover:text-text-secondary"
            )}
          >
            <Sun className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <EmailShell theme={theme} subject={subject} body={body} />

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowPlaceholders((v) => !v)}
            className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Sample variables
            <span
              aria-hidden="true"
              className={cn(
                "transition-transform",
                showPlaceholders ? "rotate-180" : ""
              )}
            >
              ▾
            </span>
          </button>
          {showPlaceholders ? (
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {Object.entries(SAMPLE_VALUES).map(([key, value]) => (
                <div key={key} className="min-w-0">
                  <dt className="truncate text-[10px] font-medium text-text-muted">
                    {`{{${key}}}`} — {PLACEHOLDER_LABELS[key] ?? key}
                  </dt>
                  <dd className="truncate text-xs text-text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </div>
  );
}
