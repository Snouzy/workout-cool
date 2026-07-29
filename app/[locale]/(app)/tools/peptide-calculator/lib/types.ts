export type SyringeCapacity = 30 | 50 | 100;

export type WarningCode = "EXCEEDS_SYRINGE" | "TOO_SMALL_TO_MEASURE" | "WATER_EXCEEDS_VIAL" | "NOT_A_WHOLE_GRADUATION";

export interface PeptideInput {
  vialMg: number;
  waterMl: number;
  doseMcg: number;
  syringeCapacity: SyringeCapacity;
}

export interface ReverseInput {
  vialMg: number;
  waterMl: number;
  units: number;
}

export interface PeptideResult {
  concentrationMgPerMl: number;
  volumeMl: number;
  units: number;
  dosesPerVial: number;
  warnings: WarningCode[];
}
