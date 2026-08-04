import { describe, it, expect } from "vitest";
import { hexToRgba } from "@/lib/color";

describe("hexToRgba", () => {
  it("converts a hex color to rgba with alpha", () => {
    expect(hexToRgba("#F59E0B", 0.5)).toBe("rgba(245, 158, 11, 0.5)");
  });

  it("works without the leading hash", () => {
    expect(hexToRgba("4F46E5", 1)).toBe("rgba(79, 70, 229, 1)");
  });

  it("handles black and white", () => {
    expect(hexToRgba("#000000", 0.25)).toBe("rgba(0, 0, 0, 0.25)");
    expect(hexToRgba("#FFFFFF", 0.1)).toBe("rgba(255, 255, 255, 0.1)");
  });
});
