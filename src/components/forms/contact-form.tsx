"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { leadSchema, type LeadFormValues } from "@/features/leads/schemas";
import { submitLead } from "@/features/leads/mutations";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithNumber, translateValidation } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";

const BUDGET_RANGES = ["€1k–€3k", "€3k–€5k", "€5k–€10k", "€10k+"];

// ============================================================================
// Icon set — colored amber via the parent (text-primary)
// ============================================================================

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <rect width="20" height="16" x="2" y="5" rx="2" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M19 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0 0 4h14a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M7.9 20A1.35 1.35 0 0 1 6 18.69a3.87 3.87 0 0 0-.21-1.78A2 2 0 0 0 4.6 15.9 7.42 7.42 0 0 1 2.1 9.53 7.6 7.6 0 0 1 15.19 4.4 7.74 7.74 0 0 1 21.5 9c.13.5.13 1 0 1.5" />
      <path d="M3.1 11a25 25 0 0 1 13 0" />
      <path d="M11.86 19.4 14 21l-1.5-2.5" />
      <rect width="4" height="4" x="18" y="17" rx="1" />
      <path d="M18 17v-2a2 2 0 0 1 4 0v2" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-3"
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l4.894 4.893 8.48-12.72a.75.75 0 0 1 1.04-.208Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M14.536 9.464a5 5 0 0 1 0 7.072L12 19l-2.536-2.464a5 5 0 0 1 7.072-7.072z" />
      <path d="M12 12h.01" />
      <path d="M11 14.535 5.464 9A5 5 0 0 1 12 14.535" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ============================================================================
// Shared field styles
// ============================================================================

const fieldBase =
  "h-11 w-full rounded-xl border border-field-border bg-field-bg text-sm text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60 sm:h-12 sm:rounded-2xl";

const fieldWithLeftIcon = "pl-11 pr-4";
const fieldWithRightChevron = "pr-9";

interface FieldShellProps {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: string;
}

function FieldShell({ label, required, icon, children, error }: FieldShellProps) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
        {label}
        {required ? <span className="ml-1 text-field-placeholder">*</span> : null}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-primary">
          {icon}
        </span>
        {children}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : null}
    </div>
  );
}

// ============================================================================
// Contact form
// ============================================================================

