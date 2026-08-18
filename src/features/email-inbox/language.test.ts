import { describe, expect, it } from "vitest";
import {
  detectEmailLanguage,
  renderEmailTemplate,
  renderTemplateText,
} from "./language";

describe("detectEmailLanguage", () => {
  it("returns en for empty or English text", () => {
    expect(detectEmailLanguage({})).toBe("en");
    expect(
      detectEmailLanguage({ subject: "Website project", text: "Hello, I need help with a website." })
    ).toBe("en");
  });

  it("detects German from stop words", () => {
    expect(
      detectEmailLanguage({
        subject: "Anfrage",
        text: "Hallo, ich habe eine Anfrage zu einem Projekt. Vielen Dank.",
      })
    ).toBe("de");
  });

  it("detects French from stop words", () => {
    expect(
      detectEmailLanguage({
        subject: "Demande de devis",
        text: "Bonjour, merci de m'envoyer un devis pour notre projet.",
      })
    ).toBe("fr");
  });

  it("detects Spanish from stop words", () => {
    expect(
      detectEmailLanguage({
        subject: "Consulta",
        text: "Hola, gracias por su ayuda. Quiero un presupuesto para mi proyecto.",
      })
    ).toBe("es");
  });

  it("prefers the content-language header when supported", () => {
    expect(
      detectEmailLanguage({
        headers: { "content-language": "fr" },
        text: "Hello, this is an English message.",
      })
    ).toBe("fr");
  });

  it("ignores an unsupported content-language header", () => {
    expect(
      detectEmailLanguage({
        headers: { "content-language": "ja" },
        text: "Hello, this is an English message.",
      })
    ).toBe("en");
  });
});

describe("renderTemplateText", () => {
  it("replaces known placeholders", () => {
    expect(
      renderTemplateText("Hi {{name}}, thanks for your {{section_name}} enquiry.", {
        name: "Alex",
        section_name: "Branding",
      })
    ).toBe("Hi Alex, thanks for your Branding enquiry.");
  });

  it("supports spaces inside braces and case-insensitive keys", () => {
    expect(
      renderTemplateText("Hi {{ Name }}", { name: "Alex" })
    ).toBe("Hi Alex");
  });

  it("empties unknown placeholders", () => {
    expect(
      renderTemplateText("Hi {{name}}, {{not_a_known_key}}", { name: "Alex" })
    ).toBe("Hi Alex, ");
  });

  it("renders billing placeholders", () => {
    expect(
      renderTemplateText(
        "Invoice {{invoice_number}} of {{amount}} due {{due_date}}",
        { invoice_number: "INV-2026-001", amount: "$2,400", due_date: "2026-09-01" }
      )
    ).toBe("Invoice INV-2026-001 of $2,400 due 2026-09-01");
  });
});

describe("renderEmailTemplate", () => {
  const template = {
    subject_translations: {
      en: "Thank you {{name}}",
      de: "Danke {{name}}",
      fr: "Merci {{name}}",
      es: "Gracias {{name}}",
    },
    body_translations: {
      en: "Hi {{name}}, we received your message.",
      de: "Hallo {{name}}, wir haben Ihre Nachricht erhalten.",
      fr: "Bonjour {{name}}, nous avons reçu votre message.",
      es: "Hola {{name}}, hemos recibido su mensaje.",
    },
  };

  it("renders the requested language with placeholders", () => {
    const { subject, body } = renderEmailTemplate(template, "de", {
      name: "Anna",
    });
    expect(subject).toBe("Danke Anna");
    expect(body).toBe("Hallo Anna, wir haben Ihre Nachricht erhalten.");
  });

  it("falls back to English for a missing language", () => {
    const partial = {
      subject_translations: { en: "Hello {{name}}" },
      body_translations: { en: "Hi {{name}}" },
    };
    const { subject, body } = renderEmailTemplate(partial, "es", {
      name: "Leo",
    });
    expect(subject).toBe("Hello Leo");
    expect(body).toBe("Hi Leo");
  });
});
