/**
 * Performs static checks on the Supabase seed before it is sent to a database.
 *
 * This is intentionally dependency-free and does not require Supabase credentials
 * or Docker. It catches malformed SQL patterns that previously blocked the linked
 * seed: unescaped apostrophes, duplicate commas, broken comment lines, and
 * unterminated string literals.
 *
 * Run: node scripts/validate-seed.cjs
 */
const fs = require("fs");
const path = require("path");

const DEFAULT_SEED_PATH = path.join(__dirname, "..", "supabase", "seed.sql");

function lineNumberAt(source, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (source[i] === "\n") line += 1;
  }
  return line;
}

/**
 * @param {string} source
 * @returns {string[]}
 */
function validateSeed(source) {
  const errors = [];
  let state = "code";
  let stringStart = 0;

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];

    if (state === "comment") {
      if (current === "\n") state = "code";
      continue;
    }

    if (state === "string") {
      if (current !== "'") continue;

      // SQL escapes a single quote inside a literal by doubling it.
      if (next === "'") {
        index += 1;
        continue;
      }

      const previous = source[index - 1];
      if (/\w/.test(previous || "") && /\w/.test(next || "")) {
        errors.push(
          `Line ${lineNumberAt(source, index)}: possible unescaped apostrophe inside SQL string`
        );
        continue;
      }

      state = "code";
      continue;
    }

    if (current === "-" && next === "-") {
      state = "comment";
      index += 1;
      continue;
    }

    if (current === "'") {
      state = "string";
      stringStart = index;
      continue;
    }

    if (current === "," && next === ",") {
      errors.push(
        `Line ${lineNumberAt(source, index)}: duplicate comma outside SQL string`
      );
      continue;
    }
  }

  if (state === "string") {
    errors.push(
      `Line ${lineNumberAt(source, stringStart)}: unterminated SQL string literal`
    );
  }

  source.split(/\r?\n/).forEach((line, index) => {
    if (/^\s*-\s+/.test(line)) {
      errors.push(`Line ${index + 1}: malformed SQL comment; expected --`);
    }
  });

  return [...new Set(errors)];
}

function main() {
  const seedPath = process.argv[2] || DEFAULT_SEED_PATH;
  const source = fs.readFileSync(seedPath, "utf8");
  const errors = validateSeed(source);

  if (errors.length > 0) {
    console.error(`Seed validation failed: ${errors.length} problem(s)`);
    errors.forEach((error) => console.error(`  ${error}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Seed validation passed: ${path.relative(process.cwd(), seedPath)}`);
}

if (require.main === module) main();

module.exports = { validateSeed };
