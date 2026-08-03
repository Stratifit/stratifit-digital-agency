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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 text-text-subtle transition-transform duration-200",
        open && "rotate-180"
      )}
    >
      <path
        fillRule="evenodd"
        d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
        clipRule="evenodd"
      />
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

function dropdownTriggerClass() {
  return cn(
    "flex h-11 w-full items-center gap-3 rounded-input border border-field-border bg-field-bg px-4 text-left transition-[background-color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover active:border-field-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:outline-offset-2"
  );
}

function dropdownPanelClass() {
  return cn(
    "absolute z-50 mt-2 w-full rounded-input border border-field-border bg-field-bg p-1 shadow-shadow-md"
  );
}

export function ContactForm({
  services = [],
  locale = "en",
}: {
  services?: PublicServiceDetail[];
  locale?: string;
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
  const budgetLabel = customBudget || budgetRange;

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
      <div className="rounded-md border border-success-border bg-success-soft p-8 text-center">
        <p className="font-medium text-success">{t(locale, "thankYou")}</p>
        <p className="mt-2 text-sm text-text-secondary">
          {t(locale, "messageReceived")}
        </p>
        <Button
          variant="secondary"
          size="small"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          {t(locale, "sendAnotherMessage")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("honeypot")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            id="name"
            placeholder={t(locale, "yourName")}
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-error">{translateValidation(locale, errors.name.message)}</p>
          ) : null}
        </div>
        <div>
          <Input
            id="email"
            type="email"
            placeholder={t(locale, "yourEmail")}
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-error">{translateValidation(locale, errors.email.message)}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Input
          id="company"
          placeholder={t(locale, "companyName")}
          {...register("company")}
        />
      </div>

      {services.length > 0 ? (
        <div ref={servicesRef} className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={servicesOpen}
            onClick={() => setServicesOpen((v) => !v)}
            className={dropdownTriggerClass()}
          >
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-sm",
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
            <ChevronIcon open={servicesOpen} />
          </button>
          {servicesOpen ? (
            <div
              role="listbox"
              aria-multiselectable="true"
              aria-label="Services"
              className={cn(dropdownPanelClass(), "max-h-64 overflow-y-auto")}
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
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
                      selected ? "bg-white/5" : "hover:bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border transition-all duration-150",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-white/20 text-transparent"
                      )}
                    >
                      <CheckIcon />
                    </span>
                    <span
                      className={cn(
                        "truncate text-sm",
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
      ) : null}

      <div ref={budgetRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={budgetOpen}
          onClick={() => setBudgetOpen((v) => !v)}
          className={dropdownTriggerClass()}
        >
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-field-label">
            {t(locale, "projectBudget")}
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              budgetLabel ? "text-field-text" : "text-field-placeholder"
            )}
          >
            {budgetLabel || t(locale, "selectRange")}
          </span>
          <ChevronIcon open={budgetOpen} />
        </button>
        {budgetOpen ? (
          <div
            role="listbox"
            aria-label={t(locale, "projectBudget")}
            className={dropdownPanelClass()}
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
                    const next = selected ? "" : range;
                    setBudgetRange(next);
                    setCustomBudget("");
                    setValue("budget_range", next);
                    setValue("custom_budget", "");
                    setBudgetOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-xs border px-3 py-2 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
                    selected
                      ? "border-card-border-active bg-card-active font-medium text-primary"
                      : "border-transparent text-text-secondary hover:bg-primary/8 hover:text-primary"
                  )}
                >
                  {range}
                </button>
              );
            })}
            <div className="my-1 border-t border-card-border" />
            <div className="px-3 py-2">
              <label
                htmlFor="budget-custom"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-field-label"
              >
                {t(locale, "customBudget")}
              </label>
              <input
                id="budget-custom"
                type="text"
                placeholder={t(locale, "customBudget")}
                value={customBudget}
                onChange={(event) => {
                  setCustomBudget(event.target.value);
                  setValue("custom_budget", event.target.value);
                }}
                className="h-9 w-full rounded-input border border-field-border bg-field-bg px-3 text-sm text-field-text placeholder:text-field-placeholder transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-field-border-hover focus-visible:border-primary focus-visible:outline-none focus-visible:outline-offset-2"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <Textarea
          id="message"
          rows={4}
          placeholder={t(locale, "tellUsProject")}
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-error">{translateValidation(locale, errors.message.message)}</p>
        ) : null}
      </div>

      {serverError ? (
        <p
          role="alert"
          className="rounded-sm bg-error-soft px-3 py-2 text-sm text-error"
        >
          {serverError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="large"
        loading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? t(locale, "sending") : t(locale, "sendMessage")}
      </Button>
    </form>
  );
}
