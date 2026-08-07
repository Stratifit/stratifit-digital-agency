/**
 * Validates that every JSONB literal in migration 00040_detail_page_redesign.sql
 * is well-formed JSON, and prints the block-type composition per page.
 *
 * Run: node scripts/validate-detail-page-json.cjs
 */
const fs = require("fs");
const path = require("path");

const migrationPath = path.join(
  __dirname,
  "..",
  "supabase",
  "migrations",
  "00040_detail_page_redesign.sql"
);
const text = fs.readFileSync(migrationPath, "utf8");

const re = /UPDATE public\.detail_pages([\s\S]*?)WHERE slug = '([a-z-]+)';/g;
let m;
let totalBad = 0;
let pages = 0;

while ((m = re.exec(text)) !== null) {
  const slug = m[2];
  const block = m[1];

  const setRe = /^SET ([a-z_]+) = /m;
  const sm = setRe.exec(block);
  if (!sm) throw new Error(`No SET line for ${slug}`);

  const matches = [{ key: sm[1], vs: sm.index + sm[0].length, sl: 0 }];
  const ar = /(\n    )([a-z_]+) = /g;
  let mm;
  while ((mm = ar.exec(block)) !== null) {
    matches.push({ key: mm[2], vs: ar.lastIndex, sl: mm[0].length });
  }

  let errors = [];
  let contentBlocks = null;
  for (let i = 0; i < matches.length; i++) {
    const key = matches[i].key;
    const vStart = matches[i].vs;
    const vEnd =
      i + 1 < matches.length ? matches[i + 1].vs - matches[i + 1].sl : block.length;
    let value = block.slice(vStart, vEnd).trim().replace(/,\s*$/, "");
    value = value.replace(/^'([\s\S]*?)'::jsonb$/, (_, inner) => inner);
    try {
      const parsed = JSON.parse(value);
      if (key === "content_translations") {
        contentBlocks = parsed.map((b) => b.type);
      }
    } catch (e) {
      errors.push(`${key}: ${e.message}`);
    }
  }

  pages++;
  totalBad += errors.length;
  if (errors.length) {
    console.log(`✗ ${slug}:`);
    errors.forEach((e) => console.log(`    ${e}`));
  } else {
    const counts = (contentBlocks || []).reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    console.log(
      `✓ ${slug}: ${Object.entries(counts)
        .map(([t, c]) => `${t}×${c}`)
        .join(", ")}`
    );
  }
}

console.log(`\nPages checked: ${pages}, JSON errors: ${totalBad}`);
process.exit(totalBad > 0 ? 1 : 0);
