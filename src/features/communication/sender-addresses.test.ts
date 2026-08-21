import { describe, expect, it } from "vitest";
import {
  DEFAULT_SENDER_ADDRESSES,
  normalizeAddressList,
  resolveSenderAddresses,
} from "./sender-addresses-utils";

describe("normalizeAddressList", () => {
  it("trims, lowercases, drops empties and dedupes", () => {
    expect(
      normalizeAddressList([
        " Hello@Stratifit.com ",
        "hello@stratifit.com",
        "",
        "  ",
        null,
        undefined,
        "support@stratifit.com",
      ])
    ).toEqual(["hello@stratifit.com", "support@stratifit.com"]);
  });
});

describe("resolveSenderAddresses", () => {
  it("prefers the database list", () => {
    expect(
      resolveSenderAddresses(
        ["hello@stratifit.com", "info@stratifit.com"],
        ["sales@stratifit.com"]
      )
    ).toEqual(["hello@stratifit.com", "info@stratifit.com"]);
  });

  it("falls back to env addresses when the database is empty", () => {
    expect(resolveSenderAddresses([], ["contact@stratifit.com"])).toEqual([
      "contact@stratifit.com",
    ]);
  });

  it("falls back to defaults when both are empty", () => {
    expect(resolveSenderAddresses([], [])).toEqual(DEFAULT_SENDER_ADDRESSES);
  });

  it("dedupes normalized duplicates inside the winning source", () => {
    expect(
      resolveSenderAddresses(
        ["hello@stratifit.com", "HELLO@stratifit.com", "info@stratifit.com"],
        ["hello@stratifit.com", "support@stratifit.com"]
      )
    ).toEqual(["hello@stratifit.com", "info@stratifit.com"]);
  });
});
