import { ExerciseAttributeNameEnum } from "@prisma/client";

import { ExerciseAttribute, ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

export const getAttributeName = (attr: ExerciseAttribute) => {
  return typeof attr.attributeName === "string" ? attr.attributeName : attr.attributeName.name;
};

export const getAttributeValue = (attr: ExerciseAttribute) => {
  return typeof attr.attributeValue === "string" ? attr.attributeValue : attr.attributeValue.value;
};

const getAttributesByName = (attributes: ExerciseAttribute[], name: ExerciseAttributeNameEnum) => {
  return attributes.filter((attr) => getAttributeName(attr) === name);
};

export const getPrimaryMuscle = (attributes: ExerciseAttribute[]): ExerciseAttribute | undefined => {
  return getAttributesByName(attributes, ExerciseAttributeNameEnum.PRIMARY_MUSCLE)[0];
};

export const getSecondaryMuscles = (attributes: ExerciseAttribute[]) => {
  return getAttributesByName(attributes, ExerciseAttributeNameEnum.SECONDARY_MUSCLE);
};

export const getExerciseAttributesValueOf = (exercise: ExerciseWithAttributes, name: ExerciseAttributeNameEnum) => {
  return getAttributesByName(exercise.attributes, name).map(getAttributeValue);
};
