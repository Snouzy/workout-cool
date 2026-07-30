import { PeptideInput, PeptideResult, ReverseInput, WarningCode } from "./types";

export const UNITS_PER_ML = 100;

const MAX_VIAL_MG = 1000;
const MAX_WATER_ML = 100;
const MAX_DOSE_MCG = 100_000;
/**
 * Deliberately well above the 100-unit barrel: a draw that overflows the selected syringe is
 * a warning the result block renders in red, never a reason to stop answering. This ceiling
 * only rejects nonsense.
 */
const MAX_UNITS = 1000;
const MIN_MEASURABLE_UNITS = 2;
const TYPICAL_MAX_WATER_ML = 10;
const EPSILON = 1e-9;

function isPositiveFinite(value: number, max: number): boolean {
  return Number.isFinite(value) && value > 0 && value <= max;
}

function isWholeGraduation(units: number): boolean {
  return Math.abs(units * 2 - Math.round(units * 2)) < EPSILON;
}

export function calculatePeptideDose(input: PeptideInput): PeptideResult | null {
  const { vialMg, waterMl, doseMcg, syringeCapacity } = input;

  if (!isPositiveFinite(vialMg, MAX_VIAL_MG)) return null;
  if (!isPositiveFinite(waterMl, MAX_WATER_ML)) return null;
  if (!isPositiveFinite(doseMcg, MAX_DOSE_MCG)) return null;

  const concentrationMgPerMl = vialMg / waterMl;
  const volumeMl = doseMcg / 1000 / concentrationMgPerMl;
  const units = volumeMl * UNITS_PER_ML;
  const dosesPerVial = Math.floor((vialMg * 1000) / doseMcg);

  const warnings: WarningCode[] = [];

  if (units > syringeCapacity) warnings.push("EXCEEDS_SYRINGE");
  if (units < MIN_MEASURABLE_UNITS) warnings.push("TOO_SMALL_TO_MEASURE");
  if (waterMl > TYPICAL_MAX_WATER_ML) warnings.push("WATER_EXCEEDS_VIAL");
  if (!isWholeGraduation(units)) warnings.push("NOT_A_WHOLE_GRADUATION");

  return { concentrationMgPerMl, volumeMl, units, dosesPerVial, warnings };
}

export function calculateDoseFromUnits(input: ReverseInput): number | null {
  const { vialMg, waterMl, units } = input;

  if (!isPositiveFinite(vialMg, MAX_VIAL_MG)) return null;
  if (!isPositiveFinite(waterMl, MAX_WATER_ML)) return null;
  if (!isPositiveFinite(units, MAX_UNITS)) return null;

  const concentrationMgPerMl = vialMg / waterMl;

  return (units / UNITS_PER_ML) * concentrationMgPerMl * 1000;
}
