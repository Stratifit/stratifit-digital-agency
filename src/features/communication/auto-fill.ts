/** Variables that can be auto-filled into any template via {{placeholders}}. */
export interface AutoFillContext {
  name?: string | null;
  section_name?: string | null;
  company?: string | null;
  amount?: string | null;
  due_date?: string | null;
  invoice_number?: string | null;
  project_name?: string | null;
  project_stage?: string | null;
  payment_status?: string | null;
  issue_description?: string | null;
  meeting_date?: string | null;
  admin_name?: string | null;
  customer_email?: string | null;
  phone?: string | null;
  service_name?: string | null;
  lead_id?: string | null;
  date?: string | null;
}

export const AUTO_FILL_KEYS = [
  "name",
  "section_name",
  "company",
  "amount",
  "due_date",
  "invoice_number",
  "project_name",
  "project_stage",
  "payment_status",
  "issue_description",
  "meeting_date",
  "admin_name",
  "customer_email",
  "phone",
  "service_name",
  "lead_id",
  "date",
] as const;

const KNOWN_KEYS = new Set<string>(AUTO_FILL_KEYS);

/**
 * Replace {{key}} placeholders with context values. Unknown keys become an
 * empty string; provided values are escaped for the HTML version by the
 * renderer, so plain text replacement is safe here.
 */
export function autoFill(template: string, context: AutoFillContext): string {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (match, key: string) => {
    const normalized = key.toLowerCase();
    if (!KNOWN_KEYS.has(normalized)) return "";
    const value = context[normalized as keyof AutoFillContext];
    return value ?? "";
  });
}

/** Parse `"Name" <name@example.com>` / `Name <name@example.com>` / bare. */
export function parseSenderHeader(from: string): {
  name: string | null;
  email: string;
} {
  const match = from.match(/^(?:"?([^"<]*)"?\s*<([^>]+)>|([^@\s]+@[^@\s]+))$/);
  if (!match) {
    return { name: null, email: from.trim() };
  }
  if (match[3]) {
    return { name: null, email: match[3] };
  }
  const name = (match[1] ?? "").trim();
  return { name: name.length > 0 ? name : null, email: match[2].trim() };
}

/** Build an AutoFillContext from a conversation / lead record. */
export function buildContextFromContact(input: {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  projectName?: string | null;
  projectStage?: string | null;
  serviceName?: string | null;
  sectionName?: string | null;
  leadId?: string | null;
  date?: string | null;
}): AutoFillContext {
  return {
    name: input.name ?? null,
    customer_email: input.email ?? null,
    phone: input.phone ?? null,
    company: input.company ?? null,
    project_name: input.projectName ?? null,
    project_stage: input.projectStage ?? null,
    service_name: input.serviceName ?? null,
    section_name: input.sectionName ?? null,
    lead_id: input.leadId ?? null,
    date: input.date ?? null,
  };
}
