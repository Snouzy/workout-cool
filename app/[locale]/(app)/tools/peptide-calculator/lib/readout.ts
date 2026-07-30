import { PeptideInput, WarningCode } from "./types";
import { calculateDoseFromUnits, calculatePeptideDose, UNITS_PER_ML } from "./calculate";

/** Absorbs the float noise of `units * 100 / 100` so an exact 50 on a 50-unit syringe is not "over". */
const EPSILON = 1e-3;

export type CalculatorMode = "forward" | "reverse";

/**
 * Everything the result block shows, whichever direction the calculation ran in.
 *
 * Both modes describe the same vial, so they collapse into one shape here rather than into
 * two result components: only the headline differs downstream (units drawn vs dose obtained).
 */
export interface Readout {
  concentrationMgPerMl: number;
  doseMcg: number;
  volumeMl: number;
  units: number;
  dosesPerVial: number;
  /** The draw does not fit the selected syringe. Never blocks input — it colours the answer. */
  over: boolean;
  warnings: WarningCode[];
}

export function buildReadout(mode: CalculatorMode, input: PeptideInput, drawnUnits: number): Readout | null {
  if (mode === "forward") {
    const result = calculatePeptideDose(input);
    if (result === null) return null;

    return {
      concentrationMgPerMl: result.concentrationMgPerMl,
      doseMcg: input.doseMcg,
      volumeMl: result.volumeMl,
      units: result.units,
      dosesPerVial: result.dosesPerVial,
      over: result.units > input.syringeCapacity + EPSILON,
      warnings: result.warnings,
    };
  }

  const doseMcg = calculateDoseFromUnits({ vialMg: input.vialMg, waterMl: input.waterMl, units: drawnUnits });
  if (doseMcg === null) return null;

  return {
    concentrationMgPerMl: input.vialMg / input.waterMl,
    doseMcg,
    volumeMl: drawnUnits / UNITS_PER_ML,
    units: drawnUnits,
    dosesPerVial: Math.floor((input.vialMg * 1000) / doseMcg),
    over: drawnUnits > input.syringeCapacity + EPSILON,
    warnings: [],
  };
}
