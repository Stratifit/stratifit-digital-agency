import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { validateSeed } = require("../../scripts/validate-seed.cjs") as {
  validateSeed: (source: string) => string[];
};
const { validateSeedRerunSafety } = require("../../scripts/check-seed-rerun.cjs") as {
  validateSeedRerunSafety: (source: string) => string[];
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

describe("validateSeedRerunSafety", () => {
  it("accepts the repository seed", () => {
    const seed = readFileSync(resolve(process.cwd(), "supabase/seed.sql"), "utf8");

    expect(validateSeedRerunSafety(seed)).toEqual([]);
  });

  it("requires conflict handling for inserts", () => {
    expect(
      validateSeedRerunSafety("insert into public.example (id) values (1);")
    ).toEqual([
      "Line 1: INSERT into public.example must include ON CONFLICT for rerun safety",
    ]);
    expect(
      validateSeedRerunSafety(
        "insert into public.example (id) values (1) on conflict (id) do nothing;"
      )
    ).toEqual([]);
  });

  it("allows only the documented insights reset", () => {
    expect(validateSeedRerunSafety("delete from public.insights;")).toEqual([]);
    expect(validateSeedRerunSafety("delete from public.leads;")).toEqual([
      "Line 1: DELETE from public.leads is not an approved seed reset",
    ]);
  });

  it("requires scoped, deterministic updates", () => {
    expect(validateSeedRerunSafety("update public.example set value = 'x';")).toEqual([
      "Line 1: UPDATE statements must include WHERE",
    ]);
    expect(
      validateSeedRerunSafety(
        "update public.example set value = 'x' where id = 1;"
      )
    ).toEqual([]);
    expect(
      validateSeedRerunSafety(
        "update public.example set updated_at = now() where id = 1;"
      )
    ).toEqual(["Line 1: UPDATE statements must not use volatile values"]);
  });

  it("rejects schema and destructive statements", () => {
    expect(validateSeedRerunSafety("truncate public.example;")).toEqual([
      "Line 1: schema or destructive statements are not allowed in the seed",
    ]);
  });
});