export function ContactForm({
  services = [],
  locale = "en",
  compact = false,
}: {
  services?: PublicServiceDetail[];
  locale?: string;
  compact?: boolean;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const [budgetOpen, setBudgetOpen] = React.useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>(
    []
  );
  const [budgetRange, setBudgetRange] = React.useState("");
  const servicesRef = React.useRef<HTMLDivElement>(null);
  const budgetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (servicesRef.current && !servicesRef.current.contains(target)) {
        setServicesOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(target)) {
        setBudgetOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      requested_service_ids: [],
      budget_range: "",
      custom_budget: "",
      message: "",
      honeypot: "",
    },
  });

  const selectedServices = services.filter((s) =>
    selectedServiceIds.includes(s.id)
  );

  function toggleService(serviceId: string) {
    const next = selectedServiceIds.includes(serviceId)
      ? selectedServiceIds.filter((id) => id !== serviceId)
      : [...selectedServiceIds, serviceId];
    setSelectedServiceIds(next);
    setValue("requested_service_ids", next);
  }

  async function onSubmit(values: z.input<typeof leadSchema>) {
    setServerError(null);
    const result = await submitLead({
      ...values,
      source: "contact_form",
      preferred_locale: locale,
    } as LeadFormValues);
    if (result.success) {
      setSubmitted(true);
      setSelectedServiceIds([]);
      setBudgetRange("");
      reset();
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-success-border bg-success-soft p-8 text-center">
        <p className="font-medium text-success">{t(locale, "thankYou")}</p>
        <p className="mt-2 text-sm text-text-secondary">
          {t(locale, "messageReceived")}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 inline-flex items-center justify-center rounded-xl border border-card-border bg-transparent px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:text-text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
        >
          {t(locale, "sendAnotherMessage")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={compact ? "space-y-5" : "space-y-6"}
    >
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("honeypot")}
      />

      {/* Name */}
      <FieldShell
        label={t(locale, "yourName").replace(" *", "")}
        required
        icon={<UserIcon />}
        error={
          errors.name
            ? translateValidation(locale, errors.name.message)
            : undefined
        }
      >
        <input
          type="text"
          className={cn(fieldBase, fieldWithLeftIcon)}
          placeholder={t(locale, "yourName").replace(" *", "")}
          {...register("name")}
        />
      </FieldShell>

      {/* Email */}
      <FieldShell
        label={t(locale, "yourEmail").replace(" *", "")}
        required
        icon={<MailIcon />}
        error={
          errors.email
            ? translateValidation(locale, errors.email.message)
            : undefined
        }
      >
        <input
          type="email"
          className={cn(fieldBase, fieldWithLeftIcon)}
          placeholder={t(locale, "yourEmail").replace(" *", "")}
          {...register("email")}
        />
      </FieldShell>

      {/* Service + Budget */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Service dropdown (multi-select) */}
        <div ref={servicesRef} className="min-w-0">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
            {t(locale, "serviceNeeded")}
            <span className="ml-1 text-field-placeholder">*</span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-primary">
              <LayersIcon />
            </span>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className={cn(fieldBase, fieldWithLeftIcon, fieldWithRightChevron, "text-left")}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  selectedServices.length > 0
                    ? "text-field-text"
                    : "text-field-placeholder"
                )}
              >
                {selectedServices.length === 0
                  ? t(locale, "selectServices")
                  : selectedServices.length === 1
                    ? resolveTranslation(selectedServices[0].title_translations, locale)
                    : tWithNumber(locale, "servicesSelected", selectedServices.length)}
              </span>
            </button>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-primary">
              <ChevronDownIcon />
            </span>
            {servicesOpen ? (
              <div
                role="listbox"
                aria-multiselectable="true"
                aria-label={t(locale, "serviceNeeded")}
                className="absolute z-30 mt-2 w-full rounded-xl border border-card-border bg-card-dark py-2 shadow-2xl max-h-56 overflow-y-auto"
              >
                {services.map((service) => {
                  const selected = selectedServiceIds.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => toggleService(service.id)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border transition-all duration-150",
                          selected
                            ? "border-primary bg-primary text-text-inverse"
                            : "border-card-border"
                        )}
                      >
                        {selected ? <CheckIcon /> : null}
                      </span>
                      <span
                        className={cn(
                          "truncate text-sm transition-colors",
                          selected
                            ? "font-medium text-text-primary"
                            : "text-text-secondary"
                        )}
                      >
                        {resolveTranslation(service.title_translations, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        {/* Budget dropdown */}
        <div ref={budgetRef} className="min-w-0">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
            {t(locale, "estimatedBudget")}
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-primary">
              <WalletIcon />
            </span>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={budgetOpen}
              onClick={() => setBudgetOpen((v) => !v)}
              className={cn(fieldBase, fieldWithLeftIcon, fieldWithRightChevron, "text-left")}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 truncate",
                  budgetRange ? "text-field-text" : "text-field-placeholder"
                )}
              >
                {budgetRange || t(locale, "notSureYet")}
              </span>
            </button>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-primary">
              <ChevronDownIcon />
            </span>
            {budgetOpen ? (
              <div
                role="listbox"
                aria-label={t(locale, "estimatedBudget")}
                className="absolute z-30 mt-2 w-full rounded-xl border border-card-border bg-card-dark py-2 shadow-2xl max-h-56 overflow-y-auto"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={budgetRange === ""}
                  onClick={() => {
                    setBudgetRange("");
                    setValue("budget_range", "");
                    setBudgetOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.03]",
                    budgetRange === "" ? "font-medium text-primary" : "text-text-secondary"
                  )}
                >
                  {t(locale, "notSureYet")}
                </button>
                {BUDGET_RANGES.map((range) => {
                  const selected = budgetRange === range;
                  return (
                    <button
                      key={range}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setBudgetRange(range);
                        setValue("budget_range", range);
                        setBudgetOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.03]",
                        selected
                          ? "font-medium text-primary"
                          : "text-text-secondary"
                      )}
                    >
                      {range}
                      {selected ? (
                        <span className="text-primary">
                          <CheckIcon />
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Message */}
      <FieldShell
        label={t(locale, "tellUsProject").replace(" *", "")}
        required
        icon={<MessageIcon />}
        error={
          errors.message
            ? translateValidation(locale, errors.message.message)
            : undefined
        }
      >
        <textarea
          rows={compact ? 3 : 4}
          className={cn(
            "w-full resize-none rounded-xl border border-field-border bg-field-bg py-3 pl-11 pr-4 text-sm leading-5 text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60 sm:rounded-2xl",
            compact ? "h-[82px]" : "h-28"
          )}
          placeholder={t(locale, "tellUsProject").replace(" *", "")}
          {...register("message")}
        />
      </FieldShell>

      {/* Server error */}
      {serverError ? (
        <p
          role="alert"
          className="rounded-xl bg-error-soft px-3 py-2 text-sm text-error"
        >
          {serverError}
        </p>
      ) : null}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-between rounded-xl bg-primary px-4 font-semibold text-text-inverse transition-[background-color,border-color,color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_10px_32px_rgba(245,158,11,0.10)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 active:translate-y-0 active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:rounded-2xl sm:px-5"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-background text-primary sm:size-9">
          <SendIcon />
        </span>
        <span className="text-sm sm:text-base">
          {isSubmitting ? t(locale, "sending") : t(locale, "sendProjectRequest")}
        </span>
        <ArrowRightIcon />
      </button>
    </form>
  );
}
