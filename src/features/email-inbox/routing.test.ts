import { describe, expect, it } from "vitest";
import {
  pickSectionByLanguage,
  selectSectionForLanguage,
  type SectionRoutingCandidate,
} from "./routing";

const section = (
  overrides: Partial<SectionRoutingCandidate>
): SectionRoutingCandidate => ({
  id: "id",
  slug: "section",
  language: null,
  routing_addresses: [],
  ...overrides,
});

describe("selectSectionForLanguage", () => {
  it("returns null when there are no sections", () => {
    expect(selectSectionForLanguage([], ["a@x.com"], "en")).toBeNull();
  });

  it("routes an address match to the matching-language section first", () => {
    const sections = [
      section({
        id: "agnostic",
        slug: "support",
        language: null,
        routing_addresses: ["support@stratifit.com"],
      }),
      section({
        id: "de",
        slug: "support-de",
        language: "de",
        routing_addresses: ["support@stratifit.com"],
      }),
    ];
    expect(
      selectSectionForLanguage(sections, ["support@stratifit.com"], "de")
    ).toEqual({ id: "de", slug: "support-de" });
  });

  it("falls back to a language-agnostic section when no language matches", () => {
    const sections = [
      section({
        id: "agnostic",
        slug: "support",
        language: null,
        routing_addresses: ["support@stratifit.com"],
      }),
      section({
        id: "fr",
        slug: "support-fr",
        language: "fr",
        routing_addresses: ["support@stratifit.com"],
      }),
    ];
    expect(
      selectSectionForLanguage(sections, ["support@stratifit.com"], "de")
    ).toEqual({ id: "agnostic", slug: "support" });
  });

  it("matches addresses case-insensitively", () => {
    const sections = [
      section({
        id: "de",
        slug: "support-de",
        language: "de",
        routing_addresses: ["Support@Stratifit.com"],
      }),
    ];
    expect(
      selectSectionForLanguage(sections, ["SUPPORT@STRATIFIT.COM"], "de")
    ).toEqual({ id: "de", slug: "support-de" });
  });

  it("falls back to the `other` section in the matching language", () => {
    const sections = [
      section({
        id: "other-agnostic",
        slug: "other",
        language: null,
        routing_addresses: [],
      }),
      section({
        id: "other-fr",
        slug: "other",
        language: "fr",
        routing_addresses: [],
      }),
    ];
    expect(
      selectSectionForLanguage(sections, ["unknown@x.com"], "fr")
    ).toEqual({ id: "other-fr", slug: "other" });
  });

  it("falls back to a language-agnostic `other` section", () => {
    const sections = [
      section({
        id: "other-agnostic",
        slug: "other",
        language: null,
        routing_addresses: [],
      }),
    ];
    expect(
      selectSectionForLanguage(sections, ["unknown@x.com"], "es")
    ).toEqual({ id: "other-agnostic", slug: "other" });
  });
});

describe("pickSectionByLanguage", () => {
  const sections = [
    { id: "agnostic", language: null },
    { id: "de", language: "de" },
    { id: "fr", language: "fr" },
  ];

  it("picks the matching-language section", () => {
    expect(pickSectionByLanguage(sections, "de")).toEqual({
      id: "de",
      language: "de",
    });
  });

  it("falls back to the language-agnostic section when no language matches", () => {
    expect(pickSectionByLanguage(sections, "es")).toEqual({
      id: "agnostic",
      language: null,
    });
  });

  it("falls back to the language-agnostic section when no language is given", () => {
    expect(pickSectionByLanguage(sections, undefined)).toEqual({
      id: "agnostic",
      language: null,
    });
  });

  it("falls back to the first section when there is no agnostic section", () => {
    expect(pickSectionByLanguage([{ id: "de", language: "de" }], "fr")).toEqual({
      id: "de",
      language: "de",
    });
  });

  it("returns undefined for an empty list", () => {
    expect(pickSectionByLanguage([], "de")).toBeUndefined();
  });
});
