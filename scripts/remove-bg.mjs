// ============================================================================
// Remove Background from Logo & Icon
// Detects the background color from image corners and makes it transparent.
// ============================================================================

import sharp from "sharp";
import { copyFileSync, unlinkSync } from "fs";

const THRESHOLD = 40;

function matchColor(r, g, b, target, threshold) {
  return (
    Math.abs(r - target[0]) <= threshold &&
    Math.abs(g - target[1]) <= threshold &&
    Math.abs(b - target[2]) <= threshold
  );
}

async function detectBgColor(inputPath) {
  const metadata = await sharp(inputPath).metadata();
  const w = metadata.width;
  const h = metadata.height;

  const cornerRegions = [
    { left: 0, top: 0, width: 1, height: 1 },
    { left: w - 1, top: 0, width: 1, height: 1 },
    { left: 0, top: h - 1, width: 1, height: 1 },
    { left: w - 1, top: h - 1, width: 1, height: 1 },
  ];

  const counts = new Map();

  for (const region of cornerRegions) {
    try {
      const buf = await sharp(inputPath).extract(region).raw().toBuffer();
      const key = `${buf[0]},${buf[1]},${buf[2]}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    } catch {
      // ignore
    }
  }

  let best = [255, 255, 255];
  let bestCount = 0;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      const [r, g, b] = key.split(",").map(Number);
      best = [r, g, b];
    }
  }

  console.log(`  Background color: rgb(${best.join(",")})`);
  return best;
}

async function removeBackground(inputPath, outputPath, threshold = THRESHOLD) {
  console.log(`\nProcessing: ${inputPath}`);
  const metadata = await sharp(inputPath).metadata();
  console.log(`  Size: ${metadata.width}x${metadata.height}, ${metadata.format}`);

  const bgColor = await detectBgColor(inputPath);

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelData = Buffer.from(data);
  let transparentPixels = 0;

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];

    if (matchColor(r, g, b, bgColor, threshold)) {
      pixelData[i + 3] = 0;
      transparentPixels++;
    }
  }

  const total = info.width * info.height;
  console.log(`  Transparent: ${transparentPixels}/${total} pixels (${((transparentPixels / total) * 100).toFixed(1)}%)`);

  await sharp(pixelData, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outputPath);

  console.log(`  ✓ Saved: ${outputPath}`);
}

async function main() {
  // 1. Logo — write to temp then replace original
  console.log("\n--- Logo ---");
  await removeBackground("public/stratifit-logo.png", "public/stratifit-logo-temp.png");
  copyFileSync("public/stratifit-logo-temp.png", "public/stratifit-logo.png");
  unlinkSync("public/stratifit-logo-temp.png");
  console.log("  ✓ Replaced original: public/stratifit-logo.png");

  // 2. Icon — convert JPG to PNG with transparency
  console.log("\n--- Icon ---");
  await removeBackground("src/app/icon.jpg", "src/app/icon.png");
  unlinkSync("src/app/icon.jpg");
  console.log("  ✓ Created: src/app/icon.png");
  console.log("  ✓ Removed old: src/app/icon.jpg");

  console.log("\n✅ Done! Both images now have transparent backgrounds.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
