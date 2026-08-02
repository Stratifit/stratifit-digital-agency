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
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
];

export function ContactForm({
  services = [],
  locale = "en",
}: {
  services?: PublicServiceDetail[];
  locale?: string;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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
      custom_budget: "",
      message: "",
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name *"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-error">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          placeholder="Company name"
          {...register("company")}
        />
      </div>

      {services.length > 0 ? (
        <div className="space-y-2">
          <Label htmlFor="service">
            Services you&apos;re interested in
          </Label>
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

      <div className="space-y-2">
        <Label htmlFor="budget">Project budget</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select id="budget" {...register("budget_range")}>
            <option value="" disabled>
              Select range
            </option>
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </Select>
          <Input
            id="budget-custom"
            placeholder="Custom budget"
            {...register("custom_budget")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
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
