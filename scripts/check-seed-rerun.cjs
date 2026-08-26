/**
 * Checks that the Supabase seed uses only rerun-safe write patterns.
 *
 * This is intentionally dependency-free and does not require Supabase
 * credentials or Docker. It does not execute SQL.
 *
 * Rules:
 * - Every INSERT must include ON CONFLICT.
 * - DELETE is limited to the explicit insights reset tables.
 * - UPDATE statements must be scoped with WHERE and avoid volatile values.
 * - Schema/destructive statements are rejected.
 *
 * Run: node scripts/check-seed-rerun.cjs
 */
const fs = require("fs");
const path = require("path");

const DEFAULT_SEED_PATH = path.join(__dirname, "..", "supabase", "seed.sql");
const RESET_TABLES = new Set([
  "public.insight_category_links",
  "public.insights",
  "public.insight_categories",
]);

function lineNumberAt(source, index) {
  let line = 1;
  for (let cursor = 0; cursor < index; cursor += 1) {
    if (source[cursor] === "\n") line += 1;
  }
  return line;
}

function maskCommentsAndStrings(source) {
  const masked = [];
  let state = "code";

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];

    if (state === "comment") {
      if (current === "\n") {
        masked.push("\n");
        state = "code";
      } else {
        masked.push(" ");
      }
      continue;
    }

    if (state === "string") {
      if (current === "'" && next === "'") {
        masked.push(" ", " ");
        index += 1;
        continue;
      }
      if (current === "'") state = "code";
      masked.push(current === "\n" ? "\n" : " ");
      continue;
    }

    if (current === "-" && next === "-") {
      masked.push(" ", " ");
      index += 1;
      state = "comment";
      continue;
    }

    if (current === "'") {
      masked.push(" ");
      state = "string";
      continue;
    }

    masked.push(current);
  }

  return masked.join("");
}

function splitStatements(source) {
  const masked = maskCommentsAndStrings(source);
  const statements = [];
  let start = 0;

  for (let index = 0; index < masked.length; index += 1) {
    if (masked[index] !== ";") continue;

    const text = masked.slice(start, index).trim();
    if (text) statements.push({ text, start });
    start = index + 1;
  }

  const text = masked.slice(start).trim();
  if (text) statements.push({ text, start });

  return statements;
}

/**
 * @param {string} source
 * @returns {string[]}
 */
function validateSeedRerunSafety(source) {
  const errors = [];

  for (const statement of splitStatements(source)) {
    const { text, start } = statement;
    const line = lineNumberAt(source, start);

    const insertMatch = text.match(
      /^\s*INSERT\s+INTO\s+(?:ONLY\s+)?([a-z_][a-z0-9_.]*)\b/i
    );
    if (insertMatch) {
      if (!/\bON\s+CONFLICT\b/i.test(text)) {
        errors.push(
          `Line ${line}: INSERT into ${insertMatch[1]} must include ON CONFLICT for rerun safety`
        );
      }
      continue;
    }

    const deleteMatch = text.match(
      /^\s*DELETE\s+FROM\s+([a-z_][a-z0-9_.]*)\s*$/i
    );
    if (deleteMatch) {
      if (!RESET_TABLES.has(deleteMatch[1].toLowerCase())) {
        errors.push(
          `Line ${line}: DELETE from ${deleteMatch[1]} is not an approved seed reset`
        );
      }
      continue;
    }

    if (/^\s*DELETE\b/i.test(text)) {
      errors.push(
        `Line ${line}: DELETE statements must exactly target an approved seed reset table`
      );
      continue;
    }

    if (/^\s*UPDATE\b/i.test(text)) {
      if (!/\bWHERE\b/i.test(text)) {
        errors.push(`Line ${line}: UPDATE statements must include WHERE`);
      }
      if (/\b(?:now|random)\s*\(/i.test(text)) {
        errors.push(
          `Line ${line}: UPDATE statements must not use volatile values`
        );
      }
      continue;
    }

    if (/^\s*(?:TRUNCATE|DROP|CREATE|ALTER|GRANT|REVOKE)\b/i.test(text)) {
      errors.push(
        `Line ${line}: schema or destructive statements are not allowed in the seed`
      );
    }
  }

  return [...new Set(errors)];
}

function main() {
  const seedPath = process.argv[2] || DEFAULT_SEED_PATH;
  const source = fs.readFileSync(seedPath, "utf8");
  const errors = validateSeedRerunSafety(source);

  if (errors.length > 0) {
    console.error(`Seed rerun-safety check failed: ${errors.length} problem(s)`);
    errors.forEach((error) => console.error(`  ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(
    `Seed rerun-safety check passed: ${path.relative(process.cwd(), seedPath)}`
  );
}

if (require.main === module) main();

module.exports = { validateSeedRerunSafety };
