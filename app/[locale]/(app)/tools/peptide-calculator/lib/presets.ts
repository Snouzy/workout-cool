import { SyringeCapacity } from "./types";

export interface SyringeOption {
  capacity: SyringeCapacity;
  volumeMl: number;
  image: string;
}

export const SYRINGE_OPTIONS: SyringeOption[] = [
  { capacity: 30, volumeMl: 0.3, image: "/images/syringes/syringe-30-units.png" },
  { capacity: 50, volumeMl: 0.5, image: "/images/syringes/syringe-50-units.png" },
  { capacity: 100, volumeMl: 1, image: "/images/syringes/syringe-100-units.png" },
];

export const VIAL_MG_OPTIONS = [5, 10, 20, 50, 100];
export const WATER_ML_OPTIONS = [1, 2, 3, 5, 10];

/** Dose presets, one list per display unit. The stored dose stays in micrograms either way. */
export const DOSE_MCG_OPTIONS = [50, 100, 250, 500, 750];
export const DOSE_MG_OPTIONS = [1, 2, 2.5, 5, 8];

/** Step of the free-entry field, per quantity: small enough to be useful, coarse enough to be quick. */
export const STEP_VIAL_MG = 1;
export const STEP_WATER_ML = 0.5;
export const STEP_DOSE_MCG = 10;
export const STEP_DOSE_MG = 0.1;
export const STEP_UNITS = 0.5;

export const DEFAULT_INPUT = {
  vialMg: 10,
  waterMl: 5,
  doseMcg: 250,
  syringeCapacity: 50 as SyringeCapacity,
};
