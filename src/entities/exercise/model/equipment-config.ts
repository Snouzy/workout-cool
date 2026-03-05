import { StaticImageData } from "next/image";

import PullupBar from "@public/images/equipment/pull-up-bar.png";
import Plate from "@public/images/equipment/plate.png";
import Kettlebell from "@public/images/equipment/kettlebell.png";
import Dumbbell from "@public/images/equipment/dumbbell.png";
import Bodyweight from "@public/images/equipment/bodyweight.png";
import Bench from "@public/images/equipment/bench.png";
import Barbell from "@public/images/equipment/barbell.png";
import Band from "@public/images/equipment/band.png";

export interface EquipmentItem {
  value: string;
  label: string;
  icon: StaticImageData;
  description?: string;
  className?: string;
}

export const EQUIPMENT_CONFIG: EquipmentItem[] = [
  {
    value: "BODY_ONLY",
    label: "Bodyweight",
    icon: Bodyweight,
    description: "Exercises using only your body weight",
    className: "h-12 w-12",
  },
  {
    value: "DUMBBELL",
    label: "Dumbbell",
    icon: Dumbbell,
    description: "Free weight exercises with dumbbells",
    className: "h-12 w-12",
  },
  {
    value: "BARBELL",
    label: "Barbell",
    icon: Barbell,
    description: "Compound movements with a barbell",
    className: "h-12 w-12",
  },
  {
    value: "KETTLEBELLS",
    label: "Kettlebell",
    icon: Kettlebell,
    description: "Dynamic exercises with kettlebells",
    className: "h-12 w-12",
  },
  {
    value: "BANDS",
    label: "Band",
    icon: Band,
    description: "Resistance band exercises",
    className: "h-12 w-12",
  },
  {
    value: "WEIGHT_PLATE",
    label: "Plate",
    icon: Plate,
    description: "Exercises using weight plates",
    className: "h-12 w-12",
  },
  {
    value: "PULLUP_BAR",
    label: "Pull-up bar",
    icon: PullupBar,
    description: "Upper body exercises with a pull-up bar",
    className: "h-12 w-12",
  },
  {
    value: "BENCH",
    label: "Bench",
    icon: Bench,
    description: "Bench exercises and support",
    className: "h-12 w-12",
  },
];

export function getEquipmentByValue(value: string): EquipmentItem | undefined {
  return EQUIPMENT_CONFIG.find((equipment) => equipment.value === value);
}

export function getEquipmentLabel(value: string): string {
  return getEquipmentByValue(value)?.label || value;
}
