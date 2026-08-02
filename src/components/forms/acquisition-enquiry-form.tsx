"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  acquisitionEnquirySchema,
  type AcquisitionEnquiryFormValues,
} from "@/features/leads/schemas";
import { submitAcquisitionEnquiry } from "@/features/leads/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const BUDGET_RANGES = [
  "Under $50,000",
  "$50,000 – $150,000",
  "$150,000 – $500,000",
  "$500,000+",
];

export function AcquisitionEnquiryForm({
  businesses = [],
  locale = "en",
}: {
  businesses?: string[];
  locale?: string;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof acquisitionEnquirySchema>>({
    resolver: zodResolver(acquisitionEnquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      business_interest: "",
      budget_range: "",
      custom_budget: "",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(values: z.input<typeof acquisitionEnquirySchema>) {
    setServerError(null);
    const result = await submitAcquisitionEnquiry({
      ...values,
      source: "acquisition",
      preferred_locale: locale,
    } as AcquisitionEnquiryFormValues);
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
          Your acquisition enquiry has been received. We will get back to you
          shortly.
        </p>
        <Button
          variant="secondary"
          size="small"
          className="mt-4"
          onClick={() => setSubmitted(false)}
        >
          Send another enquiry
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
            id="acq-name"
            placeholder="Your name *"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-error">{errors.name.message}</p>
          ) : null}
        </div>
        <div>
          <Input
            id="acq-email"
            type="email"
            placeholder="you@company.com *"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            id="acq-company"
            placeholder="Company name"
            {...register("company")}
          />
        </div>
        <div>
          <Input
            id="acq-phone"
            type="tel"
            placeholder="Phone (optional)"
            {...register("phone")}
          />
        </div>
      </div>

      {businesses.length > 0 ? (
        <div>
          <Select id="acq-business" {...register("business_interest")}>
            <option value="" disabled>
              Which business are you interested in?
            </option>
            {businesses.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
            <option value="Other / not listed">
              Other / not listed
            </option>
          </Select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Select id="acq-budget" {...register("budget_range")}>
            <option value="" disabled>
              Budget range (optional)
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Input
            id="acq-budget-custom"
            placeholder="Custom budget (optional)"
            {...register("custom_budget")}
          />
        </div>
      </div>

      <div>
        <Textarea
          id="acq-message"
          rows={4}
          placeholder="Tell us about the acquisition you have in mind *"
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
        {isSubmitting ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
