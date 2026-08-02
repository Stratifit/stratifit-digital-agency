"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { leadSchema, type LeadFormValues } from "@/features/leads/schemas";
import { submitLead } from "@/features/leads/mutations";
import type { PublicServiceDetail } from "@/features/services/queries";
import { resolveTranslation } from "@/lib/i18n/resolve-translation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
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

export function ContactForm({
  services = [],
  locale = "en",
}: {
  services?: PublicServiceDetail[];
  locale?: string;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [budgetOpen, setBudgetOpen] = React.useState(false);
  const [budgetValue, setBudgetValue] = React.useState("");
  const budgetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        budgetRef.current &&
        !budgetRef.current.contains(event.target as Node)
      ) {
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
      requested_service_id: "",
      budget_range: "",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(values: z.input<typeof leadSchema>) {
    setServerError(null);
    const result = await submitLead({
      ...values,
      source: "contact_form",
      preferred_locale: locale,
    } as LeadFormValues);
    if (result.success) {
      setSubmitted(true);
      reset();
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-radius-md border border-success-border bg-success-soft p-8 text-center">
        <p className="font-medium text-success">Thank you!</p>
        <p className="mt-2 text-sm text-text-secondary">
          Your message has been received. We will get back to you shortly.
        </p>
        <Button
          variant="secondary"
          size="small"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Send another message
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
            placeholder="Your name *"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-error">{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com *"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <Input
          id="company"
          placeholder="Company name"
          {...register("company")}
        />
      </div>

      {services.length > 0 ? (
        <div>
          <Select id="service" {...register("requested_service_id")}>
            <option value="" disabled>
              Select services you&apos;re interested in
            </option>
            {services.map((service) => (
              <option key={service.slug} value={service.id}>
                {resolveTranslation(service.title_translations, locale)}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      <div ref={budgetRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={budgetOpen}
          onClick={() => setBudgetOpen((v) => !v)}
          className="flex h-11 w-full items-center gap-3 rounded-[10px] border border-card-border bg-card-dark px-4 text-left transition-[background-color,border-color] duration-[var(--motion-fast)] ease-[var(--ease-standard)] hover:border-card-border-hover active:border-card-border-active active:bg-card-active focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-card-focus focus-visible:outline-offset-2"
        >
          <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-text-muted">
            Project Budget
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              budgetValue ? "text-text-primary" : "text-text-subtle"
            )}
          >
            {budgetValue || "Select a range"}
          </span>
          <ChevronIcon open={budgetOpen} />
        </button>
        {budgetOpen ? (
          <div
            role="listbox"
            aria-label="Project budget range"
            className="absolute z-50 mt-2 w-full rounded-[10px] border border-card-border bg-card-dark p-1 shadow-shadow-md"
          >
            {BUDGET_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                role="option"
                aria-selected={budgetValue === range}
                onClick={() => {
                  setBudgetValue(range);
                  setValue("budget_range", range);
                  setBudgetOpen(false);
                }}
                className={cn(
                  "block w-full rounded-radius-xs border px-3 py-2 text-left text-sm transition-colors duration-[var(--motion-fast)] ease-[var(--ease-standard)]",
                  budgetValue === range
                    ? "border-card-border-active bg-card-active font-medium text-primary"
                    : "border-transparent text-text-secondary hover:bg-primary/8 hover:text-primary"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <Textarea
          id="message"
          rows={4}
          placeholder="Tell us about your project *"
          {...register("message")}
        />
        {errors.message ? (
          <p className="mt-1 text-xs text-error">{errors.message.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p
          role="alert"
          className="rounded-radius-sm bg-error-soft px-3 py-2 text-sm text-error"
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
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
