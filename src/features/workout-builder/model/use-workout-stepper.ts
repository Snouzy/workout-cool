"use client";

import { useWorkoutBuilderStore } from "./workout-builder.store";

export function useWorkoutStepper() {
  const {
    currentStep,
    selectedEquipment,
    selectedMuscles,
    exercisesByMuscle,
    isLoadingExercises,
    exercisesError,
    setStep,
    nextStep,
    prevStep,
    toggleEquipment,
    clearEquipment,
    toggleMuscle,
    clearMuscles,
    fetchExercises,
    exercisesOrder,
    setExercisesOrder,
  } = useWorkoutBuilderStore();

  // Validation des étapes
  const canProceedToStep2 = selectedEquipment.length > 0;
  const canProceedToStep3 = selectedMuscles.length > 0;

  return {
    // État
    currentStep,
    selectedEquipment,
    selectedMuscles,

    // Exercices
    exercisesByMuscle,
    isLoadingExercises,
    exercisesError,

    // Navigation
    goToStep: setStep,
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

    // Fetch
    fetchExercises,

    // Order
    exercisesOrder,
    setExercisesOrder,
  };
}
