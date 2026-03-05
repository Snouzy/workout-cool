import { TFunction } from "locales/client";

export const allEquipmentValues = [
  "BODY_ONLY",
  "DUMBBELL",
  "BARBELL",
  "KETTLEBELLS",
  "BANDS",
];

export const getEquipmentTranslation = (value: string, t: TFunction) => {
  const equipmentKeys: Record<string, string> = {
    BODY_ONLY: "bodyweight",
    DUMBBELL: "dumbbell",
    BARBELL: "barbell",
    KETTLEBELLS: "kettlebell",
    BANDS: "band",
    WEIGHT_PLATE: "plate",
    PULLUP_BAR: "pullup_bar",
    BENCH: "bench",
  };

  const key = equipmentKeys[value];
  return {
    label: t(`workout_builder.equipment.${key}.label` as keyof typeof t),
    description: t(`workout_builder.equipment.${key}.description` as keyof typeof t),
  };
};
