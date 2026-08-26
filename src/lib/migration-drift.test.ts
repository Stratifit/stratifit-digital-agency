import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const { compareMigrationVersions, inspectLocalMigrations } = require(
  "../../scripts/check-migration-drift.cjs"
) as {
  compareMigrationVersions: (
    localVersions: string[],
    remoteVersions: string[]
  ) => string[];
  inspectLocalMigrations: (filenames: string[]) => {
    versions: string[];
    errors: string[];
  };
};

describe("migration drift checks", () => {
  it("extracts valid local migration versions", () => {
    expect(
      inspectLocalMigrations([
        "00002_add_table.sql",
        "00001_initial.sql",
        "20260825210344_portfolio_overview_copy.sql",
      ])
    ).toEqual({
      versions: ["00001", "00002", "20260825210344"],
      errors: [],
    });
  });

  it("rejects invalid and duplicate local migration versions", () => {
    expect(
      inspectLocalMigrations([
        "00001_initial.sql",
        "00001_duplicate.sql",
        "not-a-migration.sql",
      ]).errors
    ).toEqual([
      "Duplicate migration version: 00001",
      "Invalid migration filename: not-a-migration.sql",
    ]);
  });

  it("accepts matching local and remote histories", () => {
    expect(
      compareMigrationVersions(["00001", "00002"], ["00002", "00001"])
    ).toEqual([]);
  });

  it("reports migrations missing on either side", () => {
    expect(
      compareMigrationVersions(["00001", "00003"], ["00001", "00002"])
    ).toEqual([
      "Migration exists locally but not remotely: 00003",
      "Migration exists remotely but not locally: 00002",
    ]);
  });
});
