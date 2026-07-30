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
export const WATER_ML_OPTIONS = [1, 2, 3, 5];
export const DOSE_MCG_OPTIONS = [50, 100, 250, 500];
export const UNITS_OPTIONS = [5, 10, 25, 50];

export const DEFAULT_INPUT = {
  vialMg: 10,
  waterMl: 5,
  doseMcg: 250,
  syringeCapacity: 50 as SyringeCapacity,
};
