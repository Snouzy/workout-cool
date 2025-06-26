import { ExerciseAttributeValueEnum } from "@prisma/client";

import { I18nText, I18nSlug, I18nField } from "@/shared/types/i18n.types";
import { ExerciseWithAttributes, SuggestedSet } from "@/entities/exercise/types/exercise.types";

// Base session type
export interface BaseProgramSession extends I18nText, I18nSlug {
  id: string;
  weekId: string;
  sessionNumber: number;
  equipment: ExerciseAttributeValueEnum[];
  estimatedMinutes: number;
  isPremium: boolean;
}

// Program week type
export interface ProgramWeek extends I18nText {
  id: string;
  programId: string;
  weekNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

// Program exercise (exercise in the context of a program session)
export interface ProgramExercise extends I18nField<"instructions"> {
  id: string;
  sessionId: string;
  exerciseId: string;
  order: number;
  exercise: ExerciseWithAttributes;
  suggestedSets: SuggestedSet[];
}

// Session with exercises
export interface ProgramSessionWithExercises extends BaseProgramSession {
  exercises: ProgramExercise[];
}
