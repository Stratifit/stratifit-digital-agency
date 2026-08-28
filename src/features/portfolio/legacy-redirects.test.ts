import { describe, expect, it } from "vitest";
import {
  getLegacyPortfolioRedirect,
  LEGACY_PORTFOLIO_REDIRECTS,
} from "./legacy-redirects";

describe("legacy portfolio redirects", () => {
  it("redirects the old Aura Cosmetics slug to the CLENQO URL", () => {
    expect(getLegacyPortfolioRedirect("aura-cosmetics-identity")).toBe(
      "/work/clenqo"
    );
  });

  it("does not redirect the current CLENQO slug", () => {
    expect(getLegacyPortfolioRedirect("clenqo")).toBeNull();
  });

  it("keeps the redirect target under the public work route", () => {
    expect(Object.values(LEGACY_PORTFOLIO_REDIRECTS)).toEqual([
      "/work/clenqo",
    ]);
  });
});
