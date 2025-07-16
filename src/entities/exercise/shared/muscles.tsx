import { ExerciseAttributeNameEnum } from "@prisma/client";

import { ExerciseAttribute } from "@/entities/exercise/types/exercise.types";

export const getPrimaryMuscle = (attributes: ExerciseAttribute[]): ExerciseAttribute | undefined => {
  return attributes.find((attr) => {
    if (typeof attr.attributeName === "string") {
      return attr.attributeName === ExerciseAttributeNameEnum.PRIMARY_MUSCLE;
    }

    return attr.attributeName.name === ExerciseAttributeNameEnum.PRIMARY_MUSCLE;
  });
};

export const getSecondaryMuscles = (attributes: ExerciseAttribute[]) => {
  return attributes.filter((attr) => {
    if (typeof attr.attributeName === "string") {
      return attr.attributeName === ExerciseAttributeNameEnum.SECONDARY_MUSCLE;
    } else {
      return attr.attributeName.name === ExerciseAttributeNameEnum.SECONDARY_MUSCLE;
    }
  });
};
