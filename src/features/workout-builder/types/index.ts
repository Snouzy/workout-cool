import { StaticImageData } from "next/image";
import { ExerciseAttributeValueEnum, WorkoutSet } from "@prisma/client";

import { ExerciseWithAttributes } from "@/entities/exercise/types/exercise.types";

// Re-export the type for consistency
export type { ExerciseWithAttributes };

export interface WorkoutBuilderState {
  currentStep: number;
  selectedEquipment: ExerciseAttributeValueEnum[];
  selectedMuscles: ExerciseAttributeValueEnum[];
  selectedExercises: string[];
}

export type WorkoutBuilderStep = 1 | 2 | 3;

export interface StepperStepProps {
  stepNumber: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
}

export interface EquipmentItem {
  value: ExerciseAttributeValueEnum;
  label: string;
  icon: StaticImageData;
  description?: string;
  className?: string;
}

// Types pour les exercices avec leurs attributs
export type WorkoutBuilderExerciseWithAttributes = ExerciseWithAttributes & {
  order: number;
};

export type ExerciseWithAttributesAndSets = ExerciseWithAttributes & {
  sets: WorkoutSet[];
};

export interface ExercisesByMuscle {
  muscle: ExerciseAttributeValueEnum;
  exercises: ExerciseWithAttributes[];
}
