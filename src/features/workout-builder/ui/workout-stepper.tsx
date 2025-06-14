"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useI18n } from "locales/client";
import Trophy from "@public/images/trophy.png";
import { WorkoutSessionSets } from "@/features/workout-session/ui/workout-session-sets";
import { WorkoutSessionHeader } from "@/features/workout-session/ui/workout-session-header";
import { WorkoutBuilderFooter } from "@/features/workout-builder/ui/workout-stepper-footer";
import { Button } from "@/components/ui/button";

import { StepperStepProps } from "../types";
import { useWorkoutStepper } from "../model/use-workout-stepper";
import { useWorkoutSession } from "../../workout-session/model/use-workout-session";
import { StepperHeader } from "./stepper-header";
import { MuscleSelection } from "./muscle-selection";
import { ExercisesSelection } from "./exercises-selection";
import { EquipmentSelection } from "./equipment-selection";

import type { ExerciseWithAttributes } from "../types";

export function WorkoutStepper() {
  const { loadSessionFromLocal } = useWorkoutSession();

  const t = useI18n();
  const router = useRouter();
  const {
    currentStep,
    selectedEquipment,
    nextStep,
    prevStep,
    toggleEquipment,
    clearEquipment,
    selectedMuscles,
    toggleMuscle,
    canProceedToStep2,
    canProceedToStep3,
    isLoadingExercises,
    exercisesByMuscle,
    exercisesError,
    fetchExercises,
    exercisesOrder,
  } = useWorkoutStepper();

  useEffect(() => {
    loadSessionFromLocal();
  }, []);

  // dnd-kit et flatExercises doivent être avant tout return/condition
  const [flatExercises, setFlatExercises] = useState<{ id: string; muscle: string; exercise: ExerciseWithAttributes }[]>([]);

  useEffect(() => {
    if (exercisesByMuscle.length > 0) {
      const flat = exercisesByMuscle.flatMap((group) =>
        group.exercises.map((exercise: ExerciseWithAttributes) => ({
          id: exercise.id,
          muscle: group.muscle,
          exercise,
        })),
      );
      setFlatExercises(flat);
    }
  }, [exercisesByMuscle]);

  // Fetch exercises quand on arrive à l'étape 3
  useEffect(() => {
    if (currentStep === 3 && exercisesByMuscle.length === 0) {
      fetchExercises();
    }
  }, [currentStep, selectedEquipment, selectedMuscles, exercisesByMuscle.length]);

  const {
    isWorkoutActive,
    session,
    startWorkout,
    currentExercise,
    formatElapsedTime,
    isTimerRunning,
    toggleTimer,
    resetTimer,
    quitWorkout,
  } = useWorkoutSession();

  const canContinue = currentStep === 1 ? canProceedToStep2 : currentStep === 2 ? canProceedToStep3 : exercisesByMuscle.length > 0;

  // Actions pour les exercices
  const handleShuffleExercise = (exerciseId: string, muscle: string) => {
    // TODO: Implémenter la logique pour remplacer l'exercice par un autre
    console.log("Shuffle exercise:", exerciseId, "for muscle:", muscle);
  };

  const handlePickExercise = (exerciseId: string) => {
    // later
    console.log("Pick exercise:", exerciseId);
  };

  const handleDeleteExercise = (exerciseId: string, muscle: string) => {
    // TODO: Implémenter la logique pour supprimer l'exercice
    console.log("Delete exercise:", exerciseId, "for muscle:", muscle);
  };

  const handleAddExercise = () => {
    // TODO: Implémenter la logique pour ajouter un exercice
    console.log("Add exercise");
  };

  const orderedExercises = exercisesOrder.length
    ? exercisesOrder
        .map((id) => flatExercises.find((item) => item.id === id))
        .filter(Boolean)
        .map((item) => item!.exercise)
    : flatExercises.map((item) => item.exercise);

  const handleStartWorkout = () => {
    if (orderedExercises.length > 0) {
      startWorkout(orderedExercises, selectedEquipment, selectedMuscles);
    }
  };

  const [showCongrats, setShowCongrats] = useState(false);

  if (showCongrats && !isWorkoutActive) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Image alt="Trophée" className="w-56 h-56" src={Trophy} />
        <h2 className="text-2xl font-bold mb-2">{t("workout_builder.session.congrats")}</h2>
        <p className="text-lg text-slate-600 mb-6">{t("workout_builder.session.congrats_subtitle")}</p>
        <Button onClick={() => router.push("/profile")}>{t("commons.go_to_profile")}</Button>
      </div>
    );
  }
  if (isWorkoutActive && session) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        {!showCongrats && (
          <WorkoutSessionHeader
            currentExerciseIndex={session.exercises.findIndex((exercise) => exercise.id === currentExercise?.id)}
            elapsedTime={formatElapsedTime()}
            isTimerRunning={isTimerRunning}
            onQuitWorkout={quitWorkout}
            onResetTimer={resetTimer}
            onToggleTimer={toggleTimer}
          />
        )}
        <WorkoutSessionSets isWorkoutActive={isWorkoutActive} onCongrats={() => setShowCongrats(true)} showCongrats={showCongrats} />
      </div>
    );
  }

  const STEPPER_STEPS: StepperStepProps[] = [
    {
      stepNumber: 1,
      title: t("workout_builder.steps.equipment.title"),
      description: t("workout_builder.steps.equipment.description"),
      isActive: false,
      isCompleted: false,
    },
    {
      stepNumber: 2,
      title: t("workout_builder.steps.muscles.title"),
      description: t("workout_builder.steps.muscles.description"),
      isActive: false,
      isCompleted: false,
    },
    {
      stepNumber: 3,
      title: t("workout_builder.steps.exercises.title"),
      description: t("workout_builder.steps.exercises.description"),
      isActive: false,
      isCompleted: false,
    },
  ];

  const steps = STEPPER_STEPS.map((step) => ({
    ...step,
    isActive: step.stepNumber === currentStep,
    isCompleted: step.stepNumber < currentStep,
  }));

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <EquipmentSelection onClearEquipment={clearEquipment} onToggleEquipment={toggleEquipment} selectedEquipment={selectedEquipment} />
        );
      case 2:
        return <MuscleSelection onToggleMuscle={toggleMuscle} selectedEquipment={selectedEquipment} selectedMuscles={selectedMuscles} />;
      case 3:
        return (
          <ExercisesSelection
            error={exercisesError}
            exercisesByMuscle={exercisesByMuscle}
            isLoading={isLoadingExercises}
            onAdd={handleAddExercise}
            onDelete={handleDeleteExercise}
            onPick={handlePickExercise}
            onShuffle={handleShuffleExercise}
            onStartWorkout={handleStartWorkout}
            t={t}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <StepperHeader steps={steps} />

      <div className="min-h-[400px] mb-8">{renderStepContent()}</div>

      <WorkoutBuilderFooter
        canContinue={canContinue}
        currentStep={currentStep}
        onNext={nextStep}
        onPrevious={prevStep}
        selectedEquipment={selectedEquipment}
        selectedMuscles={selectedMuscles}
        totalSteps={STEPPER_STEPS.length}
      />
    </div>
  );
}
