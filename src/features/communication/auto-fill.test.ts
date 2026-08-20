import { describe, expect, it } from "vitest";
import { autoFill, AUTO_FILL_KEYS, buildContextFromContact } from "./auto-fill";

describe("autoFill", () => {
  it("replaces known placeholders with provided values", () => {
    const template =
      "Hi {{name}}, your project {{project_name}} is in stage {{project_stage}}.";
    const result = autoFill(template, {
      name: "Anna",
      project_name: "Website",
      project_stage: "Design",
    });
    expect(result).toBe(
      "Hi Anna, your project Website is in stage Design."
    );
  });

  it("fills the spec's customer variables (email, phone, service, lead id, date)", () => {
    const template =
      "{{customer_email}} / {{phone}} / {{service_name}} / {{lead_id}} / {{date}}";
    const result = autoFill(template, {
      customer_email: "anna@example.com",
      phone: "+49 152 0000000",
      service_name: "Website Development",
      lead_id: "lead-123",
      date: "2026-08-20",
    });
    expect(result).toBe(
      "anna@example.com / +49 152 0000000 / Website Development / lead-123 / 2026-08-20"
    );
  });

  it("treats unknown keys as empty strings", () => {
    expect(autoFill("{{unknown_key}} stays", {})).toBe(" stays");
  });

  it("matches case-insensitively and tolerates inner whitespace", () => {
    expect(autoFill("{{ Name }}!", { name: "Leo" })).toBe("Leo!");
  });

  it("exposes all spec-required keys in AUTO_FILL_KEYS", () => {
    for (const key of [
      "name",
      "customer_email",
      "phone",
      "project_name",
      "service_name",
      "lead_id",
      "date",
    ]) {
      expect(AUTO_FILL_KEYS).toContain(key);
    }
  });
});

describe("buildContextFromContact", () => {
  it("maps contact fields onto the auto-fill context", () => {
    const context = buildContextFromContact({
      name: "Anna",
      email: "anna@example.com",
      phone: "+49 152 0000000",
      company: "Acme",
      projectName: "Website",
      serviceName: "Development",
      sectionName: "Contact",
      leadId: "lead-123",
      date: "2026-08-20",
    });
    expect(context).toEqual({
      name: "Anna",
      customer_email: "anna@example.com",
      phone: "+49 152 0000000",
      company: "Acme",
      project_name: "Website",
      project_stage: null,
      service_name: "Development",
      section_name: "Contact",
      lead_id: "lead-123",
      date: "2026-08-20",
    });
  });
});
