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

const fieldClass =
  "w-full rounded-xl border border-field-border bg-field-bg px-4 py-3 text-sm text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus:border-primary focus:outline-none aria-[invalid=true]:border-error/60 disabled:cursor-not-allowed disabled:opacity-60";

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
      className="size-4 shrink-0 text-text-subtle"
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
      className="size-4 transition-transform duration-[var(--motion-fast)] ease-[var(--ease-standard)] group-hover:translate-x-1"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
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
  const [customBudget, setCustomBudget] = React.useState("");
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
      setCustomBudget("");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("honeypot")}
      />

      {/* Name + Email */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input
            type="text"
            className={fieldClass}
            placeholder={t(locale, "yourName").replace(" *", "")}
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-error">
              {translateValidation(locale, errors.name.message)}
            </p>
          ) : null}
        </div>
        <div>
          <input
            type="email"
            className={fieldClass}
            placeholder={t(locale, "yourEmail").replace(" *", "")}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-error">
              {translateValidation(locale, errors.email.message)}
            </p>
          ) : null}
        </div>
      </div>

      {/* Company */}
      <input
        type="text"
        className={fieldClass}
        placeholder={t(locale, "companyName")}
        {...register("company")}
      />

      {/* Services dropdown (multi-select) */}
      <div ref={servicesRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={servicesOpen}
          onClick={() => setServicesOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-field-border bg-field-bg px-4 py-3 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus:border-primary focus:outline-none"
        >
          <span
            className={cn(
              "min-w-0 truncate",
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
          <ChevronDownIcon />
        </button>
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

      {/* Budget */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          {t(locale, "projectBudget")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div ref={budgetRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={budgetOpen}
              onClick={() => setBudgetOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-field-border bg-field-bg px-3 py-3 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus:border-primary focus:outline-none"
            >
              <span
                className={cn(
                  "min-w-0 truncate",
                  budgetRange ? "text-field-text" : "text-field-placeholder"
                )}
              >
                {budgetRange || t(locale, "selectRange")}
              </span>
              <ChevronDownIcon />
            </button>
            {budgetOpen ? (
              <div
                role="listbox"
                aria-label={t(locale, "projectBudget")}
                className="absolute z-30 mt-2 w-full rounded-xl border border-card-border bg-card-dark py-2 shadow-2xl max-h-56 overflow-y-auto"
              >
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
                        setCustomBudget("");
                        setValue("budget_range", range);
                        setValue("custom_budget", "");
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
          <input
            type="text"
            className={cn(fieldClass, "px-3")}
            placeholder={t(locale, "customBudget")}
            value={customBudget}
            onChange={(event) => {
              setCustomBudget(event.target.value);
              setValue("custom_budget", event.target.value);
            }}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <textarea
          rows={compact ? 3 : 4}
          className={cn(
            fieldClass,
            "resize-none",
            compact ? "h-[82px]" : "h-28"
          )}
          placeholder={t(locale, "tellUsProject").replace(" *", "")}
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-error">
            {translateValidation(locale, errors.message.message)}
          </p>
        ) : null}
      </div>

      {/* Server error */}
      {serverError ? (
        <p
          role="alert"
          className="rounded-xl bg-error-soft px-3 py-2 text-sm text-error"
        >
          {serverError}
        </p>
      ) : null}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-text-inverse shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:bg-primary-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
      >
        {isSubmitting ? t(locale, "sending") : t(locale, "sendMessage")}
        <ArrowRightIcon />
      </button>
    </form>
  );
}
