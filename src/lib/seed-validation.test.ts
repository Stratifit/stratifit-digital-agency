import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { validateSeed } = require("../../scripts/validate-seed.cjs") as {
  validateSeed: (source: string) => string[];
};

describe("validateSeed", () => {
  it("accepts the repository seed", () => {
    const seed = readFileSync(resolve(process.cwd(), "supabase/seed.sql"), "utf8");

    expect(validateSeed(seed)).toEqual([]);
  });

  it("accepts SQL-escaped apostrophes", () => {
    expect(validateSeed("select 'l''idée';")).toEqual([]);
  });

  it("rejects unescaped apostrophes inside SQL strings", () => {
    expect(validateSeed("select 'l'idée';")).toEqual([
      "Line 1: possible unescaped apostrophe inside SQL string",
    ]);
  });

  it("rejects duplicate commas outside strings", () => {
    expect(validateSeed("insert into example values (1),, (2);")).toEqual([
      "Line 1: duplicate comma outside SQL string",
    ]);
  });

  it("rejects malformed SQL comment lines", () => {
    expect(validateSeed("- Seed data\nselect 1;")).toEqual([
      "Line 1: malformed SQL comment; expected --",
    ]);
  });
});
