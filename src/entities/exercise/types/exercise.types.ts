import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum } from "@prisma/client";

// import { I18nName, I18nField } from "@/shared/types/i18n.types";

// Base exercise type
export interface BaseExercise {
  id: string;
  fullVideoUrl?: string | null;
  fullVideoImageUrl?: string | null;
  introduction: string | null;
  introductionEn: string | null;
  name: string;
  nameEn: string | null;
  description: string;
  descriptionEn: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseAttribute {
  id: string;
  exerciseId: string;
  attributeNameId: string;
  attributeValueId: string;
  attributeName: ExerciseAttributeNameEnum | { name: ExerciseAttributeNameEnum; id: string };
  attributeValue: ExerciseAttributeValueEnum | { value: ExerciseAttributeValueEnum; id: string };
}

// Exercise with attributes
export interface ExerciseWithAttributes extends BaseExercise {
  attributes: ExerciseAttribute[];
}

// Suggested set for program exercises
export interface SuggestedSet {
  id: string;
  programExerciseId: string;
  setIndex: number;
  types: string[];
  valuesInt: number[];
  valuesSec: number[];
  units: string[];
}
