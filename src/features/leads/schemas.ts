import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  requested_service_id: z.string().optional(),
  budget_range: z.string().optional(),
  custom_budget: z.string().optional(),
  honeypot: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  preferred_locale: z.string().default("en"),
  source: z.literal("contact_form"),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
