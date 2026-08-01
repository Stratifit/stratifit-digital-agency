"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { leadSchema, type LeadFormValues } from "@/features/leads/schemas";
import { submitLead } from "@/features/leads/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof leadSchema>>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", message: "" },
  });

  async function onSubmit(values: z.input<typeof leadSchema>) {
    setServerError(null);
    const result = await submitLead({
      ...values,
      source: "contact_form",
      preferred_locale: "en",
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
        <Button variant="secondary" size="small" className="mt-4" onClick={() => setSubmitted(false)}>
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
          <Input id="name" placeholder="Your name" {...register("name")} />
          {errors.name ? <p className="text-sm text-error">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email ? <p className="text-sm text-error">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" placeholder="+49…" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company (optional)</Label>
          <Input id="company" placeholder="Company name" {...register("company")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us about your project…"
          {...register("message")}
        />
        {errors.message ? <p className="text-sm text-error">{errors.message.message}</p> : null}
      </div>

      {serverError ? (
        <p role="alert" className="rounded-radius-sm bg-error-soft px-3 py-2 text-sm text-error">
          {serverError}
        </p>
      ) : null}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
