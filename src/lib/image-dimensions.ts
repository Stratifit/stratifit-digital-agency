"use client";

export interface ImageSize {
  width: number;
  height: number;
}

export interface AspectTarget {
  width: number;
  height: number;
}

/**
 * Reads the intrinsic pixel size of an uploaded image file.
 * Returns null for SVG (no intrinsic raster size) or unreadable files.
 */
export async function readImageSize(file: File): Promise<ImageSize | null> {
  if (file.type === "image/svg+xml") return null;
  try {
    if (typeof createImageBitmap === "function") {
      const bitmap = await createImageBitmap(file);
      const size: ImageSize = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return size;
    }
  } catch {
    // Fall through to the <img> decoder.
  }
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

/** Reduces a pixel ratio to its lowest terms, e.g. 1600×1200 → "4:3". */
export function formatAspect(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * True when the image ratio is within `tolerance` (default 3%) of the target
 * ratio — close enough that object-cover cropping is imperceptible.
 */
export function aspectMatches(
  size: ImageSize,
  target: AspectTarget,
  tolerance = 0.03
): boolean {
  const actual = size.width / size.height;
  const expected = target.width / target.height;
  return Math.abs(actual - expected) / expected <= tolerance;
}

/** Human-readable recommended size label, e.g. "1600 × 1200 px (4:3)". */
export function recommendedSizeLabel(
  width: number,
  height: number
): string {
  return `${width} × ${height} px (${formatAspect(width, height)})`;
}