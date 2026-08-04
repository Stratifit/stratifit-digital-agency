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
// Icon set
// ============================================================================

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

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ============================================================================
// Shared field styles
// ============================================================================

const fieldBase =
  "h-11 w-full rounded-card border border-field-border bg-field-bg text-sm text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60 sm:h-12";

interface FieldShellProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

function FieldShell({ label, required, children, error }: FieldShellProps) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
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
      <div className="rounded-card border border-success-border bg-success-soft p-8 text-center">
        <p className="font-medium text-success">{t(locale, "thankYou")}</p>
        <p className="mt-2 text-sm text-text-secondary">
          {t(locale, "messageReceived")}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 inline-flex items-center justify-center rounded-button border border-card-border bg-transparent px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:text-text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
        >
          {t(locale, "sendAnotherMessage")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={compact ? "space-y-4" : "space-y-5"}
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

      {/* Name + Email — side by side on sm+ (single column in compact/chat) */}
      <div
        className={cn(
          "grid grid-cols-1 gap-3",
          !compact && "sm:grid-cols-2 sm:gap-4"
        )}
      >
        <FieldShell
          label={t(locale, "yourName").replace(" *", "")}
          required
          error={
            errors.name
              ? translateValidation(locale, errors.name.message)
              : undefined
          }
        >
          <input
            type="text"
            className={cn(fieldBase, "px-4")}
            placeholder={t(locale, "yourName").replace(" *", "")}
            {...register("name")}
          />
        </FieldShell>

        <FieldShell
          label={t(locale, "emailLabel").replace(" *", "")}
          required
          error={
            errors.email
              ? translateValidation(locale, errors.email.message)
              : undefined
          }
        >
          <input
            type="email"
            className={cn(fieldBase, "px-4")}
            placeholder={t(locale, "yourEmail").replace(" *", "")}
            {...register("email")}
          />
        </FieldShell>
      </div>

      {/* Company (optional) */}
      <input
        type="text"
        className={cn(fieldBase, "px-4")}
        placeholder={t(locale, "companyName")}
        {...register("company")}
      />

      {/* Services (multi-select) */}
      <div ref={servicesRef} className="min-w-0">
        <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
          {t(locale, "selectService")}
          <span className="ml-1 text-primary">*</span>
        </label>
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((v) => !v)}
            className={cn(fieldBase, "pl-4 pr-9", "text-left")}
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
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-text-muted">
            <ChevronDownIcon />
          </span>
          {servicesOpen ? (
            <div
              role="listbox"
              aria-multiselectable="true"
              aria-label={t(locale, "serviceNeeded")}
              className="absolute z-30 mt-2 w-full rounded-card border border-card-border bg-card-dark py-2 shadow-2xl max-h-56 overflow-y-auto"
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

      {/* Budget dropdown + custom budget */}
      <div
        className={cn(
          "grid grid-cols-1 gap-3",
          !compact && "sm:grid-cols-2 sm:gap-4"
        )}
      >
        <div ref={budgetRef} className="min-w-0">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
            {t(locale, "estimatedBudget")}
          </label>
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={budgetOpen}
              onClick={() => setBudgetOpen((v) => !v)}
              className={cn(fieldBase, "pl-4 pr-9", "text-left")}
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
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-text-muted">
              <ChevronDownIcon />
            </span>
            {budgetOpen ? (
              <div
                role="listbox"
                aria-label={t(locale, "estimatedBudget")}
                className="absolute z-30 mt-2 w-full rounded-card border border-card-border bg-card-dark py-2 shadow-2xl max-h-56 overflow-y-auto"
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

        <div className="min-w-0">
          <input
            type="text"
            className={cn(fieldBase, "px-4")}
            aria-label={t(locale, "customBudget")}
            placeholder={t(locale, "customBudget")}
            {...register("custom_budget")}
          />
        </div>
      </div>

      {/* Message */}
      <FieldShell
        label={t(locale, "tellUsProject").replace(" *", "")}
        required
        error={
          errors.message
            ? translateValidation(locale, errors.message.message)
            : undefined
        }
      >
        <textarea
          rows={compact ? 3 : 4}
          className={cn(
            "w-full resize-none rounded-card border border-field-border bg-field-bg px-4 py-3 text-sm leading-5 text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60",
            compact ? "h-[82px]" : "h-28"
          )}
          placeholder={t(locale, "messagePlaceholder")}
          {...register("message")}
        />
      </FieldShell>

      {/* Server error */}
      {serverError ? (
        <p
          role="alert"
          className="rounded-[10px] bg-error-soft px-3 py-2 text-sm text-error"
        >
          {serverError}
        </p>
      ) : null}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-12 w-full items-center justify-center gap-2.5 rounded-button bg-primary px-5 text-sm font-bold text-text-inverse transition-[background-color,box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_12px_32px_rgba(245,158,11,0.18)] focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2 active:translate-y-0 active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-base"
      >
        {isSubmitting ? t(locale, "sending") : t(locale, "sendProjectRequest")}
        <ArrowRightIcon className="transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1" />
      </button>
    </form>
  );
}
