import { describe, expect, it } from "vitest";

import { calculateDoseFromUnits, calculatePeptideDose } from "./calculate";

const BASE = { vialMg: 10, waterMl: 5, doseMcg: 250, syringeCapacity: 50 } as const;

describe("calculatePeptideDose", () => {
  it("reproduit l'exemple de référence : 10 mg / 5 ml / 250 mcg", () => {
    const result = calculatePeptideDose(BASE);

    expect(result).not.toBeNull();
    expect(result!.concentrationMgPerMl).toBe(2);
    expect(result!.volumeMl).toBeCloseTo(0.125, 10);
    expect(result!.units).toBeCloseTo(12.5, 10);
    expect(result!.dosesPerVial).toBe(40);
    expect(result!.warnings).toEqual([]);
  });

  it("signale EXCEEDS_SYRINGE quand la dose dépasse la seringue", () => {
    const result = calculatePeptideDose({ vialMg: 5, waterMl: 1, doseMcg: 3000, syringeCapacity: 50 });

    expect(result!.units).toBeCloseTo(60, 10);
    expect(result!.warnings).toContain("EXCEEDS_SYRINGE");
  });

  it("signale TOO_SMALL_TO_MEASURE sous 2 graduations", () => {
    const result = calculatePeptideDose({ vialMg: 10, waterMl: 1, doseMcg: 100, syringeCapacity: 50 });

    expect(result!.units).toBeCloseTo(1, 10);
    expect(result!.warnings).toContain("TOO_SMALL_TO_MEASURE");
  });

  it("signale WATER_EXCEEDS_VIAL au-delà de 10 ml", () => {
    const result = calculatePeptideDose({ vialMg: 10, waterMl: 15, doseMcg: 250, syringeCapacity: 50 });

    expect(result!.warnings).toContain("WATER_EXCEEDS_VIAL");
  });

  it("signale NOT_A_WHOLE_GRADUATION hors multiples de 0,5", () => {
    const result = calculatePeptideDose({ vialMg: 10, waterMl: 5, doseMcg: 246, syringeCapacity: 50 });

    expect(result!.units).toBeCloseTo(12.3, 10);
    expect(result!.warnings).toContain("NOT_A_WHOLE_GRADUATION");
  });

  it("ne signale pas NOT_A_WHOLE_GRADUATION sur un demi-multiple", () => {
    expect(calculatePeptideDose(BASE)!.warnings).not.toContain("NOT_A_WHOLE_GRADUATION");
  });

  it("rend null sur entrée invalide", () => {
    expect(calculatePeptideDose({ ...BASE, vialMg: 0 })).toBeNull();
    expect(calculatePeptideDose({ ...BASE, waterMl: -1 })).toBeNull();
    expect(calculatePeptideDose({ ...BASE, doseMcg: Number.NaN })).toBeNull();
    expect(calculatePeptideDose({ ...BASE, vialMg: 5000 })).toBeNull();
  });
});

describe("calculateDoseFromUnits", () => {
  it("est l'inverse exact de calculatePeptideDose", () => {
    const forward = calculatePeptideDose(BASE)!;
    const back = calculateDoseFromUnits({ vialMg: BASE.vialMg, waterMl: BASE.waterMl, units: forward.units });

    expect(back).toBeCloseTo(BASE.doseMcg, 10);
  });

  it("répond encore au-delà de la plus grande seringue", () => {
    // Un prélèvement qui déborde est un avertissement affiché en rouge, pas une entrée refusée.
    expect(calculateDoseFromUnits({ vialMg: 5, waterMl: 10, units: 150 })).toBeCloseTo(750, 10);
  });

  it("rend null sur entrée invalide", () => {
    expect(calculateDoseFromUnits({ vialMg: 10, waterMl: 5, units: 0 })).toBeNull();
    expect(calculateDoseFromUnits({ vialMg: 0, waterMl: 5, units: 10 })).toBeNull();
  });
});
