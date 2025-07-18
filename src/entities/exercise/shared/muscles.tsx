import { ExerciseAttributeNameEnum } from "@prisma/client";

import { ExerciseAttribute, ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

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

export const getExerciseAttributesValueOf = (exercise: ExerciseWithAttributes, name: ExerciseAttributeNameEnum) => {
  const base = exercise.attributes.filter((a) => {
    if (typeof a.attributeName === "string") {
      return a.attributeName === name;
    }

    return a.attributeName.name === name;
  });

  let result = null;

  if (base.length > 0) {
    result = base.map((a) => {
      if (typeof a.attributeValue === "string") {
        return a.attributeValue;
      }

      return a.attributeValue.value;
    });
  }

  return result || [];
};
