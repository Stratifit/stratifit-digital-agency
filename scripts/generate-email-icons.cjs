/**
 * Renders the footer social icons (from `src/components/ui/social-icons.tsx`)
 * as amber PNGs (brand primary #F59E0B, matching the site footer) into
 * `public/email-icons/`.
 *
 * Email clients (notably Gmail) strip inline <svg> from email HTML, so the
 * email footer renders the same icons as <img> tags instead. Run after
 * changing an icon in social-icons.tsx:
 *
 *   node scripts/generate-email-icons.cjs
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "src/components/ui/social-icons.tsx");
const OUT_DIR = path.join(ROOT, "public/email-icons");

const source = fs.readFileSync(SOURCE, "utf8");

const iconRe =
  /key: "([^"]+)",\s*label: "([^"]+)",\s*viewBox: "([^"]+)",\s*path: "([^"]+)"/g;

const icons = [];
let match;
while ((match = iconRe.exec(source)) !== null) {
  const [, key, label, viewBox, pathData] = match;
  icons.push({ key, label, viewBox, path: pathData });
}

if (icons.length === 0) {
  console.error(`No icons parsed from ${SOURCE}`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const AMBER = "#F59E0B";

for (const icon of icons) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.viewBox}" width="64" height="64"><path fill="${AMBER}" d="${icon.path}"/></svg>`;
  const outFile = path.join(OUT_DIR, `${icon.key}.png`);
  sharp(Buffer.from(svg))
    .png()
    .toFile(outFile)
    .then((info) => {
      console.log(`✓ ${icon.key}.png (${info.width}x${info.height})`);
    })
    .catch((err) => {
      console.error(`✗ ${icon.key}.png: ${err.message}`);
      process.exitCode = 1;
    });
}
