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
    shuffleExercise,
    pickExercise,
    isShuffling,
    deleteExercise,
  } = useWorkoutBuilderStore();

  const canProceedToStep2 = selectedEquipment.length > 0;
  const canProceedToStep3 = selectedMuscles.length > 0;

  return {
    // state
    currentStep,
    selectedEquipment,
    selectedMuscles,

    // exercises
    exercisesByMuscle,
    isLoadingExercises,
    exercisesError,

    // navigation
    goToStep: setStep,
    nextStep,
    prevStep,

    // equipment
    toggleEquipment,
    clearEquipment,

    // muscles
    toggleMuscle,
    clearMuscles,

    // validation
    canProceedToStep2,
    canProceedToStep3,

    // fetch
    fetchExercises,

    // order
    exercisesOrder,
    setExercisesOrder,

    // shuffle
    shuffleExercise,

    // additional
    isShuffling,

    // pick
    pickExercise,

    // delete
    deleteExercise,
  };
}
