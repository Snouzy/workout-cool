import { ExerciseAttributeValueEnum } from "@prisma/client";

import { TFunction } from "locales/client";

export const allEquipmentValues = [
  ExerciseAttributeValueEnum.BODY_ONLY,
  ExerciseAttributeValueEnum.DUMBBELL,
  ExerciseAttributeValueEnum.BARBELL,
  ExerciseAttributeValueEnum.KETTLEBELLS,
  ExerciseAttributeValueEnum.BANDS,
];

export const getEquipmentTranslation = (value: ExerciseAttributeValueEnum, t: TFunction) => {
  const equipmentKeys: Partial<Record<ExerciseAttributeValueEnum, string>> = {
    [ExerciseAttributeValueEnum.BODY_ONLY]: "bodyweight",
    [ExerciseAttributeValueEnum.DUMBBELL]: "dumbbell",
    [ExerciseAttributeValueEnum.BARBELL]: "barbell",
    [ExerciseAttributeValueEnum.KETTLEBELLS]: "kettlebell",
    [ExerciseAttributeValueEnum.BANDS]: "band",
    [ExerciseAttributeValueEnum.WEIGHT_PLATE]: "plate",
    [ExerciseAttributeValueEnum.PULLUP_BAR]: "pullup_bar",
    [ExerciseAttributeValueEnum.BENCH]: "bench",
  };

  const key = equipmentKeys[value];
  return {
    label: t(`workout_builder.equipment.${key}.label` as keyof typeof t),
    description: t(`workout_builder.equipment.${key}.description` as keyof typeof t),
  };
};
