import { describe, expect, it } from "vitest";

import { SYRINGE_OPTIONS } from "./presets";

describe("SYRINGE_OPTIONS", () => {
  it("expose trois seringues U-100 standard", () => {
    expect(SYRINGE_OPTIONS.map((option) => option.capacity)).toEqual([30, 50, 100]);
  });

  it("associe chaque capacité au volume qu'elle représente sur une échelle U-100", () => {
    // 1 mL = 100 unités, donc la capacité en unités vaut cent fois le volume en mL.
    for (const option of SYRINGE_OPTIONS) {
      expect(option.volumeMl * 100).toBeCloseTo(option.capacity, 10);
    }
  });

  it("pointe chaque seringue vers son propre visuel", () => {
    const images = SYRINGE_OPTIONS.map((option) => option.image);

    expect(new Set(images).size).toBe(images.length);

    for (const option of SYRINGE_OPTIONS) {
      expect(option.image).toBe(`/images/syringes/syringe-${option.capacity}-units.png`);
    }
  });
});
