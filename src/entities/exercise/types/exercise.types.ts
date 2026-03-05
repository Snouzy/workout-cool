// Base exercise type — matches new calisthenics Prisma Exercise model
export interface BaseExercise {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  description: string;
  instructions: string[];
  cues: string[];
  commonMistakes: string[];
  videoUrl: string | null;
  imageUrls: string[];
  difficultyLevel: string;
  measurementType: string;
  defaultSets: number;
  defaultReps: number | null;
  defaultHoldTime: number | null;
  restBetweenSets: number;
  category: string;
  subcategory: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  bandAssistance: boolean;
  bandResistance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** @deprecated Use BaseExercise instead */
export type ExerciseWithAttributes = BaseExercise;

/** @deprecated No longer used with new schema */
export interface ExerciseAttribute {
  id: string;
  exerciseId: string;
  attributeNameId: string;
  attributeValueId: string;
  attributeName: string | { name: string; id: string };
  attributeValue: string | { value: string; id: string };
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
