"use client";

import { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { useI18n } from "locales/client";
import Trophy from "@public/images/trophy.png";
import { WorkoutSessionSets } from "@/features/workout-session/ui/workout-session-sets";
import { WorkoutSessionHeader } from "@/features/workout-session/ui/workout-session-header";
import { DonationModal } from "@/features/workout-session/ui/donation-modal";
import { useDonationModal } from "@/features/workout-session/hooks/use-donation-modal";
import { WorkoutBuilderFooter } from "@/features/workout-builder/ui/workout-stepper-footer";
import { Button } from "@/components/ui/button";

import { StepperStepProps } from "../types";
import { useWorkoutStepper } from "../model/use-workout-stepper";
import { useWorkoutSession } from "../../workout-session/model/use-workout-session";
import { StepperHeader } from "./stepper-header";
import { MuscleSelection } from "./muscle-selection";
import { ExercisesSelection } from "./exercises-selection";
import { EquipmentSelection } from "./equipment-selection";

import type { ExerciseWithAttributes, WorkoutBuilderStep } from "../types";

export function WorkoutStepper() {
  const { loadSessionFromLocal } = useWorkoutSession();

  const t = useI18n();
  const router = useRouter();
  const [fromSession, setFromSession] = useQueryState("fromSession");
  const {
    currentStep,
    selectedEquipment,
    selectedMuscles,
    exercisesByMuscle,
    isLoadingExercises,
    exercisesError,
    nextStep,
    prevStep,
    toggleEquipment,
    clearEquipment,
    toggleMuscle,
    canProceedToStep2,
    canProceedToStep3,
    fetchExercises,
    exercisesOrder,
    shuffleExercise,
    pickExercise,
    shufflingExerciseId,
    goToStep,
    deleteExercise,
  } = useWorkoutStepper();

  useEffect(() => {
    loadSessionFromLocal();
  }, []);

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

  useEffect(() => {
    if (currentStep === 3 && !fromSession) {
      fetchExercises();
    }
  }, [currentStep, selectedEquipment, selectedMuscles, fromSession]);

  const { isWorkoutActive, session, startWorkout, quitWorkout } = useWorkoutSession();

  const canContinue = currentStep === 1 ? canProceedToStep2 : currentStep === 2 ? canProceedToStep3 : exercisesByMuscle.length > 0;

  const handleShuffleExercise = async (exerciseId: string, muscle: string) => {
    try {
      const muscleEnum = muscle as ExerciseAttributeValueEnum;
      await shuffleExercise(exerciseId, muscleEnum);
    } catch (error) {
      console.error("Error shuffling exercise:", error);
      alert("Error shuffling exercise. Please try again.");
    }
  };

  const handlePickExercise = async (exerciseId: string) => {
    try {
      await pickExercise(exerciseId);
      console.log("Exercise picked successfully!");
    } catch (error) {
      console.error("Error picking exercise:", error);
      alert("Error picking exercise. Please try again.");
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    deleteExercise(exerciseId);
  };

  const handleAddExercise = () => {
    alert("TODO : Add exercise 🥶");
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
  const { showModal, openModal, closeModal } = useDonationModal();

  const goToProfile = () => {
    router.push("/profile");
  };

  const handleCongrats = () => {
    setShowCongrats(true);
    // Show donation modal after congrats screen appears
    setTimeout(() => {
      openModal();
    }, 400);
  };

  const handleToggleEquipment = (equipment: ExerciseAttributeValueEnum) => {
    toggleEquipment(equipment);
    if (fromSession) setFromSession(null);
  };

  const handleClearEquipment = () => {
    clearEquipment();
    if (fromSession) setFromSession(null);
  };

  const handleToggleMuscle = (muscle: ExerciseAttributeValueEnum) => {
    toggleMuscle(muscle);
    if (fromSession) setFromSession(null);
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < currentStep) {
      goToStep(stepNumber as WorkoutBuilderStep);
    }
  };

  if (showCongrats && !isWorkoutActive) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-16 h-full">
          <Image alt="Trophée" className="w-56 h-56" src={Trophy} />
          <h2 className="text-2xl font-bold mb-2 text-center">{t("workout_builder.session.congrats")}</h2>
          <p className="text-lg text-slate-600 mb-6">{t("workout_builder.session.congrats_subtitle")}</p>
          <Button onClick={goToProfile}>{t("commons.go_to_profile")}</Button>
        </div>
        {/* Donation Modal */}
        <DonationModal isOpen={showModal} onClose={closeModal} />
      </>
    );
  }

  if (isWorkoutActive && session) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        {!showCongrats && <WorkoutSessionHeader onQuitWorkout={quitWorkout} />}
        <WorkoutSessionSets isWorkoutActive={isWorkoutActive} onCongrats={handleCongrats} showCongrats={showCongrats} />
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
          <EquipmentSelection
            onClearEquipment={handleClearEquipment}
            onToggleEquipment={handleToggleEquipment}
            selectedEquipment={selectedEquipment}
          />
        );
      case 2:
        return (
          <MuscleSelection onToggleMuscle={handleToggleMuscle} selectedEquipment={selectedEquipment} selectedMuscles={selectedMuscles} />
        );
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
            shufflingExerciseId={shufflingExerciseId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full">
      <StepperHeader currentStep={currentStep} onStepClick={handleStepClick} steps={steps} />

      <div className="px-2 sm:px-6">{renderStepContent()}</div>

      <WorkoutBuilderFooter
        canContinue={canContinue}
        currentStep={currentStep}
        onNext={nextStep}
        onPrevious={prevStep}
        onStartWorkout={handleStartWorkout}
        totalSteps={STEPPER_STEPS.length}
      />
    </div>
  );
}
