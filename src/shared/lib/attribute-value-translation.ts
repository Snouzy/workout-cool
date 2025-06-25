import { ExerciseAttributeValueEnum } from "@prisma/client";

import { TFunction } from "locales/client";

/**
 * Map enum values to translation keys for i18n
 */
export const ATTRIBUTE_VALUE_TRANSLATION_KEYS: Record<ExerciseAttributeValueEnum, string> = {
  // exercise types
  BODYWEIGHT: "workout_builder.attribute_value.bodyweight",
  STRENGTH: "workout_builder.attribute_value.strength",
  POWERLIFTING: "workout_builder.attribute_value.powerlifting",
  CALISTHENIC: "workout_builder.attribute_value.calisthenic",
  PLYOMETRICS: "workout_builder.attribute_value.plyometrics",
  STRETCHING: "workout_builder.attribute_value.stretching",
  STRONGMAN: "workout_builder.attribute_value.strongman",
  CARDIO: "workout_builder.attribute_value.cardio",
  STABILIZATION: "workout_builder.attribute_value.stabilization",
  POWER: "workout_builder.attribute_value.power",
  RESISTANCE: "workout_builder.attribute_value.resistance",
  CROSSFIT: "workout_builder.attribute_value.crossfit",
  WEIGHTLIFTING: "workout_builder.attribute_value.weightlifting",

  // muscles
  BICEPS: "workout_builder.muscles.biceps",
  SHOULDERS: "workout_builder.muscles.shoulders",
  CHEST: "workout_builder.muscles.chest",
  BACK: "workout_builder.muscles.back",
  GLUTES: "workout_builder.muscles.glutes",
  TRICEPS: "workout_builder.muscles.triceps",
  HAMSTRINGS: "workout_builder.muscles.hamstrings",
  QUADRICEPS: "workout_builder.muscles.quadriceps",
  FOREARMS: "workout_builder.muscles.forearms",
  CALVES: "workout_builder.muscles.calves",
  TRAPS: "workout_builder.muscles.traps",
  ABDOMINALS: "workout_builder.muscles.abdominals",
  NECK: "workout_builder.attribute_value.neck",
  LATS: "workout_builder.attribute_value.lats",
  ADDUCTORS: "workout_builder.attribute_value.adductors",
  ABDUCTORS: "workout_builder.attribute_value.abductors",
  OBLIQUES: "workout_builder.muscles.obliques",
  GROIN: "workout_builder.attribute_value.groin",
  FULL_BODY: "workout_builder.attribute_value.full_body",
  ROTATOR_CUFF: "workout_builder.attribute_value.rotator_cuff",
  HIP_FLEXOR: "workout_builder.attribute_value.hip_flexor",
  ACHILLES_TENDON: "workout_builder.attribute_value.achilles_tendon",
  FINGERS: "workout_builder.attribute_value.fingers",

  // equipment
  DUMBBELL: "workout_builder.equipment.dumbbell.label",
  KETTLEBELLS: "workout_builder.equipment.kettlebell.label",
  BARBELL: "workout_builder.equipment.barbell.label",
  SMITH_MACHINE: "workout_builder.attribute_value.smith_machine",
  BODY_ONLY: "workout_builder.equipment.bodyweight.label",
  OTHER: "workout_builder.attribute_value.other",
  BANDS: "workout_builder.equipment.band.label",
  EZ_BAR: "workout_builder.attribute_value.ez_bar",
  MACHINE: "workout_builder.attribute_value.machine",
  DESK: "workout_builder.attribute_value.desk",
  PULLUP_BAR: "workout_builder.equipment.pullup_bar.label",
  NONE: "workout_builder.attribute_value.none",
  CABLE: "workout_builder.attribute_value.cable",
  MEDICINE_BALL: "workout_builder.attribute_value.medicine_ball",
  SWISS_BALL: "workout_builder.attribute_value.swiss_ball",
  FOAM_ROLL: "workout_builder.attribute_value.foam_roll",
  WEIGHT_PLATE: "workout_builder.equipment.plate.label",
  TRX: "workout_builder.attribute_value.trx",
  BOX: "workout_builder.attribute_value.box",
  ROPES: "workout_builder.attribute_value.ropes",
  SPIN_BIKE: "workout_builder.attribute_value.spin_bike",
  STEP: "workout_builder.attribute_value.step",
  BOSU: "workout_builder.attribute_value.bosu",
  TYRE: "workout_builder.attribute_value.tyre",
  SANDBAG: "workout_builder.attribute_value.sandbag",
  POLE: "workout_builder.attribute_value.pole",
  BENCH: "workout_builder.equipment.bench.label",
  WALL: "workout_builder.attribute_value.wall",
  BAR: "workout_builder.attribute_value.bar",
  RACK: "workout_builder.attribute_value.rack",
  CAR: "workout_builder.attribute_value.car",
  SLED: "workout_builder.attribute_value.sled",
  CHAIN: "workout_builder.attribute_value.chain",
  SKIERG: "workout_builder.attribute_value.skierg",
  ROPE: "workout_builder.attribute_value.rope",
  NA: "workout_builder.attribute_value.na",

  ISOLATION: "workout_builder.attribute_value.isolation",
  COMPOUND: "workout_builder.attribute_value.compound",
};

/**
 * Get the localized label for an ExerciseAttributeValueEnum
 */
export function getAttributeValueLabel(value: ExerciseAttributeValueEnum, t: TFunction): string {
  const key = ATTRIBUTE_VALUE_TRANSLATION_KEYS[value];
  return key ? t(key as keyof typeof t) : value;
}
