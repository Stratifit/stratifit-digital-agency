"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { leadSchema, type LeadFormValues } from "@/features/leads/schemas";
import { submitLead } from "@/features/leads/mutations";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { t, tWithNumber, translateValidation } from "@/lib/i18n/ui-strings";
import { cn } from "@/lib/cn";

const BUDGET_RANGE_KEYS = [
  "budgetBelow7500",
  "budget7500to15000",
  "budget15000to30000",
  "budget30000to60000",
  "budgetAbove60000",
] as const;

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

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[17px]"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[17px]"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[17px]"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[17px]"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M3 11h3c.8 0 1.6.3 2.1.9.7.9 2 .9 2.9 0 .5-.6 1.3-.9 2.1-.9h3" />
    </svg>
  );
}

// ============================================================================
// Shared field styles
// ============================================================================

/** Leading icon slot rendered inside a field. */
function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-text-subtle">
      {children}
    </span>
  );
}

const fieldBase =
  "h-11 w-full rounded-card border border-field-border bg-field-bg text-sm text-field-text placeholder:text-field-placeholder outline-none transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(245,158,11,0.10)] aria-[invalid=true]:border-error/60 sm:h-12";

interface FieldShellProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  /** Optional leading icon rendered inside the field. */
  icon?: React.ReactNode;
}

function FieldShell({ label, required, children, error, icon }: FieldShellProps) {
  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>
      {icon ? (
        <div className="relative">
          <FieldIcon>{icon}</FieldIcon>
          {children}
        </div>
      ) : (
        children
      )}
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
      requested_service_ids: [],
      budget_range: "",
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

  return (
    <>
      {/* Thank-you confirmation — a modal over the page, so only the sent
          card is visible (the contact section stays hidden behind the
          backdrop until the visitor closes or sends another message). */}
      <Dialog
        open={submitted}
        onOpenChange={(open) => {
          if (!open) setSubmitted(false);
        }}
      >
        <DialogContent
          overlayClassName="bg-black/80"
          hideClose
          className="max-w-md border-card-border bg-card-dark p-6 sm:p-8"
        >
          <div className="py-8 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <Mail className="size-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="mb-3 font-display text-2xl font-bold tracking-tight text-text-primary">
              {t(locale, "thankYou")}
            </h3>
            <p className="text-sm text-text-muted">
              {t(locale, "messageReceived")}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 inline-flex items-center justify-center rounded-button border border-card-border bg-transparent px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-primary/30 hover:text-text-primary focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-primary/35 focus-visible:outline-offset-2"
            >
              {t(locale, "sendAnotherMessage")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

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
          icon={<UserIcon />}
          error={
            errors.name
              ? translateValidation(locale, errors.name.message)
              : undefined
          }
        >
          <input
            type="text"
            className={cn(fieldBase, "pl-11 pr-4")}
            placeholder={t(locale, "namePlaceholder")}
            {...register("name")}
          />
        </FieldShell>

        <FieldShell
          label={t(locale, "emailLabel").replace(" *", "")}
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
            className={cn(fieldBase, "pl-11 pr-4")}
            placeholder={t(locale, "yourEmail").replace(" *", "")}
            {...register("email")}
          />
        </FieldShell>
      </div>

      {/* Services + Budget — always side by side (2 cols), matching the reference */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div ref={servicesRef} className="min-w-0">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
            {t(locale, "selectServices")}
            <span className="ml-1 text-primary">*</span>
          </label>
          <div className="relative">
            <FieldIcon>
              <LayersIcon />
            </FieldIcon>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className={cn(fieldBase, "flex items-center pl-11 pr-9", "text-left")}
            >
              <span
                className={cn(
                  "min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  selectedServices.length > 0
                    ? "text-field-text"
                    : "text-field-placeholder"
                )}
              >
                {selectedServices.length === 0
                  ? t(locale, "selectService")
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
                onClick={(event) => {
                  // Clicking empty space inside the dropdown closes it;
                  // option clicks are handled by the option buttons themselves.
                  if (!(event.target as HTMLElement).closest('[role="option"]')) {
                    setServicesOpen(false);
                  }
                }}
                className="absolute z-30 mt-2 w-[calc(200%+12px)] rounded-card border border-white/10 bg-card-dark py-2 shadow-2xl max-h-56 overflow-y-auto sm:w-[calc(200%+16px)]"
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
                            : "border-white/20"
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

        <div ref={budgetRef} className="min-w-0">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary sm:text-sm">
            {t(locale, "estimatedBudget")}
          </label>
          <div className="relative">
            <FieldIcon>
              <WalletIcon />
            </FieldIcon>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={budgetOpen}
              onClick={() => setBudgetOpen((v) => !v)}
              className={cn(fieldBase, "flex items-center pl-11 pr-9", "text-left")}
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
                className="absolute z-30 mt-2 w-full rounded-card border border-white/10 bg-card-dark py-2 shadow-2xl max-h-56 overflow-y-auto"
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
                {BUDGET_RANGE_KEYS.map((key) => {
                  const label = t(locale, key);
                  const selected = budgetRange === label;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setBudgetRange(label);
                        setValue("budget_range", label);
                        setBudgetOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.03]",
                        selected
                          ? "font-medium text-primary"
                          : "text-text-secondary"
                      )}
                    >
                      {label}
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
    </>
  );
}
