import {
  Exercise,
  ExerciseAttribute,
  ExerciseAttributeName,
  ExerciseAttributeValue
} from "@prisma/client";

export type ExerciseWithAttributes = Exercise & {
  attributes: (ExerciseAttribute & {
    attributeName: ExerciseAttributeName;
    attributeValue: ExerciseAttributeValue;
  })[];
};


export type ExerciseWithStats = Exercise & {
  attributes: (ExerciseAttribute & {
    attributeName: ExerciseAttributeName;
    attributeValue: ExerciseAttributeValue;
  })[];
  totalProgramUsage: number;
  totalWorkoutUsage: number;
  totalFavorites: number;
  _count: {
    ProgramSessionExercise: number;
    WorkoutSessionExercise: number;
    favoritesByUsers: number;
  };
};

export type CreateExerciseData = {
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  fullVideoUrl?: string;
  fullVideoImageUrl?: string;
  introduction?: string;
  introductionEn?: string;
  attributeIds: string[];
};

export type UpdateExerciseData = Partial<CreateExerciseData> & {
  id: string;
};