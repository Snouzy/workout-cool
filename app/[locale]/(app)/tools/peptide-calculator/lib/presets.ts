import { SyringeCapacity } from "./types";

export interface PeptidePreset {
  id: string;
  label: string;
  vialSizesMg: number[];
}

export interface SyringeOption {
  capacity: SyringeCapacity;
  volumeMl: number;
  image: string;
}

/**
 * Tailles de flacon couramment vendues. Donnée d'étiquette factuelle :
 * un preset ne pré-remplit jamais une dose.
 */
export const PEPTIDE_PRESETS: PeptidePreset[] = [
  { id: "bpc-157", label: "BPC-157", vialSizesMg: [5, 10] },
  { id: "tb-500", label: "TB-500", vialSizesMg: [5, 10] },
  { id: "ipamorelin", label: "Ipamorelin", vialSizesMg: [5, 10] },
  { id: "cjc-1295", label: "CJC-1295", vialSizesMg: [2, 5] },
  { id: "tirzepatide", label: "Tirzepatide", vialSizesMg: [10, 20, 30, 60] },
  { id: "retatrutide", label: "Retatrutide", vialSizesMg: [10, 20] },
  { id: "semaglutide", label: "Semaglutide", vialSizesMg: [5, 10] },
  { id: "ghk-cu", label: "GHK-Cu", vialSizesMg: [50, 100] },
];

export const SYRINGE_OPTIONS: SyringeOption[] = [
  { capacity: 30, volumeMl: 0.3, image: "/images/syringes/syringe-30-units.png" },
  { capacity: 50, volumeMl: 0.5, image: "/images/syringes/syringe-50-units.png" },
  { capacity: 100, volumeMl: 1, image: "/images/syringes/syringe-100-units.png" },
];

export const VIAL_MG_OPTIONS = [5, 10, 20, 50, 100];
export const WATER_ML_OPTIONS = [1, 2, 3, 5];
export const DOSE_MCG_OPTIONS = [50, 100, 250, 500];

export const DEFAULT_INPUT = {
  vialMg: 10,
  waterMl: 5,
  doseMcg: 250,
  syringeCapacity: 50 as SyringeCapacity,
};
