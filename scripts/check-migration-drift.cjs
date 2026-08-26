/**
 * Checks that local migration filenames are valid and, when the project is
 * linked, that the remote migration history contains the same versions.
 *
 * Run locally without a remote project:
 *   node scripts/check-migration-drift.cjs --local-only
 *
 * Run against a linked project:
 *   node scripts/check-migration-drift.cjs
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const MIGRATIONS_DIR = path.join(__dirname, "..", "supabase", "migrations");
const MIGRATION_FILE = /^(\d+)(?:_.+)?\.sql$/;

/**
 * @param {string[]} filenames
 * @returns {{ versions: string[], errors: string[] }}
 */
function inspectLocalMigrations(filenames) {
  const errors = [];
  const versions = [];
  const seen = new Set();

  for (const filename of filenames.filter((name) => name.endsWith(".sql"))) {
    const match = MIGRATION_FILE.exec(filename);
    if (!match) {
      errors.push(`Invalid migration filename: ${filename}`);
      continue;
    }

    const version = match[1];
    if (seen.has(version)) {
      errors.push(`Duplicate migration version: ${version}`);
      continue;
    }

    seen.add(version);
    versions.push(version);
  }

  return { versions: versions.sort(), errors };
}

/**
 * @param {string[]} localVersions
 * @param {string[]} remoteVersions
 * @returns {string[]}
 */
function compareMigrationVersions(localVersions, remoteVersions) {
  const local = new Set(localVersions);
  const remote = new Set(remoteVersions);
  const errors = [];

  for (const version of local) {
    if (!remote.has(version)) {
      errors.push(`Migration exists locally but not remotely: ${version}`);
    }
  }

  for (const version of remote) {
    if (!local.has(version)) {
      errors.push(`Migration exists remotely but not locally: ${version}`);
    }
  }

  return errors.sort();
}

function validateLocalMigrations() {
  const { versions, errors } = inspectLocalMigrations(
    fs.readdirSync(MIGRATIONS_DIR)
  );

  if (errors.length > 0) {
    return { versions, errors };
  }

  console.log(`Local migration history: ${versions.length} version(s)`);
  return { versions, errors: [] };
}

function getRemoteMigrationVersions() {
  const projectRoot = path.join(__dirname, "..");
  const supabaseCli = path.join(
    projectRoot,
    "node_modules",
    "supabase",
    "dist",
    "supabase.js"
  );
  const result = spawnSync(
    process.execPath,
    [supabaseCli, "migration", "list", "--linked", "--output-format", "json"],
    {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }
  );

  if (result.error) {
    throw new Error(`Unable to run Supabase CLI: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(
      `Supabase migration list failed${result.stderr ? `: ${result.stderr.trim()}` : ""}`
    );
  }

  let payload;
  try {
    payload = JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(
      `Supabase migration list returned invalid JSON: ${error.message}`
    );
  }

  const migrations = Array.isArray(payload.migrations) ? payload.migrations : [];
  return migrations.map((migration) => migration.remote).filter(Boolean).sort();
}

function main() {
  const localResult = validateLocalMigrations();
  if (localResult.errors.length > 0) {
    console.error("Migration history validation failed:");
    localResult.errors.forEach((error) => console.error(`  ${error}`));
    process.exitCode = 1;
    return;
  }

  if (process.argv.includes("--local-only")) {
    console.log("Remote migration check skipped (--local-only).");
    return;
  }

  let remoteVersions;
  try {
    remoteVersions = getRemoteMigrationVersions();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const drift = compareMigrationVersions(localResult.versions, remoteVersions);
  if (drift.length > 0) {
    console.error("Migration history drift detected:");
    drift.forEach((error) => console.error(`  ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(
    `Migration history aligned: ${localResult.versions.length} local / ${remoteVersions.length} remote version(s)`
  );
}

if (require.main === module) main();

module.exports = {
  compareMigrationVersions,
  inspectLocalMigrations,
};
