import { describe, expect, it } from "vitest";

import { PEPTIDE_PRESETS, SYRINGE_OPTIONS } from "./presets";

describe("PEPTIDE_PRESETS", () => {
  it("expose des identifiants uniques", () => {
    const ids = PEPTIDE_PRESETS.map((preset) => preset.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("n'expose que des tailles de flacon positives et finies", () => {
    for (const preset of PEPTIDE_PRESETS) {
      expect(preset.vialSizesMg.length).toBeGreaterThan(0);

      for (const size of preset.vialSizesMg) {
        expect(Number.isFinite(size)).toBe(true);
        expect(size).toBeGreaterThan(0);
      }
    }
  });

  it("expose trois seringues U-100 standard", () => {
    expect(SYRINGE_OPTIONS.map((option) => option.capacity)).toEqual([30, 50, 100]);
  });
});
