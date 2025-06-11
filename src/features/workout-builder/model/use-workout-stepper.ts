"use client";

import { useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsArrayOf, parseAsString } from "nuqs";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { WorkoutBuilderStep } from "../types";
import { useExercises } from "./use-exercises";

export function useWorkoutStepper() {
  // État persistant dans l'URL avec nuqs
  const [currentStep, setCurrentStep] = useQueryState("step", parseAsInteger.withDefault(1));

  const [selectedEquipment, setSelectedEquipment] = useQueryState("equipment", parseAsArrayOf(parseAsString).withDefault([]));

  const [selectedMuscles, setSelectedMuscles] = useQueryState("muscles", parseAsArrayOf(parseAsString).withDefault([]));

  // Récupération des exercices
  const {
    data: exercisesByMuscle = [],
    isLoading: isLoadingExercises,
    error: exercisesError,
  } = useExercises({
    equipment: selectedEquipment as ExerciseAttributeValueEnum[],
    muscles: selectedMuscles as ExerciseAttributeValueEnum[],
    enabled: currentStep === 3, // Récupérer seulement à l'étape 3
  });

  // Navigation entre les étapes
  const goToStep = useCallback(
    (step: WorkoutBuilderStep) => {
      setCurrentStep(step);
    },
    [setCurrentStep],
  );

  const nextStep = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, setCurrentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  // Gestion des équipements
  const toggleEquipment = useCallback(
    (equipment: ExerciseAttributeValueEnum) => {
      setSelectedEquipment((prev) => {
        if (prev.includes(equipment)) {
          return prev.filter((e) => e !== equipment);
        } else {
          return [...prev, equipment];
        }
      });
    },
    [setSelectedEquipment],
  );

  const clearEquipment = useCallback(() => {
    setSelectedEquipment([]);
  }, [setSelectedEquipment]);

  // Gestion des muscles
  const toggleMuscle = useCallback(
    (muscle: ExerciseAttributeValueEnum) => {
      console.log("muscle:", muscle);
      setSelectedMuscles((prev) => {
        if (prev.includes(muscle)) {
          return prev.filter((m) => m !== muscle);
        } else {
          return [...prev, muscle];
        }
      });
    },
    [setSelectedMuscles],
  );

  const clearMuscles = useCallback(() => {
    setSelectedMuscles([]);
  }, [setSelectedMuscles]);

  // Validation des étapes
  const canProceedToStep2 = selectedEquipment.length > 0;
  const canProceedToStep3 = selectedMuscles.length > 0;

  return {
    // État
    currentStep: currentStep as WorkoutBuilderStep,
    selectedEquipment: selectedEquipment as ExerciseAttributeValueEnum[],
    selectedMuscles: selectedMuscles as ExerciseAttributeValueEnum[],

    // Exercices
    exercisesByMuscle,
    isLoadingExercises,
    exercisesError,

    // Navigation
    goToStep,
    nextStep,
    prevStep,

    // Équipements
    toggleEquipment,
    clearEquipment,

    // Muscles
    toggleMuscle,
    clearMuscles,

    // Validation
    canProceedToStep2,
    canProceedToStep3,
  };
}
