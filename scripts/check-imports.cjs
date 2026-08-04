// Verifies that every import (relative "./x" and "@/" alias) resolves to a real
// file with EXACT case. Catches case-sensitivity bugs that pass on Windows but
// fail on Linux (Vercel / GitHub Actions).
//
// Note: this mirrors the tsconfig `paths` mapping "@/*" -> "./src/*".
// If tsconfig paths change, update ALIAS_BASE below.
// Only `from "..."` imports are checked (not bare `import "..."` or dynamic
// `import("...")`), which covers this codebase today.
const fs = require("fs");
const path = require("path");

const ALIAS_BASE = "src";
const IGNORED_DIRS = new Set(["node_modules", ".next", ".git", ".vercel", ".opencode"]);
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs"];

const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!IGNORED_DIRS.has(e.name)) walk(p);
    } else if (EXTENSIONS.some((ext) => e.name.endsWith(ext))) {
      files.push(p);
    }
  }
}
walk("src");

const byLower = new Map();
for (const f of files) byLower.set(f.toLowerCase(), f);

const bad = [];
const re = /from\s+["']([^"']+)["']/g;

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(src))) {
    const spec = m[1];
    if (spec.includes("?")) continue;
    const base = spec.startsWith("@/")
      ? path.resolve(ALIAS_BASE, spec.replace(/^@\//, ""))
      : spec.startsWith(".")
        ? path.resolve(path.dirname(f), spec)
        : null;
    if (!base) continue; // bare package import (e.g. "react", "gsap")
    const variants = [
      base,
      ...EXTENSIONS.map((ext) => base + ext),
      ...EXTENSIONS.map((ext) => path.join(base, "index" + ext)),
    ];
    const rel = variants.map((v) => path.relative(process.cwd(), v));
    const hit = rel.find((v) => byLower.has(v.toLowerCase()));
    if (!hit) {
      bad.push(`${f.replace(/\\/g, "/")} -> ${spec} (NO FILE FOUND)`);
    } else {
      const actual = byLower.get(hit.toLowerCase());
      if (actual !== hit) {
        bad.push(
          `${f.replace(/\\/g, "/")} -> CASE MISMATCH "${spec}" (actual file: ${actual.replace(/\\/g, "/")})`
        );
      }
    }
  }
}

if (bad.length) {
  console.log(bad.length + " problem(s):");
  console.log(bad.join("\n"));
  process.exit(1);
} else {
  console.log("OK: all imports (relative and @/ alias) resolve with exact case");
}
