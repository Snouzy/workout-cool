import { StaticImageData } from "next/image";
import { ExerciseAttributeValueEnum, Exercise, ExerciseAttribute, ExerciseAttributeName, ExerciseAttributeValue } from "@prisma/client";

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
export type ExerciseWithAttributes = Exercise & {
  attributes: (ExerciseAttribute & {
    attributeName: ExerciseAttributeName;
    attributeValue: ExerciseAttributeValue;
  })[];
};

export interface ExercisesByMuscle {
  muscle: ExerciseAttributeValueEnum;
  exercises: ExerciseWithAttributes[];
}
